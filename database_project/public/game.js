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

// Fetches data from the gametable and displays it.
async function fetchAndDisplayUsers() {
    const tableElement = document.getElementById('gametable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/gametable', {
        method: 'GET'
    });

    const responseData = await response.json();
    const gametableContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    gametableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

// This function resets or initializes the table.
async function resetGametable() {
    const response = await fetch("/initiate-gametable", {
        method: 'POST'
    });
    const responseData = await response.json();

    if (responseData.success) {
        const messageElement = document.getElementById('resetResultMsg');
        messageElement.textContent = "gametable initiated successfully!";
        fetchTableData();
    } else {
        alert("Error initiating table!");
    }
}

// Inserts new records into the table.
async function insertGametable(event) {
    event.preventDefault();

    const gameCodeValue = document.getElementById('insertGameCode').value;
    const gameDateValue = document.getElementById('insertDate').value;
    const gameResultValue = document.getElementById('insertGameResult').value;
    const stadiumnameValue = document.getElementById('insertStadiumName').value;

    const response = await fetch('/insert-gametable', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            gamecode: gameCodeValue,
            gamedate: gameDateValue,
            gameresult: gameResultValue,
            stadiumname: stadiumnameValue
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

async function updateValuegametable(event) {
    event.preventDefault();

    const updatedGameCodeValue = document.getElementById('updatedGameCode').value;
    const updatedColumnValue = document.getElementById('updatedColumn').value;
    const newValueValue = document.getElementById('updateNewValue').value;

    const response = await fetch('/update-value-gametable', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            updatedGameCode: updatedGameCodeValue,
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

async function deleteValuegametable(event) {
    event.preventDefault();

    const gameNameValue = document.getElementById('deleteGameCode').value;

    const response = await fetch('/delete-gametable', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            gamecode: gameNameValue
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

// Counts rows in the table.
// Modify the function accordingly if using different aggregate functions or procedures.
async function countgametable() {
    const response = await fetch("/count-gametable", {
        method: 'GET'
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('countResultMsg');

    if (responseData.success) {
        const tupleCount = responseData.count;
        messageElement.textContent = `The number of games in gametable: ${tupleCount}`;
    } else {
        alert("Error in count gametable!");
    }
}





// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function () {
    checkDbConnection();
    fetchTableData();
    document.getElementById("resetGametable").addEventListener("click", resetGametable);
    document.getElementById("insertGametable").addEventListener("submit", insertGametable);
    document.getElementById("updateValuegametable").addEventListener("submit", updateValuegametable);
    document.getElementById("deleteValuegametable").addEventListener("submit", deleteValuegametable);    
    document.getElementById("countgametable").addEventListener("click", countgametable);
};

// General function to refresh the displayed table data. 
// You can invoke this after any table-modifying operation to keep consistency.
function fetchTableData() {
    fetchAndDisplayUsers();
}

