/*
 * These functions below are for various webpage functionalities. 
 * Each function serves to process data on the frontend:
 *      - Before sending requests to the backend.
 *      - After receiving responses from the backend.
 * 
 * To tailor them to your specific needs,
 * adjust or expand these functions to match both your 
 *   backend endpoints 
 * and 
 *   HTML structure.
 * 
 */


// This function checks the database connection and updates its status on the frontend.
async function checkDbConnection() {
    const statusElem = document.getElementById('dbStatus');
    const loadingGifElem = document.getElementById('loadingGif');

    const response = await fetch('/check-db-connection', {
        method: "GET"
    });

    // Hide the loading GIF once the response is received.
    loadingGifElem.style.display = 'none';
    // Display the statusElem's text in the placeholder.
    statusElem.style.display = 'inline';

    response.text()
    .then((text) => {
        statusElem.textContent = text;
    })
    .catch((error) => {
        statusElem.textContent = 'connection timed out';  // Adjust error handling if required.
    });
}

// Fetches data from the demotable and displays it.
async function fetchAndDisplayUsers() {
    const tableElement = document.getElementById('demotable');
    const tableBody = document.getElementById('charitiestable');

    const response = await fetch('/demotable', {
        method: 'GET'
    });

    const responseData = await response.json();
    const demotableContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    demotableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

// This function resets or initializes the demotable.
async function resetDemotable() {
    const response = await fetch("/initiate-demotable", {
        method: 'POST'
    });
    const responseData = await response.json();

    if (responseData.success) {
        const messageElement = document.getElementById('resetResultMsg');
        messageElement.textContent = "demotable initiated successfully!";
        fetchTableData();
    } else {
        alert("Error initiating table!");
    }
}

// Inserts new records into the demotable.
async function insertDemotable(event) {
    event.preventDefault();

    const idValue = document.getElementById('insertId').value;
    const addressValue = document.getElementById('insertAddress').value;
    const nameValue = document.getElementById('insertName').value;
    console.log(idValue);
    const response = await fetch('/insert-demotable', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: idValue,
            address: addressValue,
            name: nameValue

        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('insertResultMsg');
      messageElement.textContent = "Data inserted successfully!";
    if (responseData.success) {
        messageElement.textContent = "Data inserted successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error inserting data!";
    }
}

// Counts rows in the demotable.
// Modify the function accordingly if using different aggregate functions or procedures.
async function countDemotable() {
    const response = await fetch("/count-demotable", {
        method: 'GET'
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('countResultMsg');

    if (responseData.success) {
        const tupleCount = responseData.count;
        messageElement.textContent = `The number of tuples in demotable: ${tupleCount}`;
    } else {
        alert("Error in count demotable!");
    }
}


// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function() {
    checkDbConnection();
    fetchTableData();
    document.getElementById("resetDemotable").addEventListener("click", resetDemotable);
    document.getElementById("insertDemotable").addEventListener("submit", insertDemotable);
    document.getElementById("countDemotable").addEventListener("click", countDemotable);
    document.getElementById('insertRecipientForm').addEventListener('submit', insertRecipient);
    document.getElementById('updateRecipient').addEventListener('submit', updateRecipients);
    document.getElementById('foodRecipientsForm').addEventListener('submit', fetchFoodRecipients);
    document.getElementById('runAggregationQuery').addEventListener('click', runEventRecipientAggregation);
    document.getElementById('runAgeCountQuery').addEventListener('click', runRecipientAgeCountQuery);
    document.getElementById('lowestAgeEvent').addEventListener('click', lowestAgeEvent);
    document.getElementById('searchBtn').addEventListener('click', performCharitiesSearch);
    document.getElementById('addAndConditionBtn').addEventListener('click', () => addConditionRow('AND'));
    document.getElementById('addOrConditionBtn').addEventListener('click', () => addConditionRow('OR'));
    document.getElementById("projectionForm").addEventListener("submit", projectionCharity);
    document.getElementById("divisionButton").addEventListener("click", divisionRecipients);
    document.getElementById("deleteFoodDonor").addEventListener("submit", deleteDonor);
};

// General function to refresh the displayed table data.
// You can invoke this after any table-modifying operation to keep consistency.
function fetchTableData() {
    fetchAndDisplayUsers();
    fetchAndDisplayRecipients();
    fetchAndDisplayFoodDonor()
}

async function insertRecipient(event) {
    event.preventDefault();
    const sinValue = document.getElementById('sinNumber').value;
    console.log(sinValue);
    const eventIDValue = document.getElementById('eventId').value;
    const ageValue = document.getElementById('age').value;
    const contactValue = document.getElementById('contactNumber').value;
    const genderValue = document.getElementById('gender').value;

    const response = await fetch('/insert-recipient', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ SinNum: sinValue, EventID: eventIDValue, Age: ageValue, ContactNum: contactValue, Gender: genderValue || null })
    });
    const responseData = await response.json();
    const messageElement = document.getElementById('insertRecipientMsg')
        if (responseData.success) {
            messageElement.textContent = "Recipient inserted successfully!";
            messageElement.style.color = 'green';
            fetchTableData();
        } else {
           messageElement.textContent = "Error inserting data!";
           messageElement.style.color = 'red';
}}

