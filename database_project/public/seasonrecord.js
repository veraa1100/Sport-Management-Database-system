//const { findPlayersWithoutRedCards } = require("../appService");

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

// Fetches data from the srecordtable and displays it.
async function fetchAndDisplaySeasonRecords() {
    const tableElement = document.getElementById('seasonrecordtable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/seasonrecordtable', {
        method: 'GET'
    });

    const responseData = await response.json();
    const seasonrecordtableContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    seasonrecordtableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

// This function resets or initializes the table.
async function resetSeasonRecordtable() {
    const response = await fetch("/initiate-seasonrecordtable", {
        method: 'POST'
    });
    const responseData = await response.json();

    if (responseData.success) {
        const messageElement = document.getElementById('resetResultMsg');
        messageElement.textContent = "seasonrecordtable initiated successfully!";
        fetchTableData();
    } else {
        alert("Error initiating table!");
    }
}

// Inserts new records into the table.
async function insertSeasonRecordtable(event) {
    event.preventDefault();

    const playernameValue = document.getElementById('insertPlayerName').value;
    const seasonValue = document.getElementById('insertSeason').value;
    const yellowcardValue = document.getElementById('insertYellowcard').value;
    const redcardValue = document.getElementById('insertRedcard').value;
    const assistsValue = document.getElementById('insertAssists').value;
    const goalsValue = document.getElementById('insertGoals').value;

    const response = await fetch('/insert-seasonrecordtable', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            playername: playernameValue,
            season: seasonValue,
            yellowcard: yellowcardValue,
            redcard: redcardValue,
            assists: assistsValue,
            goals: goalsValue
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('insertResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Data inserted successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error inserting data!";
    }
}

//PROJECTION FUNCTION
async function selectDisplayedColumns(event) {
    event.preventDefault();

    // Retrieves the status of each checkbox
    const selectedColumns = [];
    if (document.getElementById('playerNameCheck').checked) selectedColumns.push('playername');
    if (document.getElementById('seasonCheck').checked) selectedColumns.push('season');
    if (document.getElementById('yellowCardCheck').checked) selectedColumns.push('yellowcard');
    if (document.getElementById('redCardCheck').checked) selectedColumns.push('redcard');
    if (document.getElementById('assistsCheck').checked) selectedColumns.push('assists');
    if (document.getElementById('goalsCheck').checked) selectedColumns.push('goals');

    selectedColumns.join(', ');
    //console.log("Data Pkt to backend: " + selectedColumns);

    //send data to backend and update the table 
    const response = await fetch('/update-columns-seasonrecordtable', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        //body: JSON.stringify(selectedColumns)
        body: JSON.stringify({
            columns: selectedColumns
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('selectColumnNameResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Selected columns updated successfully!";
        //console.log(responseData.data);
        updateFrontEndTable(responseData.data);
    } else {
        messageElement.textContent = "Error updating selected columns!";
    }
}

/*  helper function for PROJECTION
    updates front end table2 to display only selected columns   */
function updateFrontEndTable(tableData) {
    //console.log("updateFrontEndTable data: " + tableData);

    // Accessing the table by its ID
    var table = document.getElementById("seasonrecordtable2");
    if (!table) {
        console.error('Table element not found');
        return;
    }

    // get table header and body row
    const tableHead = table.querySelector('thead tr');
    if (!tableHead) {
        console.error('Table head element not found');
        return;
    }
    const tableBody = table.querySelector('tbody');
    if (!tableBody) {
        console.error('Table body element not found');
        return;
    }

    // Clear existing table headers and body
    tableHead.innerHTML = '';
    tableBody.innerHTML = '';

    // Create and populate headers (header data is named metaData)
    if (tableData.metaData && tableData.metaData.length > 0) {
        tableData.metaData.forEach(column => {
            let th = document.createElement('th');
            fixedFormatColumnName = headerFormatHelper(column.name);
            th.textContent = fixedFormatColumnName;
            tableHead.appendChild(th);
        });
    } else {
        console.error('No metaData available for headers');
        return; // Exit if no metaData is present
    }

    // Create and populate rows
    if (tableData.rows && tableData.rows.length > 0) {
        tableData.rows.forEach(rowData => {
            let tr = document.createElement('tr');
            Object.values(rowData).forEach(value => {
                let td = document.createElement('td');
                td.textContent = value;
                tr.appendChild(td);
            });
            tableBody.appendChild(tr);
        });
    } else {
        console.error('No data available to display');
    }

}

// takes in input and reutrns better formated display name
function headerFormatHelper(name){
    if (name == "PLAYERNAME") return "Player Name";
    if (name == "SEASON") return "Season";
    if (name == "YELLOWCARD") return "Yellowcard";
    if (name == "REDCARD") return "Redcard";
    if (name == "ASSISTS") return "Assists";
    if (name == "GOALS") return "Goals";
    console.error('headerFormatHelper error, inputColumn cannot be mapped');
}

async function updateValueseasonrecordtable(event) {
    event.preventDefault();

    const updatedPlayerValue = document.getElementById('updatedPlayer').value;
    const updatedColumnValue = document.getElementById('updatedColumn').value;
    const newValueValue = document.getElementById('updateNewValue').value;

    const response = await fetch('/update-value-seasonrecordtable', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            updatedPlayer: updatedPlayerValue,
            updatedColumn: updatedColumnValue,
            newValue: newValueValue
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('updateNameResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Value updated successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error updating value!";
    }
}

async function deleteValueseasonrecordtable(event) {
    event.preventDefault();

    const playerNameValue = document.getElementById('deletePlayer').value;

    const response = await fetch('/delete-seasonrecordtable', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            playername: playerNameValue
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('deleteResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Data deleted successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error deleting data!";
    }
}



//division
document.getElementById('findplayerstable').addEventListener('click', async (event) => {
    event.preventDefault();

    const seasonToFindValue = document.getElementById('insertSeasontofind').value;

    try {
        const response = await fetch('/find-players-without-red-cards', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                season: seasonToFindValue,
            }),
        });

        const responseData = await response.json();

        if (responseData.success) {
            document.getElementById('withoutredcardresultMsg').textContent = `Players without red cards in ${seasonToFindValue}: ${responseData.data.join(', ')}`;
        } else {
            throw new Error(responseData.error);
        }
    } catch (error) {
        console.error(`Error: ${error.message}`);
        document.getElementById('withoutredcardresultMsg').textContent = `Error: ${error.message}`;
    }
});






// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function () {
    checkDbConnection();
    fetchTableData();
    document.getElementById("resetSeasonRecordtable").addEventListener("click", resetSeasonRecordtable);
    document.getElementById("viewSelectedColumnsForm").addEventListener("submit", selectDisplayedColumns);
    document.getElementById("insertSeasonRecordtable").addEventListener("submit", insertSeasonRecordtable);
    document.getElementById("updateValueseasonrecordtable").addEventListener("submit", updateValueseasonrecordtable);
    document.getElementById("deleteValueseasonrecordtable").addEventListener("submit", deleteValueseasonrecordtable);
    
};

// General function to refresh the displayed table data. 
// You can invoke this after any table-modifying operation to keep consistency.
function fetchTableData() {
    fetchAndDisplaySeasonRecords();
    
}