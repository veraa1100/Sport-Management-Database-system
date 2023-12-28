const oracledb = require('oracledb');
const loadEnvFile = require('./utils/envUtil');

const envVariables = loadEnvFile('./.env');

// Database configuration setup. Ensure your .env file has the required database credentials.
const dbConfig = {
    user: envVariables.ORACLE_USER,
    password: envVariables.ORACLE_PASS,
    connectString: `${envVariables.ORACLE_HOST}:${envVariables.ORACLE_PORT}/${envVariables.ORACLE_DBNAME}`
};


// ----------------------------------------------------------
// Wrapper to manage OracleDB actions, simplifying connection handling.
async function withOracleDB(action) {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
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

async function fetchclubtableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM CLUBTABLE');
        return result.rows;
    }).catch(() => {
        return [];
    });
}
/*
async function initiateclubtable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE CLUBTABLE`);
        } catch (err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE CLUBTABLE (
                clubname VARCHAR(20) PRIMARY KEY,
                city VARCHAR(20),
                yearfounded INT
            )
        `);
        return true;
    }).catch(() => {
        return false;
    });
}
*/


async function insertClubtable(clubname, city, yearfounded, stadiumname, managername) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO CLUBTABLE (clubname, city, yearfounded, stadiumname, managername) VALUES (:clubname, :city, :yearfounded, :stadiumname, :managername)`,
            [clubname, city, yearfounded, stadiumname, managername],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

// add stadiumname and managername
async function updateValueclubtable(updatedClub, updatedColumn, newValue) {
    return await withOracleDB(async (connection) => {
        const updateQuery = `
        UPDATE CLUBTABLE
        SET city = CASE WHEN :col = 'city' THEN :newVal ELSE city END,
        yearfounded = CASE WHEN :col = 'yearfounded' THEN TO_NUMBER(:newVal) ELSE yearfounded END
        WHERE clubname = :updatedClub`;

        const result = await connection.execute(
            updateQuery,
            { col: updatedColumn, newVal: newValue, updatedClub },
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function deleteValueclubtable(clubname) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `DELETE FROM CLUBTABLE WHERE clubname = :clubname`,
            [clubname],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

//change or delete
async function countclubtable() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT Count(*) FROM CLUBTABLE');
        return result.rows[0][0];
    }).catch(() => {
        return -1;
    });
}

//Nested aggragation

async function findClubWithMaxTotalGoals() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT clubname, MAX(total_goals) AS max_total_goals
             FROM (
                 SELECT p.clubname, SUM(sr.goals) AS total_goals
                 FROM SEASONRECORDTABLE sr
                 JOIN PLAYERTABLE p ON sr.playername = p.playername
                 GROUP BY p.clubname
             )
             GROUP BY clubname
             ORDER BY max_total_goals DESC`
        );

        console.log('Database Query Result:', result);

        return result.rows.map(row => ({ clubname: row[0], max_total_goals: row[1] }));
    }).catch(() => {
        throw new Error("Error in finding clubs with max total goals");
    });
}






//===================Players=============================//

