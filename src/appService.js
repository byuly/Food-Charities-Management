const oracledb = require('oracledb');
const loadEnvFile = require('./utils/envUtil');
const fs = require("fs").promises;
const path = require("path");
const envVariables = loadEnvFile('./.env');

// Database configuration setup. Ensure your .env file has the required database credentials.
const dbConfig = {
    user: envVariables.ORACLE_USER,
    password: envVariables.ORACLE_PASS,
    connectString: `${envVariables.ORACLE_HOST}:${envVariables.ORACLE_PORT}/${envVariables.ORACLE_DBNAME}`,
    poolMin: 1,
    poolMax: 3,
    poolIncrement: 1,
    poolTimeout: 60
};

// initialize connection pool
async function initializeConnectionPool() {
    try {
        await oracledb.createPool(dbConfig);
        console.log('Connection pool started');
    } catch (err) {
        console.error('Initialization error: ' + err.message);
    }
}

async function closePoolAndExit() {
    console.log('\nTerminating');
    try {
        await oracledb.getPool().close(10); // 10 seconds grace period for connections to finish
        console.log('Pool closed');
        process.exit(0);
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}

initializeConnectionPool();

process
    .once('SIGTERM', closePoolAndExit)
    .once('SIGINT', closePoolAndExit);


// ----------------------------------------------------------
// Wrapper to manage OracleDB actions, simplifying connection handling.
async function withOracleDB(action) {
    let connection;
    try {
        connection = await oracledb.getConnection(); // Gets a connection from the default pool 
        return await action(connection);
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}



// ----------------------------------------------------------
// Core functions for database operations
// Modify these functions, especially the SQL queries, based on your project's requirements and design.
async function testOracleConnection() {
    return await withOracleDB(async (connection) => {
        return true;
    }).catch(() => {
        return false;
    });
}

async function fetchDemotableFromDb() {
    try {
        const result = await withOracleDB(async (connection) => {
            const result = await connection.execute('SELECT * FROM Charities');
            return result.rows;
        });
        return result || [];
    } catch (error) {
        console.error("Error fetching data from DB:", error);
        return [];
    }
}

async function dropAllTables(connection) {
    const tables = await connection.execute(
        `SELECT table_name FROM user_tables`
    );

    for (const row of tables.rows) {
        const tableName = row[0];
        try {
            console.log(`Dropping table: ${tableName}`);
            await connection.execute(`DROP TABLE ${tableName} CASCADE CONSTRAINTS`);
        } catch (err) {
            console.error(`Failed to drop table ${tableName}:`, err);
        }
    }
}

async function initiateDemotable() {
    return await withOracleDB(async (connection) => {
        await dropAllTables(connection);
        try {
            const sqlFilePath = path.join(__dirname, "/scripts/database.sql");
            const sqlScript = await fs.readFile(sqlFilePath, "utf8");

            const sqlStatements = sqlScript.split(";").map(stmt => stmt.trim()).filter(stmt => stmt);

            for (const statement of sqlStatements) {
                try {
                    console.log(`Executing statement: ${statement}`);
                    await connection.execute(statement, [], { autoCommit: true });
                } catch (stmtError) {
                    console.error(`Failed to execute statement: ${statement}`, stmtError);
                }
            }
            console.log("Tables created successfully.");
            return true;
        } catch (err) {
            console.error("Error executing SQL script:", err);
            return false;
        }
    }).catch((err) => {
        console.error("Database operation failed:", err);
        return false;
    });
}


async function insertDemotable(CharityID, Address, Name) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO Charities (CharityID, Address, Name) VALUES (:CharityID, :Address, :Name)`,
            [CharityID, Address, Name],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function countDemotable() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT Count(*) FROM DEMOTABLE');
        return result.rows[0][0];
    }).catch(() => {
        return -1;
    });
}

async function insertRecipient(SinNum, EventID, Age, ContactNum, Gender) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO Recipients (SinNum, EventID, Age, ContactNum, Gender)
             VALUES (:SinNum, :EventID, :Age, :ContactNum, :Gender)`,
            [SinNum, EventID, Age, ContactNum, Gender],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function fetchRecipients() {
    try {
        const result = await withOracleDB(async (connection) => {
            const result = await connection.execute('SELECT * FROM Recipients');
            return result.rows;
        });
        return result || [];
    } catch (error) {
        console.error("Error fetching data from DB:", error);
        return [];
    }
}

async function updateRecipients(SinNum, EventID, Age, ContactNum, Gender) {
    return await withOracleDB(async (connection) => {
        const updateFields = [];
        const bindParams = { SinNum };
        if (EventID !== null && EventID !== undefined) {
            updateFields.push('EventID = :EventID');
            bindParams.EventID = EventID;
        }
        if (Age !== null && Age !== undefined) {
            updateFields.push('Age = :Age');
            bindParams.Age = Age;
        }
        if (ContactNum !== null && ContactNum !== undefined) {
            updateFields.push('ContactNum = :ContactNum');
            bindParams.ContactNum = ContactNum;
        }
        if (Gender !== null && Gender !== undefined) {
            updateFields.push('Gender = :Gender');
            bindParams.Gender = Gender;
        }

        if (updateFields.length === 0) {
            return false;
        }

        const sqlQuery = `
            UPDATE Recipients
            SET ${updateFields.join(', ')}
            WHERE SinNum = :SinNum
        `;

        const result = await connection.execute(
            sqlQuery,
            bindParams,
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch((error) => {
        console.error('Update error:', error);
        throw error;
    });
}

async function getRecipientsForFood(foodID) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT
                FR.SinNum,
                R.ContactNum
            FROM
                FoodReceived FR
            JOIN
                Recipients R ON FR.SinNum = R.SinNum
            WHERE
                FR.FoodID = :foodID`,
            { foodID }
        );
        console.log('Raw result:', result.rows);
        // we need to extract nested array to display on frontend
        return result.rows.map(row => ({
            SinNum: row[0],
            ContactNum: row[1]
        }));
    });
}

async function getEventRecipientAggregation() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT
                R.EventID,
                ROUND(AVG(R.Age), 2) AS AVG_AGE,
                COUNT(*) AS RECIPIENT_COUNT
            FROM
                Recipients R
            GROUP BY
                R.EventID
            HAVING
                COUNT(*) >= 2`
        );

        console.log('Raw result:', result.rows);
        return result.rows.map(row => ({
            EVENTID: row[0],
            AVG_AGE: row[1],
            RECIPIENT_COUNT: row[2]
        }));
    });
}

// SELECT!!!!!!!
async function searchCharities(conditions, logicalOperator) {
    return await withOracleDB(async (connection) => {
        const whereClauses = [];
        const bindParams = {};

        conditions.forEach((condition, index) => {
            let paramName = `param${index}`;
            let clause;
            switch(condition.operator) {
                case '<':
                    clause = `${condition.attribute} < :${paramName}`;
                    bindParams[paramName] = condition.value;
                    break;
                case '>':
                    clause = `${condition.attribute} > :${paramName}`;
                    bindParams[paramName] = condition.value;
                    break;
                case '=':
                    clause = `${condition.attribute} = :${paramName}`;
                    bindParams[paramName] = condition.value;
                    break;
                case '!=':
                    clause = `${condition.attribute} != :${paramName}`;
                    bindParams[paramName] = condition.value;
                    break;
                default:
                    throw new Error(`Unsupported operator: ${condition.operator}`);
            }
            whereClauses.push(clause);
        });

        const sqlQuery = `
            SELECT CharityID, Name, Address
            FROM Charities
            ${whereClauses.length > 0 ? 'WHERE ' + whereClauses.join(` ${logicalOperator} `) : ''}
        `;

        console.log('Executing SQL:', sqlQuery);
        console.log('Bind parameters:', bindParams);

        const result = await connection.execute(
            sqlQuery,
            bindParams,
            { outFormat: connection.OBJECT }
        );
        console.log(result.rows);
        return result.rows;
    });
}

async function getRecipientAgeCount() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT Age, COUNT(*) AS AGE_COUNT
             FROM Recipients
             GROUP BY Age`
        );

        console.log('Raw result:', result.rows);

        return result.rows.map(row => ({
            AGE: row[0],
            AGE_COUNT: row[1]
        }));
    });
}


module.exports = {
    testOracleConnection,
    fetchDemotableFromDb,
    initiateDemotable,
    insertDemotable,
    countDemotable,
    insertRecipient,
    fetchRecipients,
    updateRecipients,
    getRecipientsForFood,
    getEventRecipientAggregation,
    searchCharities,
    getRecipientAgeCount
};