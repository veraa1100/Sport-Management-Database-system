DROP TABLE SEASONRECORDTABLE;
DROP TABLE PLAYTABLE;
DROP TABLE PARTICIPATETABLE;
DROP TABLE REFEREETABLE;
DROP TABLE GAMETABLE;
DROP TABLE PLAYERTABLE;
DROP TABLE CLUBOWNERTABLE;
DROP TABLE CLUBTABLE;
DROP TABLE MANAGERTABLE;
DROP TABLE STADIUMTABLE;

CREATE TABLE STADIUMTABLE (
    stadiumname VARCHAR(20) PRIMARY KEY,
    city VARCHAR(20),
    country VARCHAR(20),
    capacity INT,
    yearbuilt INT
);

CREATE TABLE MANAGERTABLE (
    managername VARCHAR(20) PRIMARY KEY,
    country_of_origin VARCHAR(20),
    yearjoined INT
);

CREATE TABLE REFEREETABLE (
    refereename VARCHAR(20) PRIMARY KEY,
    years_of_experience INT
);

CREATE TABLE GAMETABLE (
    gamecode VARCHAR(20) PRIMARY KEY,
    gamedate VARCHAR(20),
    gameresult VARCHAR(20),
    stadiumname VARCHAR(20) NOT NULL,
    FOREIGN KEY (stadiumname) REFERENCES STADIUMTABLE(stadiumname) ON DELETE CASCADE
);

CREATE TABLE PARTICIPATETABLE (
    refereename VARCHAR(20),
    gamecode VARCHAR(20),
    PRIMARY KEY (refereename, gamecode),
    FOREIGN KEY (refereename) REFERENCES REFEREETABLE(refereename) ON DELETE CASCADE,
    FOREIGN KEY (gamecode) REFERENCES GAMETABLE(gamecode) ON DELETE CASCADE
);

CREATE TABLE CLUBTABLE (
    clubname VARCHAR(20) PRIMARY KEY,
    city VARCHAR(20),
    yearfounded INT,
    stadiumname VARCHAR(20),
    managername VARCHAR(20)
);

CREATE TABLE CLUBOWNERTABLE (
    clubownername VARCHAR(20) PRIMARY KEY,
    countryoforigin VARCHAR(20), 
    year_joined INT,
    clubname VARCHAR(20) NOT NULL,
    FOREIGN KEY (clubname) REFERENCES CLUBTABLE(clubname) ON DELETE CASCADE
);

CREATE TABLE PLAYTABLE (
    clubname VARCHAR(20),
    gamecode VARCHAR(20),
    PRIMARY KEY (clubname, gamecode),
    FOREIGN KEY (clubname) REFERENCES CLUBTABLE(clubname) ON DELETE CASCADE,
    FOREIGN KEY (gamecode) REFERENCES GAMETABLE(gamecode) ON DELETE CASCADE
);

CREATE TABLE PLAYERTABLE (
    playername VARCHAR(20) PRIMARY KEY,
    age INT,
    jerseynumber INT,
    position VARCHAR(20),
    clubname VARCHAR(20) NOT NULL,
    FOREIGN KEY (clubname) REFERENCES CLUBTABLE(clubname) ON DELETE CASCADE
);

CREATE TABLE SEASONRECORDTABLE (
    playername VARCHAR(20),
    season VARCHAR(20),
    yellowcard INT,
    redcard INT,
    assists INT,
    goals INT,
    PRIMARY KEY (playername, season),
    FOREIGN KEY (playername) REFERENCES PLAYERTABLE(playername) ON DELETE CASCADE
);





/*
CREATE TABLE CupGame (
    Game_Code VARCHAR(20) PRIMARY KEY,
    Round VARCHAR(20),
    Whether_Extra_Time BOOLEAN,
    Whether_Penalty BOOLEAN,
    Result VARCHAR(20),
    Date DATE,
    Stadium_Name VARCHAR(20) NOT NULL,
    FOREIGN KEY (Game_Code) REFERENCES Game(Game_Code),
    FOREIGN KEY (Stadium_Name) REFERENCES Stadium(Stadium_Name)
);

CREATE TABLE LeagueGame (
    Game_Code VARCHAR(20) PRIMARY KEY,
    Game_Week_Number INT,
    Result VARCHAR(20),
    Date DATE,
    Stadium_Name VARCHAR(20) NOT NULL,
    FOREIGN KEY (Game_Code) REFERENCES Game(Game_Code),
    FOREIGN KEY (Stadium_Name) REFERENCES Stadium(Stadium_Name)
);
*/