async function fetchplayertableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM PLAYERTABLE');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function initiateplayertable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE PLAYERTABLE`);
        } catch (err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE PLAYERTABLE (
                playername VARCHAR(20) PRIMARY KEY,
                age INT,
                position VARCHAR(20),
                jerseynumber INT,
                clubname VARCHAR(20),
                FOREIGN KEY (clubname) REFERENCES CLUBTABLE(clubname)
                
            )
        `);
        return true;
    }).catch(() => {
        return false;
    });
}

async function filterPlayerTable(filterPlayerName, filterAge, filterJerseyNumber, filterPosition, filterClubName) {
    return await withOracleDB(async (connection) => {
        const filterConditions = [];
        const bindVariables = {};

        if (filterAge) {
            filterConditions.push('age = TO_NUMBER(:filterAge)');
            bindVariables.filterAge = { val: filterAge, type: oracledb.STRING };
        }

        if (filterPosition) {
            filterConditions.push('position = :filterPosition');
            bindVariables.filterPosition = { val: filterPosition, type: oracledb.STRING };
        }

        if (filterJerseyNumber) {
            filterConditions.push('jerseynumber = TO_NUMBER(:filterJerseyNumber)');
            bindVariables.filterJerseyNumber = { val: filterJerseyNumber, type: oracledb.STRING };
        }

        if (filterPlayerName) {
            filterConditions.push('playername = :filterPlayerName');
            bindVariables.filterPlayerName = { val: filterPlayerName, type: oracledb.STRING };
        }

        if (filterClubName) {
            filterConditions.push('clubname = :filterClubName');
            bindVariables.filterClubName = { val: filterClubName, type: oracledb.STRING };
        }

        const whereClause = filterConditions.length > 0 ? 'WHERE ' + filterConditions.join(' AND ') : '';

        const filterQuery = `
            SELECT *
            FROM PLAYERTABLE
            ${whereClause}`;

        const result = await connection.execute(
            filterQuery,
            bindVariables,
            { autoCommit: true }
        );

        // console.log("Result:", result); // produces the rows that should display
        // console.log(JSON.stringify(result));
        return result;
    }).catch(() => {
        return false;
    });
}


async function insertPlayertable(playername, age, position, jerseynumber, clubname) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO PLAYERTABLE (playername, age, position, jerseynumber, clubname) VALUES (:playername, :age, :position, :jerseynumber, :clubname)`,
            [playername, age, position, jerseynumber, clubname],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function updateValueplayertable(updatedPlayer, updatedColumn, newValue) {
    return await withOracleDB(async (connection) => {
        const updateQuery = `
            UPDATE PLAYERTABLE
            SET age = CASE WHEN :col = 'age' THEN TO_NUMBER(:newVal) ELSE age END,
                position = CASE WHEN :col = 'position' THEN :newVal ELSE position END,
                jerseynumber = CASE WHEN :col = 'jerseynumber' THEN TO_NUMBER(:newVal) ELSE jerseynumber END
            WHERE playername = :updatedPlayer`;

        const result = await connection.execute(
            updateQuery,
            { col: updatedColumn, newVal: newValue, updatedPlayer },
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function deleteValueplayertable(playername) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `DELETE FROM PLAYERTABLE WHERE playername = :playername`,
            [playername],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}



//aggregation
async function aggregatePlayerTable(aggregateType) {
    return await withOracleDB(async (connection) => {
        let query;

        switch (aggregateType) {
            case 'minimum':
                query = 'SELECT MIN(age) FROM PLAYERTABLE';
                break;
            case 'maximum':
                query = 'SELECT MAX(age) FROM PLAYERTABLE';
                break;
            case 'count':
                query = 'SELECT COUNT(*) FROM PLAYERTABLE';
                break;
            case 'average':
                query = 'SELECT AVG(age) FROM PLAYERTABLE';
                break;
            default:
                throw new Error('Invalid aggregateType');
        }

        const result = await connection.execute(query);
        // console.log('Result Rows:', result.rows);

        // return result.rows[0].RESULT;
        return result.rows;
    }).catch(() => {
        return -1;
    });
}



//having
async function findClubsWithOlderPlayers(minAvgAgeInput) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT clubname
             FROM PLAYERTABLE
             GROUP BY clubname
             HAVING AVG(age) > :minAvgAgeInput`,
            [minAvgAgeInput]
        );

        //console.log('Query Result:', result.rows);

        return result.rows.map(row => row[0]);
    }).catch(() => {
        throw new Error("Error in finding clubs with older players");
    });
}




//===================Stadium=============================//

async function fetchstadiumtableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM STADIUMTABLE');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function initiatestadiumtable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE STADIUMTABLE`);
        } catch (err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE STADIUMTABLE (
                stadiumname VARCHAR(20) PRIMARY KEY,
                city VARCHAR(20),
                country VARCHAR(20),
                capacity INT,
                yearbuilt INT
            
            )
        `);
        return true;
    }).catch(() => {
        return false;
    });
}

async function insertStadiumtable(stadiumname, city, country, capacity, yearbuilt) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO STADIUMTABLE (stadiumname, city, country, capacity, yearbuilt) VALUES (:stadiumname, :city, :country, :capacity, :yearbuilt)`,
            [stadiumname, city, country, capacity, yearbuilt],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function updateValuestadiumtable(updatedStadium, updatedStadiumColumn, newStadiumValue) {
    return await withOracleDB(async (connection) => {
        const updateQuery = `
            UPDATE STADIUMTABLE
            SET city = CASE WHEN :col = 'city' THEN :newVal ELSE city END,
                country = CASE WHEN :col = 'country' THEN :newVal ELSE country END,
                postalcode = CASE WHEN :col = 'postalcode' THEN :newVal ELSE postalcode END,
                capacity = CASE WHEN :col = 'capacity' THEN TO_NUMBER(:newVal) ELSE capacity END,
                yearbuilt = CASE WHEN :col = 'yearbuilt' THEN TO_NUMBER(:newVal) ELSE yearbuilt END
            WHERE stadiumname = :updatedStadium`;

        const result = await connection.execute(
            updateQuery,
            { col: updatedStadiumColumn, newVal: newStadiumValue, updatedStadium },
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function deleteValuestadiumtable(stadiumname) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `DELETE FROM STADIUMTABLE WHERE stadiumname = :stadiumname`,
            [stadiumname],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}


async function countstadiumtable() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT Count(*) FROM STADIUMTABLE');
        return result.rows[0][0];
    }).catch(() => {
        return -1;
    });
}

//JOIN
async function getGamesAndStadiumsByCountry(country) {
    return await withOracleDB(async (connection) => {
        const query = `
            SELECT g.gamecode, g.gamedate, g.gameresult, g.stadiumname,
                   s.city AS stadium_city, s.country AS stadium_country, s.capacity, s.yearbuilt
            FROM GAMETABLE g
            JOIN STADIUMTABLE s ON g.stadiumname = s.stadiumname
            WHERE s.country = :country`;

        const result = await connection.execute(query, [country]);
        return result.rows;
    }).catch(() => {
        return [];
    });
}

//===================Game=============================//

async function fetchgametableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM GAMETABLE');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function initiategametable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE GAMETABLE`);
        } catch (err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE GAMETABLE (
                gamecode VARCHAR(20) PRIMARY KEY,
                gamedate VARCHAR(20),
                gameresult VARCHAR(20),
                stadiumname VARCHAR(20) NOT NULL,
                FOREIGN KEY (stadiumname) REFERENCES STADIUMTABLE(stadiumname)
            )
        `);
        return true;
    }).catch(() => {
        return false;
    });
}

async function insertGametable(gamecode, gamedate, gameresult, stadiumname) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO GAMETABLE (gamecode, gamedate, gameresult, stadiumname) VALUES (:gamecode, :gamedate, :gameresult, :stadiumname)`,
            [gamecode, gamedate, gameresult, stadiumname],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function updateValuegametable(updatedGameCode, updatedColumn, newValue) {
    return await withOracleDB(async (connection) => {
        const updateQuery =
            `UPDATE GAMETABLE
            SET gamedate = CASE WHEN :col = 'gamedate' THEN TO_DATE(:newVal, 'YYYY-MM-DD') ELSE gamedate END,
                gameresult = CASE WHEN :col = 'gameresult' THEN :newVal ELSE gameresult END
            WHERE gamecode = :updatedGameCode`;

        const result = await connection.execute(
            updateQuery,
            { col: updatedColumn, newVal: newValue, updatedGameCode },
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function deleteValuegametable(gamecode) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `DELETE FROM GAMETABLE WHERE gamecode = :gamecode`,
            [gamecode],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}



async function countgametable() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT Count(*) FROM GAMETABLE');
        return result.rows[0][0];
    }).catch(() => {
        return -1;
    });
}




//===================Manager=============================//

async function fetchmanagertableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM MANAGERTABLE');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function initiatemanagertable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE MANAGERTABLE`);
        } catch (err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE MANAGERTABLE (
                managername VARCHAR(20) PRIMARY KEY,
                country_of_origin VARCHAR(20),
                yearjoined INT
        
            )
        `);
        return true;
    }).catch(() => {
        return false;
    });
}

async function insertManagertable(managername, country_of_origin, yearjoined) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO MANAGERTABLE (managername, country_of_origin, yearjoined) VALUES (:managername, :country_of_origin, :yearjoined)`,
            [managername, country_of_origin, yearjoined],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function updateValuemanagertable(updatedManager, updatedColumn, newValue) {
    return await withOracleDB(async (connection) => {
        const updateQuery = `
            UPDATE MANAGERTABLE
            SET country_of_origin = CASE WHEN :col = 'country_of_origin' THEN :newVal ELSE country_of_origin END,
                yearjoined = CASE WHEN :col = 'yearjoined' THEN TO_NUMBER(:newVal) ELSE yearjoined END
            WHERE managername = :updatedManager`;

        const result = await connection.execute(
            updateQuery,
            { col: updatedColumn, newVal: newValue, updatedManager },
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function deleteValuemanagertable(managername) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `DELETE FROM MANAGERTABLE WHERE managername = :managername`,
            [managername],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}



async function countmanagertable() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT Count(*) FROM MANAGERTABLE');
        return result.rows[0][0];
    }).catch(() => {
        return -1;
    });
}

//===================  Referee =============================//

async function fetchrefereetableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM REFEREETABLE');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function initiaterefereetable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE REFEREETABLE`);
        } catch (err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE REFEREETABLE (
                refereename VARCHAR(20) PRIMARY KEY,
                years_of_experience INT
                
            )
        `);
        return true;
    }).catch(() => {
        return false;
    });
}

async function insertRefereetable(refereename, years_of_experience) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO REFEREETABLE (refereename, years_of_experience) VALUES (:refereename, :years_of_experience)`,
            [refereename, years_of_experience],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function updateValuerefereetable(updatedReferee, updatedColumn, newValue) {
    return await withOracleDB(async (connection) => {
        const updateQuery = `
            UPDATE REFEREETABLE
            SET years_of_experience = CASE WHEN :col = 'years_of_experience' THEN TO_NUMBER(:newVal) ELSE years_of_experience END
            WHERE refereename = :updatedReferee`;

        const result = await connection.execute(
            updateQuery,
            { col: updatedColumn, newVal: newValue, updatedReferee },
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function deleteValuerefereetable(refereename) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `DELETE FROM REFEREETABLE WHERE refereename = :refereename`,
            [refereename],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}



async function countrefereetable() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT Count(*) FROM REFEREETABLE');
        return result.rows[0][0];
    }).catch(() => {
        return -1;
    });
}

//=================== Club Owner =============================//

async function fetchclubownertableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM CLUBOWNERTABLE');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function initiateclubownertable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE CLUBOWNERTABLE`);
        } catch (err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE CLUBOWNERTABLE (
                clubownername VARCHAR(20) PRIMARY KEY,
                countryoforigin VARCHAR(20), 
                year_joined INT,
                clubname VARCHAR(20),
                FOREIGN KEY (clubname) REFERENCES CLUBTABLE(clubname)            
            )
        `);
        return true;
    }).catch(() => {
        return false;
    });
}

async function insertClubownertable(clubownername, countryoforigin, year_joined, clubname) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO CLUBOWNERTABLE (clubownername, countryoforigin, year_joined, clubname) VALUES (:clubownername, :countryoforigin, :year_joined, :clubname)`,
            [clubownername, countryoforigin, year_joined, clubname],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function updateValueclubownertable(updatedClubowner, updatedColumn, newValue) {
    return await withOracleDB(async (connection) => {
        const updateQuery = `
            UPDATE CLUBOWNERTABLE
            SET clubownername = CASE WHEN :col = 'clubownername' THEN :newVal ELSE clubownername END,
             countryoforigin = CASE WHEN :col = 'countryoforigin' THEN :newVal ELSE countryoforigin END,
             year_joined = CASE WHEN :col = 'year_joined' THEN TO_NUMBER(:newVal) ELSE year_joined END,
             clubname = CASE WHEN :col = 'clubname' THEN :newVal ELSE clubname END
            WHERE clubownername = :updatedClubowner`;

        const result = await connection.execute(
            updateQuery,
            { col: updatedColumn, newVal: newValue, updatedClubowner },
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function deleteValueclubownertable(clubownername) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `DELETE FROM CLUBOWNERTABLE WHERE clubownername = :clubownername`,
            [clubownername],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}



async function countclubownertable() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT Count(*) FROM CLUBOWNERTABLE');
        return result.rows[0][0];
    }).catch(() => {
        return -1;
    });
}

//===================  Season Record =============================//

async function fetchseasonrecordtableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM SEASONRECORDTABLE');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function initiateseasonrecordtable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE SEASONRECORDTABLE`);
        } catch (err) {
            console.log('Table might not exist, proceeding to create...');
        }
        //Not sure how to make weak entity
        const result = await connection.execute(`
            CREATE TABLE SEASONRECORDTABLE (
                playername VARCHAR(20) PRIMARY KEY,
                season VARCHAR(20),
                yellowcard INT,
                redcard INT,
                assists INT,
                goals INT
    
                
            )
        `);
        return true;
    }).catch(() => {
        return false;
    });
}

