const express = require('express');
const appService = require('./appService');

const router = express.Router();

// ----------------------------------------------------------
// API endpoints
// Modify or extend these routes based on your project's needs.
router.get('/check-db-connection', async (req, res) => {
    const isConnect = await appService.testOracleConnection();
    if (isConnect) {
        res.send('connected');
    } else {
        res.send('unable to connect');
    }
});

router.get('/demotable', async (req, res) => {
    const tableContent = await appService.fetchDemotableFromDb();
    res.json({data: tableContent});
});

router.post("/initiate-demotable", async (req, res) => {
    const initiateResult = await appService.initiateDemotable();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-demotable", async (req, res) => {
    console.log('Received data:', req.body);
    const { id: CharityID, address: Address, name: Name } = req.body;
    const insertResult = await appService.insertDemotable(CharityID, Address, Name);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.get('/count-demotable', async (req, res) => {
    const tableCount = await appService.countDemotable();
    if (tableCount >= 0) {
        res.json({ 
            success: true,  
            count: tableCount
        });
    } else {
        res.status(500).json({ 
            success: false, 
            count: tableCount
        });
    }
});


router.post('/insert-recipient', async (req, res) => {
    console.log('Received data:', req.body);
    const {  SinNum,
              EventID,
              Age,
              ContactNum,
              Gender
 } = req.body;
    const result = await appService.insertRecipient(SinNum, EventID, Age, ContactNum, Gender);
    if (result) {
        res.status(200).json({ success: true });
    } else {
        res.status(400).json({ success: false});
    }
});

router.get('/recipients', async (req, res) => {
    const tableContent = await appService.fetchRecipients();
    res.json({data: tableContent});
});

router.post("/update-recipients", async (req, res) => {
    try {
        console.log('Received data:', req.body);
        const { SinNum, EventID, Age, ContactNum, Gender } = req.body;
        if (!SinNum) {
            return res.status(400).json({
                success: false,
                message: "SinNum is required for updating a recipient"
            });
        }
        const updateResult = await appService.updateRecipients(SinNum, EventID, Age, ContactNum, Gender);
        if (updateResult) {
            res.json({ success: true });
        } else {
            res.status(500).json({
                success: false,
                message: "Update failed"
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.get("/recipients-for-food/:foodID", async (req, res) => {
    try {
        console.log('Received Food ID:', req.params.foodID); // Log parameterss
        const foodID = parseInt(req.params.foodID);
        const recipients = await appService.getRecipientsForFood(foodID);
        console.log('Recipients found:', recipients);
        res.json(recipients);
    } catch (error) {
        console.error('Error in route:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.get("/event-recipient-aggregation", async (req, res) => {
    try {
        const results = await appService.getEventRecipientAggregation();
        res.json(results);
    } catch (error) {
        console.error('Error in event recipient aggregation:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// SELECT!!!
router.post("/search-charities", async (req, res) => {
    try {
        console.log('Received data:', req.body);
        const { conditions, logicalOperators } = req.body;
        const results = await appService.searchCharities(conditions, logicalOperators);
        res.json(results);
    } catch (error) {
        console.error('Error in charity search:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get("/recipient-age-count", async (req, res) => {
    try {
        console.log('Received data:', req.body);
        const results = await appService.getRecipientAgeCount();
        res.json(results);
    } catch (error) {
        console.error('Error in recipient age count:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get("/lowest-age-event-query", async (req, res) => {
    try {
        console.log('Received data:', req.body);
        const results = await appService.lowestAgeEvent();
        res.json(results);
    } catch (error) {
        console.error('Error in lowest age event query:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});
module.exports = router;