/*
CREATE TABLE Club_Statistics (
    Games_Won INT,
    Games_Lost INT,
    Games_Tied INT,
    Points INT,
    PRIMARY KEY (Games_Won, Games_Lost, Games_Tied)
);
*/

/*
CREATE TABLE ClubOwner (
    Club_Owner_Name VARCHAR(20),
    Country_of_Origin VARCHAR(20),
    Year_Joined INT,
    Club_Name VARCHAR(20) NOT NULL,
    PRIMARY KEY (Club_Owner_Name),
    FOREIGN KEY (Club_Name) REFERENCES Stadium(Stadium_Name)
);
*/



-- Inserting data into STADIUMTABLE
INSERT INTO STADIUMTABLE (stadiumname, city, country, capacity, yearbuilt)
VALUES ('Camp Nou', 'Barcelona', 'Spain', 99000, 1957);

INSERT INTO STADIUMTABLE (stadiumname, city, country, capacity, yearbuilt)
VALUES ('Santiago Bernabeu', 'Madrid', 'Spain', 81000, 1947);

-- Inserting data into MANAGERTABLE
INSERT INTO MANAGERTABLE (managername, country_of_origin, yearjoined)
VALUES ('Ronald Koeman', 'Netherlands', 2020);

INSERT INTO MANAGERTABLE (managername, country_of_origin, yearjoined)
VALUES ('Carlo Ancelotti', 'Italy', 2021);

-- Inserting data into REFREETABLE
INSERT INTO REFEREETABLE (refereename, years_of_experience)
VALUES ('John Smith', 5);

INSERT INTO REFEREETABLE (refereename, years_of_experience)
VALUES ('Maria Rodriguez', 8);

-- Inserting data into GAMETABLE
INSERT INTO GAMETABLE (gamecode, gamedate, gameresult, stadiumname)
VALUES ('BARREA2023', '2023-01-15', '2-1', 'Camp Nou');

INSERT INTO GAMETABLE (gamecode, gamedate, gameresult, stadiumname)
VALUES ('RMASEV2023', '2023-01-15', '3-0', 'Santiago Bernabeu');

-- Inserting data into CLUBTABLE
INSERT INTO CLUBTABLE (clubname, city, yearfounded, stadiumname, managername)
VALUES ('FC Barcelona', 'Barcelona', 1899, 'Camp Nou', 'Ronald Koeman');

INSERT INTO CLUBTABLE (clubname, city, yearfounded, stadiumname, managername)
VALUES ('Real Madrid', 'Madrid', 1902, 'Santiago Bernabeu', 'Carlo Ancelotti');

INSERT INTO CLUBTABLE (clubname, city, yearfounded, stadiumname, managername)
VALUES ('Paris Saint-Germain', 'Paris', 1970, 'Parc des Princes', 'Mauricio Pochettino');

INSERT INTO CLUBTABLE (clubname, city, yearfounded, stadiumname, managername)
VALUES ('Manchester United', 'Manchester', 1878, 'Old Trafford', 'Ralf Rangnick');


INSERT INTO CLUBTABLE (clubname, city, yearfounded, stadiumname, managername)
VALUES ('Manchester City', 'Manchester', 1880, 'Etihad Stadium', 'Pep Guardiola');


INSERT INTO CLUBTABLE (clubname, city, yearfounded, stadiumname, managername)
VALUES ('Liverpool', 'Liverpool', 1892, 'Anfield', 'Jurgen Klopp');

INSERT INTO CLUBTABLE (clubname, city, yearfounded, stadiumname, managername)
VALUES ('Chelsea', 'London', 1905, 'Stamford Bridge', 'Thomas Tuchel');