async function insertSeasonRecordtable(playername, season, yellowcard, redcard, assists, goals) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO SEASONRECORDTABLE (playername, season, yellowcard, redcard, assists, goals ) 
            VALUES (:playername, :season, :yellowcard, :redcard, :assists, :goals)`,
            [playername, season, yellowcard, redcard, assists, goals],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function updateValueseasonrecordtable(updatedPlayer, updatedColumn, newValue) {
    return await withOracleDB(async (connection) => {
        const updateQuery = `
            UPDATE SEASONRECORDTABLE
            SET season = CASE WHEN :col = 'season' THEN :newVal ELSE season END,
                yellowcard = CASE WHEN :col = 'yellowcard' THEN TO_NUMBER(:newVal) ELSE yellowcard END,
                redcard = CASE WHEN :col = 'redcard' THEN TO_NUMBER(:newVal) ELSE redcard END,
                assists = CASE WHEN :col = 'assists' THEN TO_NUMBER(:newVal) ELSE assists END,
                goals = CASE WHEN :col = 'goals' THEN TO_NUMBER(:newVal) ELSE goals END
            WHERE playername = :updatedPlayer`;

        const result = await connection.execute(
            updateQuery,
            { col: updatedColumn, newVal: newValue, updatedPlayer },
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function deleteValueseasonrecordtable(playername) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `DELETE FROM SEASONRECORDTABLE WHERE playername = :playername`,
            [playername],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}


//Projection function to get database
async function fetchSelectedColumnsTable(columns) {
    return await withOracleDB(async (connection) => {
        //console.log("Data Pkt put in SELECT funct: " + columns);

        const selectQuery = `SELECT ${columns} FROM SEASONRECORDTABLE`;

        const result = await connection.execute(
            selectQuery,
            [],
            { autoCommit: true }
        );
        // console.log("Data Pkt selected from DB: " + JSON.stringify(result));
        return result;
    }).catch(() => {
        return false;
    });
}



async function findPlayersWithoutRedCards(season) {
    return await withOracleDB(async (connection) => {
        const validSeasonFormat = /^\d{4}-\d{4}$/;
        if (!validSeasonFormat.test(season)) {
            throw new Error("Invalid season format. Please provide a valid season (YYYY-YYYY).");
        }

        const result = await connection.execute(`
        SELECT playername
        FROM SEASONRECORDTABLE SR1
        WHERE season = :season AND NOT EXISTS (
            SELECT 1
            FROM SEASONRECORDTABLE SR2
            WHERE SR2.season = :season AND SR2.redcard > 0 AND SR2.playername = SR1.playername)
        `, [season, season]);

        return result.rows.map(row => row[0]);
    }).catch((error) => {
        throw new Error(`Unable to find players without red cards: ${error.message}`);
    });
}


module.exports = {
    testOracleConnection,

    fetchclubtableFromDb,
    //initiateclubtable,
    insertClubtable,
    updateValueclubtable,
    deleteValueclubtable,
    countclubtable,
    findClubWithMaxTotalGoals,

    //Player
    fetchplayertableFromDb,
    initiateplayertable,
    filterPlayerTable,
    insertPlayertable,
    updateValueplayertable,
    deleteValueplayertable,
    aggregatePlayerTable,
    findClubsWithOlderPlayers,//having

    //Stadium 
    fetchstadiumtableFromDb,
    initiatestadiumtable,
    insertStadiumtable,
    updateValuestadiumtable,
    deleteValuestadiumtable,
    countstadiumtable,

    //Game 
    fetchgametableFromDb,
    initiategametable,
    insertGametable,
    updateValuegametable,
    deleteValuegametable,
    countgametable,
    getGamesAndStadiumsByCountry,

    //Manager
    fetchmanagertableFromDb,
    initiatemanagertable,
    insertManagertable,
    updateValuemanagertable,
    deleteValuemanagertable,
    countmanagertable,

    // Referee
    fetchrefereetableFromDb,
    initiaterefereetable,
    insertRefereetable,
    updateValuerefereetable,
    deleteValuerefereetable,
    countrefereetable,

    // Club Owner
    fetchclubownertableFromDb,
    initiateclubownertable,
    insertClubownertable,
    updateValueclubownertable,
    deleteValueclubownertable,
    countclubownertable,

    //Season Record
    fetchseasonrecordtableFromDb,
    initiateseasonrecordtable,
    insertSeasonRecordtable,
    updateValueseasonrecordtable,
    deleteValueseasonrecordtable,
    findPlayersWithoutRedCards,
    fetchSelectedColumnsTable,

}