async function fetchAndDisplayRecipients() {
    const tableElement = document.getElementById('recipienttable');
    const tableElement2 = document.getElementById('recipienttable2');
    const tableBody = document.getElementById("recipients-body");
    const tableBody2 = document.getElementById("recipients-body2");

    const response = await fetch('/recipients', {
        method: 'GET'
    });

    const responseData = await response.json();
    const recipientContent = responseData.data;

    if (tableBody) {
        tableBody.innerHTML = '';
    }
    if (tableBody2) {
            tableBody2.innerHTML = '';
        }

    recipientContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });

    recipientContent.forEach(user => {
            const row = tableBody2.insertRow();
            user.forEach((field, index) => {
                const cell = row.insertCell(index);
                cell.textContent = field;
            });
        });
}

async function updateRecipients(event) {
    event.preventDefault();
    const SinNum = document.getElementById('updateSinNum').value;
    const EventID = document.getElementById('updateEventID').value || null;
    const Age = document.getElementById('updateAge').value || null;
    const ContactNum = document.getElementById('updateContactNum').value || null;
    const Gender = document.getElementById('updateGender').value || null;

    try {
        const response = await fetch('/update-recipients', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                SinNum,
                EventID,
                Age: Age ? parseInt(Age) : null,
                ContactNum,
                Gender
            })
        });

        const responseData = await response.json();
        const messageElement = document.getElementById('updateRecipientResultMsg');

        if (responseData.success) {
            messageElement.textContent = "Recipient updated successfully!";
            messageElement.style.color = 'green';
            fetchTableData();
        } else {
            messageElement.textContent = `Error updating recipient: ${responseData.message || 'Unknown error'}`;
            messageElement.style.color = 'red';
        }
    } catch (error) {
        const messageElement = document.getElementById('updateRecipientResultMsg');
        messageElement.textContent = `Network error: ${error.message}`;
        messageElement.style.color = 'red';
    }
}