-- Inserting data into CLUBOWNERTABLE
INSERT INTO CLUBOWNERTABLE (clubownername, countryoforigin, year_joined, clubname)
VALUES ('Jane Smith', 'Canada', 2001, 'Real Madrid');

INSERT INTO CLUBOWNERTABLE (clubownername, countryoforigin, year_joined, clubname)
VALUES ('Bob Smith', 'Canada', 2002, 'Paris Saint-Germain');

INSERT INTO CLUBOWNERTABLE (clubownername, countryoforigin, year_joined, clubname)
VALUES ('John W. Henry', 'USA', 2010, 'Liverpool');

INSERT INTO CLUBOWNERTABLE (clubownername, countryoforigin, year_joined, clubname)
VALUES ('Sheikh Mansour', 'Spain', 2008, 'Manchester City');

INSERT INTO CLUBOWNERTABLE (clubownername, countryoforigin, year_joined, clubname)
VALUES ('Todd Boehly', 'USA', 2022, 'Chelsea');

INSERT INTO CLUBOWNERTABLE (clubownername, countryoforigin, year_joined, clubname)
VALUES ('Glazer Family', 'USA', 2005 , 'Manchester United');

INSERT INTO CLUBOWNERTABLE (clubownername, countryoforigin, year_joined, clubname)
VALUES ('John Doe', 'Canada', 2000, 'FC Barcelona');


-- Inserting data into PLAYTABLE
INSERT INTO PLAYTABLE (clubname, gamecode)
VALUES ('FC Barcelona', 'BARREA2023');

INSERT INTO PLAYTABLE (clubname, gamecode)
VALUES ('Real Madrid', 'RMASEV2023');

-- Inserting data into PLAYERTABLE
INSERT INTO PLAYERTABLE (playername, age, jerseynumber, position, clubname)
VALUES ('Lionel Messi', 34, 10, 'Forward', 'FC Barcelona');

INSERT INTO PLAYERTABLE (playername, age, jerseynumber, position, clubname)
VALUES ('Karim Benzema', 34, 9, 'Forward', 'Real Madrid');

INSERT INTO PLAYERTABLE (playername, age, jerseynumber, position, clubname)
VALUES ('Sergio Ramos', 36, 4, 'Defender', 'Paris Saint-Germain');

INSERT INTO PLAYERTABLE (playername, age, jerseynumber, position, clubname)
VALUES ('Ansu Fati', 19, 22, 'Forward', 'FC Barcelona');

INSERT INTO PLAYERTABLE (playername, age, jerseynumber, position, clubname)
VALUES ('Mohamed Salah', 30, 11, 'Forward', 'Liverpool');

INSERT INTO PLAYERTABLE (playername, age, jerseynumber, position, clubname)
VALUES ('Mason Mount', 23, 19, 'Midfielder', 'Chelsea');

-- Inserting data into SEASONRECORDTABLE
INSERT INTO SEASONRECORDTABLE (playername, season, yellowcard, redcard, assists, goals)
VALUES ('Lionel Messi', '2022-2023', 1, 0, 5, 10);

INSERT INTO SEASONRECORDTABLE (playername, season, yellowcard, redcard, assists, goals)
VALUES ('Karim Benzema', '2022-2023', 2, 0, 3, 8);

INSERT INTO SEASONRECORDTABLE (playername, season, yellowcard, redcard, assists, goals)
VALUES ('Sergio Ramos', '2022-2023', 0, 1, 1, 2);

INSERT INTO SEASONRECORDTABLE (playername, season, yellowcard, redcard, assists, goals)
VALUES ('Ansu Fati', '2022-2023', 0, 0, 2, 4);

INSERT INTO SEASONRECORDTABLE (playername, season, yellowcard, redcard, assists, goals)
VALUES ('Mohamed Salah', '2022-2023', 1, 0, 3, 7);

INSERT INTO SEASONRECORDTABLE (playername, season, yellowcard, redcard, assists, goals)
VALUES ('Mason Mount', '2022-2023', 0, 0, 4, 6);

COMMIT;