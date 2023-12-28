

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

// Fetches data from the playertable and displays it.
async function fetchAndDisplayPlayers() {
    const tableElement = document.getElementById('playertable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/playertable', {
        method: 'GET'
    });

    const responseData = await response.json();
    const playertableContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    playertableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

// SELECTION function
async function filterPlayerTable(event) {
    event.preventDefault();

    const filterPlayerNameValue = document.getElementById('filterPlayerName').value;
    const filterAgeValue = document.getElementById('filterAge').value;
    const filterJerseyNumberValue = document.getElementById('filterJerseyNumber').value;
    const filterPositionValue = document.getElementById('filterPosition').value;
    const filterClubNameValue = document.getElementById('filterClubName').value;

    const response = await fetch('/filter-playertable', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            filterPlayerName: filterPlayerNameValue,
            filterAge: filterAgeValue,
            filterJerseyNumber: filterJerseyNumberValue,
            filterPosition: filterPositionValue,
            filterClubName: filterClubNameValue
        })
    });

    const responseData = await response.json();

    const messageElement = document.getElementById('filterResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Table filtered successfully!";
        // console.log("Response data:", responseData.data);
        updateTableForFilter(responseData.data);
    } else {
        messageElement.textContent = "Error filtering table!";
    }
}

// Helper function for SELECTION
async function updateTableForFilter(filteredData) {

    console.log("Filtered data:", filteredData);

    const tableElement = document.getElementById('playertable');
    const tableBody = tableElement.querySelector('tbody');

    tableBody.innerHTML = ''; // deletes all of the rows

    // Create and populate rows
    filteredData.rows.forEach(rowData => {
        let tr = document.createElement('tr');
        Object.values(rowData).forEach(value => {
            let td = document.createElement('td');
            td.textContent = value;
            tr.appendChild(td);
        });
        tableBody.appendChild(tr);
    });
}


// This function resets or initializes the table.
async function resetPlayertable() {
    const response = await fetch("/initiate-playertable", {
        method: 'POST'
    });
    const responseData = await response.json();

    if (responseData.success) {
        const messageElement = document.getElementById('resetResultMsg');
        messageElement.textContent = "playertable initiated successfully!";
        fetchTableData();
    } else {
        alert("Error initiating table!");
    }
}

// Inserts new records into the table.
async function insertPlayertable(event) {
    event.preventDefault();

    const playernameValue = document.getElementById('insertPlayerName').value;
    const ageValue = document.getElementById('insertAge').value;
    const positionValue = document.getElementById('insertPosition').value;
    const jerseynumberValue = document.getElementById('insertJerseyNumber').value;
    const clubnameValue = document.getElementById('insertClubName').value;

    const response = await fetch('/insert-playertable', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            playername: playernameValue,
            age: ageValue,
            position: positionValue,
            jerseynumber: jerseynumberValue,
            clubname: clubnameValue
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

async function updateValueplayertable(event) {
    event.preventDefault();

    const updatedPlayerValue = document.getElementById('updatedPlayer').value;
    const updatedColumnValue = document.getElementById('updatedColumn').value;
    const newValueValue = document.getElementById('updateNewValue').value;

    const response = await fetch('/update-value-playertable', {
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

async function deleteValueplayertable(event) {
    event.preventDefault();

    const playerNameValue = document.getElementById('deletePlayer').value;

    const response = await fetch('/delete-playertable', {
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


// Aggragation by group
async function aggregatePlayerTable(event) {
    event.preventDefault();
    const aggregateTypeValue = document.getElementById('aggregationType').value;

    // const response = await fetch(`/aggregate-playertable?aggregateType=${selectedAggregation}`, {
    const response = await fetch(`/aggregate-playertable?aggregateType=${aggregateTypeValue}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('aggregateResultMsg');

    // console.log(responseData);

    if (responseData.success) {
        const calculatedValue = responseData.aggregateValue[0];
        var roundedValue = Math.round(calculatedValue * 10) / 10
        messageElement.textContent = `The result of aggregation in playertable: ${roundedValue}`;
    } else {
        alert("Error in aggregating playertable!");
    }
}

//having
async function findClubsWithOlderPlayers() {
    const minAvgAgeInput = document.getElementById('insertMinAvgAge').value;

    const response = await fetch(`/having-playertable?minAvgAgeInput=${minAvgAgeInput}`, {
        method: 'GET',
    });

    const responseData = await response.json();

    const messageElement = document.getElementById('havingResultMsg');

    //console.log('Response Data:', responseData);

    if (responseData.success) {
        const clubsFound = responseData.clubname;
        // Use join to concatenate the array elements into a string
        const clubNamesString = clubsFound.join(', ');
        messageElement.textContent = `The clubs are ${clubNamesString}`;
    } else {
        alert("Error in finding clubs!");
    }
}




// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function () {
    checkDbConnection();
    fetchTableData();
    //document.getElementById("resetPlayertable").addEventListener("click", resetPlayertable);
    document.getElementById("filterPlayerTable").addEventListener("submit", filterPlayerTable);
    document.getElementById("insertPlayertable").addEventListener("submit", insertPlayertable);
    document.getElementById("updateValueplayertable").addEventListener("submit", updateValueplayertable);
    document.getElementById("deleteValueplayertable").addEventListener("submit", deleteValueplayertable);
    document.getElementById("aggregatePlayerTable").addEventListener("click", aggregatePlayerTable);
    document.getElementById("havingplayertable").addEventListener("click", findClubsWithOlderPlayers);

};

// General function to refresh the displayed table data. 
// You can invoke this after any table-modifying operation to keep consistency.
function fetchTableData() {
    fetchAndDisplayPlayers();
}
