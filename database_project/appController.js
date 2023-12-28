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

router.get('/clubtable', async (req, res) => {
    const tableContent = await appService.fetchclubtableFromDb();
    res.json({ data: tableContent });
});

/*
router.post("/initiate-clubtable", async (req, res) => {
    const initiateResult = await appService.initiateclubtable();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});
*/

router.post("/insert-clubtable", async (req, res) => {
    const { clubname, city, yearfounded, stadiumname, managername } = req.body;
    const insertResult = await appService.insertClubtable(clubname, city, yearfounded, stadiumname, managername);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.delete("/delete-clubtable", async (req, res) => {
    const { clubname } = req.body;
    const deleteResult = await appService.deleteValueclubtable(clubname);
    if (deleteResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/update-value-clubtable", async (req, res) => {
    const { updatedClub, updatedColumn, newValue } = req.body;
    const updateResult = await appService.updateValueclubtable(updatedClub, updatedColumn, newValue);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.get('/count-clubtable', async (req, res) => {
    const tableCount = await appService.countclubtable();
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

// Finding the club with the maximum total goals
router.get('/find-club-max-total-goals', async (req, res) => {
    try {
        const clubWithMaxTotalGoals = await appService.findClubWithMaxTotalGoals();
        res.json({
            success: true,
            clubWithMaxTotalGoals
        });
    } catch (error) {
        console.error('Error in /find-club-max-total-goals:', error);
        res.status(500).json({
            success: false,
            clubWithMaxTotalGoals: null
        });
    }
});




///================Player==========================//

router.get('/playertable', async (req, res) => {
    const tableContent = await appService.fetchplayertableFromDb();
    res.json({ data: tableContent });
});

router.post("/initiate-playertable", async (req, res) => {
    const initiateResult = await appService.initiateplayertable();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

// router.post("/filter-playertable", async (req, res) => {
//     const { filterPlayerName, filterAge, filterJerseyNumber, filterPosition, filterClubName } = req.body;

//     const filterResult = await appService.filterPlayerTable(filterPlayerName, filterAge, filterJerseyNumber, filterPosition, filterClubName);
//     if (filterResult) {
//         res.json({ success: true });
//     } else {
//         res.status(500).json({ success: false });
//     }
// });

router.post("/filter-playertable", async (req, res) => {
    const { filterPlayerName, filterAge, filterJerseyNumber, filterPosition, filterClubName } = req.body;

    const filterResult = await appService.filterPlayerTable(filterPlayerName, filterAge, filterJerseyNumber, filterPosition, filterClubName);
    if (filterResult) {
        res.json({
            success: true,
            data: filterResult
        });
    } else {
        res.status(500).json({
            success: false
        });
    }
});


router.post("/insert-playertable", async (req, res) => {
    const { playername, age, position, jerseynumber, clubname } = req.body;
    const insertResult = await appService.insertPlayertable(playername, age, position, jerseynumber, clubname);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.delete("/delete-playertable", async (req, res) => {
    const { playername } = req.body;
    const deleteResult = await appService.deleteValueplayertable(playername);
    if (deleteResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/update-value-playertable", async (req, res) => {
    const { updatedPlayer, updatedColumn, newValue } = req.body;
    const updateResult = await appService.updateValueplayertable(updatedPlayer, updatedColumn, newValue);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.get('/count-playertable', async (req, res) => {
    const tableCount = await appService.countplayertable();
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


// Aggragation by group
router.get('/aggregate-playertable', async (req, res) => {
    try {
        const { aggregateType } = req.query;
        const aggregateResult = await appService.aggregatePlayerTable(aggregateType);
        res.json({
            success: true,
            aggregateValue: aggregateResult
        });
    } catch (error) {
        console.error('Error in /aggregate-playertable:', error);
        res.status(500).json({
            success: false,
            aggregateValue: -1
        });
    }
});



//having
router.get('/having-playertable', async (req, res) => {
    const { minAvgAgeInput } = req.query;
    const clubsFound = await appService.findClubsWithOlderPlayers(minAvgAgeInput);

    //console.log('Clubs Found:', clubsFound);

    if (clubsFound && clubsFound.length > 0) {
        res.json({
            success: true,
            clubname: clubsFound,
        });
    } else {
        res.status(500).json({
            success: false,
            clubname: clubsFound,
        });
    }
});





//======================= Stadium===========================//


router.get('/stadiumtable', async (req, res) => {
    const tableContent = await appService.fetchstadiumtableFromDb();
    res.json({ data: tableContent });
});


router.post("/initiate-stadiumtable", async (req, res) => {
    const initiateResult = await appService.initiatestadiumtable();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-stadiumtable", async (req, res) => {
    const { stadiumname, city, country, capacity, yearbuilt } = req.body;
    const insertResult = await appService.insertStadiumtable(stadiumname, city, country, capacity, yearbuilt);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.delete("/delete-stadiumtable", async (req, res) => {
    const { stadiumname } = req.body;
    const deleteResult = await appService.deleteValuestadiumtable(stadiumname);
    if (deleteResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/update-value-stadiumtable", async (req, res) => {
    const { updatedStadium, updatedStadiumColumn, newStadiumValue } = req.body;
    const updateResult = await appService.updateValuestadiumtable(updatedStadium, updatedStadiumColumn, newStadiumValue);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.get('/count-stadiumtable', async (req, res) => {
    const tableCount = await appService.countstadiumtable();
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


//JOIN

router.get('/games-and-stadiums/:country', async (req, res) => {
    try {
        const { country } = req.params;

        // Call the AppService function to get games and stadiums by country
        const result = await appService.getGamesAndStadiumsByCountry(country);

        res.json(result);
    } catch (err) {
        console.error('Error in the route:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


//======================= Game ===========================//

router.get('/gametable', async (req, res) => {
    const tableContent = await appService.fetchgametableFromDb();
    res.json({ data: tableContent });
});

router.post("/initiate-gametable", async (req, res) => {
    const initiateResult = await appService.initiategametable();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-gametable", async (req, res) => {
    const { gamecode, gamedate, gameresult, stadiumname } = req.body;
    const insertResult = await appService.insertGametable(gamecode, gamedate, gameresult, stadiumname);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.delete("/delete-gametable", async (req, res) => {
    const { gamecode } = req.body;
    const deleteResult = await appService.deleteValuegametable(gamecode);
    if (deleteResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/update-value-gametable", async (req, res) => {
    const { updatedGameCode, updatedColumn, newValue } = req.body;
    const updateResult = await appService.updateValuegametable(updatedGameCode, updatedColumn, newValue);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.get('/count-gametable', async (req, res) => {
    const tableCount = await appService.countgametable();
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




//======================= Manager ===========================//


router.get('/managertable', async (req, res) => {
    const tableContent = await appService.fetchmanagertableFromDb();
    res.json({ data: tableContent });
});

router.post("/initiate-managertable", async (req, res) => {
    const initiateResult = await appService.initiatemanagertable();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-managertable", async (req, res) => {
    const { managername, country_of_origin, yearjoined } = req.body;
    const insertResult = await appService.insertManagertable(managername, country_of_origin, yearjoined);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.delete("/delete-managertable", async (req, res) => {
    const { managername } = req.body;
    const deleteResult = await appService.deleteValuemanagertable(managername);
    if (deleteResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/update-value-managertable", async (req, res) => {
    const { updatedManager, updatedColumn, newValue } = req.body;
    const updateResult = await appService.updateValuemanagertable(updatedManager, updatedColumn, newValue);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.get('/count-managertable', async (req, res) => {
    const tableCount = await appService.countmanagertable();
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


//======================= Referee ===========================//

router.get('/refereetable', async (req, res) => {
    const tableContent = await appService.fetchrefereetableFromDb();
    res.json({ data: tableContent });
});

router.post("/initiate-refereetable", async (req, res) => {
    const initiateResult = await appService.initiaterefereetable();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-refereetable", async (req, res) => {
    const { refereename, years_of_experience } = req.body;
    const insertResult = await appService.insertRefereetable(refereename, years_of_experience);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.delete("/delete-refereetable", async (req, res) => {
    const { refereename } = req.body;
    const deleteResult = await appService.deleteValuerefereetable(refereename);
    if (deleteResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/update-value-refereetable", async (req, res) => {
    const { updatedReferee, updatedColumn, newValue } = req.body;
    const updateResult = await appService.updateValuerefereetable(updatedReferee, updatedColumn, newValue);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.get('/count-refereetable', async (req, res) => {
    const tableCount = await appService.countrefereetable();
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


//======================= Club Owner ===========================//

router.get('/clubownertable', async (req, res) => {
    const tableContent = await appService.fetchclubownertableFromDb();
    res.json({ data: tableContent });
});

router.post("/initiate-clubownertable", async (req, res) => {
    const initiateResult = await appService.initiateclubownertable();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-clubownertable", async (req, res) => {
    const { clubownername, countryoforigin, year_joined, clubname } = req.body;
    const insertResult = await appService.insertClubownertable(clubownername, countryoforigin, year_joined, clubname);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.delete("/delete-clubownertable", async (req, res) => {
    const { clubownername } = req.body;
    const deleteResult = await appService.deleteValueclubownertable(clubownername);
    if (deleteResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/update-value-clubownertable", async (req, res) => {
    const { updatedClubowner, updatedColumn, newValue } = req.body;
    const updateResult = await appService.updateValueclubownertable(updatedClubowner, updatedColumn, newValue);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.get('/count-clubownertable', async (req, res) => {
    const tableCount = await appService.countclubownertable();
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

//======================= Season Record ===========================//

router.get('/seasonrecordtable', async (req, res) => {
    const tableContent = await appService.fetchseasonrecordtableFromDb();
    res.json({ data: tableContent });
});

router.post("/initiate-seasonrecordtable", async (req, res) => {
    const initiateResult = await appService.initiateseasonrecordtable();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-seasonrecordtable", async (req, res) => {
    const { playername, season, yellowcard, redcard, assists, goals } = req.body;
    const insertResult = await appService.insertSeasonRecordtable(playername, season, yellowcard, redcard, assists, goals);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.delete("/delete-seasonrecordtable", async (req, res) => {
    const { playername } = req.body;
    const deleteResult = await appService.deleteValueseasonrecordtable(playername);
    if (deleteResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});


router.post("/update-value-seasonrecordtable", async (req, res) => {
    const { updatedPlayer, updatedColumn, newValue } = req.body;
    const updateResult = await appService.updateValueseasonrecordtable(updatedPlayer, updatedColumn, newValue);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

// Projection
router.post("/update-columns-seasonrecordtable", async (req, res) => {
    const { columns } = req.body;
    const updateResult = await appService.fetchSelectedColumnsTable(columns);
    if (updateResult) {
        res.json({ success: true, data: updateResult });
    } else {
        res.status(500).json({ success: false });
    }
});


router.post("/find-players-without-red-cards", async (req, res) => {
    const { season } = req.body;

    try {
        const playersWithoutRedCards = await appService.findPlayersWithoutRedCards(season);
        res.json({ success: true, data: playersWithoutRedCards });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});




module.exports = router;