// JOIN!!!!
async function fetchFoodRecipients(event) {
    event.preventDefault();

    const foodID = document.getElementById('foodIDInput').value;

    const messageElement = document.getElementById('foodRecipientsMessage');
    const tableBody = document.getElementById('recipientsTableBody');

    try {
        tableBody.innerHTML = '';
        messageElement.textContent = '';

        const response = await fetch(`/recipients-for-food/${foodID}`);

        console.log('Response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        const recipients = await response.json();
        console.log('Received recipients:', recipients); // Add logging

        if (!recipients || recipients.length === 0) {
            messageElement.textContent = `No recipients found for Food ID ${foodID}`;
            messageElement.style.color = 'orange';
            return;
        }

        recipients.forEach(recipient => {
            const row = tableBody.insertRow();
            const sinCell = row.insertCell(0);
            const contactCell = row.insertCell(1);

            sinCell.textContent = recipient.SINNUM || recipient.SinNum;
            contactCell.textContent = recipient.CONTACTNUM || recipient.ContactNum;
        });

        messageElement.textContent = `Found ${recipients.length} recipients for Food ID ${foodID}`;
        messageElement.style.color = 'green';

    } catch (error) {
        console.error('Full error:', error);
        messageElement.textContent = `Error: ${error.message}`;
        messageElement.style.color = 'red';
    }
}

async function runEventRecipientAggregation() {
    const messageElement = document.getElementById('aggregationQueryMessage');
    const tableBody = document.getElementById('aggregationResultBody');

    try {
        tableBody.innerHTML = '';
        messageElement.textContent = '';

        const response = await fetch('/event-recipient-aggregation');

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        const results = await response.json();
        console.log('Raw aggregation results:', results);

        if (!results || results.length === 0) {
            messageElement.textContent = 'No events found with 5 or more recipients';
            messageElement.style.color = 'orange';
            return;
        }

        results.forEach(result => {
            console.log('Processing result:', result);
            const row = tableBody.insertRow();

            const eventIdCell = row.insertCell(0);
            const avgAgeCell = row.insertCell(1);
            const recipientCountCell = row.insertCell(2);

            eventIdCell.textContent = result.EVENTID ?? 'N/A';
            avgAgeCell.textContent = result.AVG_AGE !== undefined
                ? Number(result.AVG_AGE).toFixed(2)
                : 'N/A';
            recipientCountCell.textContent = result.RECIPIENT_COUNT ?? 'N/A';
        });

        messageElement.textContent = `Found ${results.length} events with 2 or more recipients`;
        messageElement.style.color = 'green';

    } catch (error) {
        console.error('Full error:', error);
        messageElement.textContent = `Error: ${error.message}`;
        messageElement.style.color = 'red';
    }
}

// Utility function to create a logical operator display
function createLogicalOperator(type) {
    const operatorSpan = document.createElement('span');
    operatorSpan.textContent = type;
    operatorSpan.classList.add('logical-operator');
    return operatorSpan;
}

// Function to add a new condition row
function addConditionRow(logicalOperator) {
    const conditionsContainer = document.getElementById('conditionsContainer');

    if (conditionsContainer.children.length > 0) {
        conditionsContainer.appendChild(createLogicalOperator(logicalOperator));
    }

    const templateRow = conditionsContainer.querySelector('.condition-row');
    const newRow = templateRow.cloneNode(true);

    newRow.querySelector('.value-input').value = '';

    const removeBtn = newRow.querySelector('.remove-condition');
    removeBtn.style.display = 'inline-block';
    removeBtn.addEventListener('click', function() {
        const prevOperator = newRow.previousElementSibling;
        if (prevOperator && prevOperator.classList.contains('logical-operator')) {
            prevOperator.remove();
        }
        newRow.remove();
    });
    conditionsContainer.appendChild(newRow);
}

async function performCharitiesSearch() {
    const conditionsContainer = document.getElementById('conditionsContainer');
    const messageElement = document.getElementById('searchMessage');
    const tableBody = document.getElementById('searchResultBody');

    const conditions = [];
    const logicalOperators = [];

    const children = Array.from(conditionsContainer.children);
    children.forEach((child, index) => {
        if (child.classList.contains('condition-row')) {
            const attribute = child.querySelector('.attribute-select').value;
            const operator = child.querySelector('.operator-select').value;
            const value = child.querySelector('.value-input').value.trim();

            if (value) {
                conditions.push({ attribute, operator, value });
            }
        } else if (child.classList.contains('logical-operator')) {
            logicalOperators.push(child.textContent);
        }
    });

    if (conditions.length === 0) {
        messageElement.textContent = 'Please enter at least one search condition';
        messageElement.style.color = 'red';
        return;
    }

    try {
        tableBody.innerHTML = '';
        messageElement.textContent = '';

        const response = await fetch('/search-charities', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ conditions, logicalOperators })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        const results = await response.json();
        console.log('Search results:', results);

        if (!results || results.length === 0) {
            messageElement.textContent = 'No charities found matching the search criteria';
            messageElement.style.color = 'orange';
            return;
        }

        results.forEach(charity => {
            const row = tableBody.insertRow();
            const idCell = row.insertCell(0);
            const nameCell = row.insertCell(1);
            const addressCell = row.insertCell(2);

            idCell.textContent = charity[0];
            nameCell.textContent = charity[1];
            addressCell.textContent = charity[2];
        });

        messageElement.textContent = `Found ${results.length} charities matching the search criteria`;
        messageElement.style.color = 'green';
    } catch (error) {
        console.error('Search error:', error);
        messageElement.textContent = `Error: ${error.message}`;
        messageElement.style.color = 'red';
    }
}


async function runRecipientAgeCountQuery() {
    const messageElement = document.getElementById('ageCountQueryMessage');
    const tableBody = document.getElementById('ageCountResultBody');

    try {
        tableBody.innerHTML = '';
        messageElement.textContent = '';

        const response = await fetch('/recipient-age-count');

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        const results = await response.json();
        console.log('Raw age count results:', results);

        if (!results || results.length === 0) {
            messageElement.textContent = 'No age count data found';
            messageElement.style.color = 'orange';
            return;
        }

        results.forEach(result => {
            const row = tableBody.insertRow();
            const ageCell = row.insertCell(0);
            const countCell = row.insertCell(1);

            ageCell.textContent = result.AGE ?? 'N/A';
            countCell.textContent = result.AGE_COUNT ?? 'N/A';
        });

        messageElement.textContent = `Found recipient counts for ${results.length} different ages`;
        messageElement.style.color = 'green';

    } catch (error) {
        console.error('Error!! :', error);
        messageElement.textContent = `Error: ${error.message}`;
        messageElement.style.color = 'red';
    }
}

async function lowestAgeEvent() {
    const messageElement = document.getElementById('lowestAgeEventmsg');
    const tableBody = document.getElementById('lowestAgeEventBody');

    try {
        tableBody.innerHTML = '';

        const response = await fetch('/lowest-age-event-query');

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        const results = await response.json();
        console.log('Raw lowest age event results:', results);

        if (!results || results.length === 0) {
            messageElement.textContent = 'No events found with lowest average age';
            messageElement.style.color = 'orange';
            return;
        }
        results.forEach(result => {
            const row = tableBody.insertRow();
            const eventIdCell = row.insertCell(0);
            const eventNameCell = row.insertCell(1);
            const avgAgeCell = row.insertCell(2);

            eventIdCell.textContent = result.EVENTID ?? 'N/A';
            eventNameCell.textContent = result.EVENTNAME ?? 'N/A';
            avgAgeCell.textContent = result.AVG_EVENT_AGE !== undefined
                ? Number(result.AVG_EVENT_AGE).toFixed(2)
                : 'N/A';
        });

        messageElement.textContent = `Event with the lowest average recipient age`;
        messageElement.style.color = 'green';

    } catch (error) {
        console.error('Full error:', error);
        messageElement.textContent = `Error: ${error.message}`;
        messageElement.style.color = 'red';
    }
}

async function projectionCharity(event) {
    event.preventDefault();

    const checkboxes = document.querySelectorAll('input[name="attributes"]:checked');
    const selectedAttributes = Array.from(checkboxes).map((checkbox) => checkbox.value);

    if (selectedAttributes.length === 0) {
        document.getElementById('projectionResultMsg').textContent = 'Please select at least one attribute.';
        return;
    }

    const response = await fetch('/projection', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({attributes: selectedAttributes}),
    });

    const responseData = await response.json();
    const resultElement = document.getElementById('projectionResultMsg');

    if (responseData.success) {
        resultElement.innerHTML = '';

        const table = document.createElement('table');
        table.border = 1;

        const headerRow = document.createElement('tr');
        selectedAttributes.forEach((attribute) => {
            const th = document.createElement('th');
            th.textContent = attribute;
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);

        responseData.data.forEach((row) => {
            const tableRow = document.createElement('tr');
            row.forEach((cell) => {
                const td = document.createElement('td');
                td.textContent = cell;
                tableRow.appendChild(td);
            });
            table.appendChild(tableRow);
        });

        resultElement.appendChild(table);
    } else {
        resultElement.textContent = 'Error fetching projection results.';
    }
}

async function divisionRecipients() {
    console.log("clicked");
        try {
            const response = await fetch('/division-query');
            const responseData = await response.json();
            const tableBody = document.querySelector("#resultTable tbody");

            if (tableBody) {
                tableBody.innerHTML = '';
            }

            responseData.data.forEach(row => {
                const tr = tableBody.insertRow();
                Object.values(row).forEach((field, index) => {
                    const cell = tr.insertCell(index);
                    cell.textContent = field;
                });
            });
        } catch (error) {
            console.error("Error fetching division query results:", error);
        }
}

async function deleteDonor(event) {
    event.preventDefault();

    const donorIdValue = document.getElementById("deleteDonorID").value;

    const response = await fetch("/delete-donor", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({donorId: donorIdValue}),
    });

    const responseData = await response.json();
    const messageElement = document.getElementById("deleteResultMsg");
    if (responseData.success) {
        fetchTableData();
        messageElement.textContent = "FoodDonor deleted successfully!";
    } else {
        messageElement.textContent = "Error deleting FoodDonor!";
    }
}

async function fetchAndDisplayFoodDonor() {
    const tableElement = document.getElementById('fooddonor');
    const tableBody = document.getElementById('fooddonorstable');

    try {
        const response = await fetch('/fooddonor', {
            method: 'GET'
        });

        const responseData = await response.json();
        const demotableContent = responseData.data;

        if (tableBody) {
            tableBody.innerHTML = '';
        }

        demotableContent.forEach(donor => {
            const row = tableBody.insertRow();

            const donorIdCell = row.insertCell(0);
            const nameCell = row.insertCell(1);
            const typeCell = row.insertCell(2);
            const receiptNumCell = row.insertCell(3);

            donorIdCell.textContent = donor[0];
            nameCell.textContent = donor[1];
            typeCell.textContent = donor[2];
            receiptNumCell.textContent = donor[3];
        });
    } catch (error) {
        console.error('Error fetching food donors:', error);
    }
}

