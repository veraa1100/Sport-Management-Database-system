
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

// Fetches data from the clubownertable and displays it.
async function fetchAndDisplayUsers() {
    const tableElement = document.getElementById('clubownertable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/clubownertable', {
        method: 'GET'
    });

    const responseData = await response.json();
    const clubownertableContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    clubownertableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

// This function resets or initializes the table.
async function resetClubownertable() {
    const response = await fetch("/initiate-clubownertable", {
        method: 'POST'
    });
    const responseData = await response.json();

    if (responseData.success) {
        const messageElement = document.getElementById('resetResultMsg');
        messageElement.textContent = "clubownertable initiated successfully!";
        fetchTableData();
    } else {
        alert("Error initiating table!");
    }
}

// Inserts new records into the table.
async function insertClubownertable(event) {
    event.preventDefault();

    const clubownernameValue = document.getElementById('insertClubownerName').value;
    const countryoforigin = document.getElementById('insertcountryoforigin').value;
    const year_joined = document.getElementById('insertYearsOfExperience').value;
    const clubname = document.getElementById('insertclubname').value;

    const response = await fetch('/insert-clubownertable', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            clubownername: clubownernameValue,
            countryoforigin: countryoforigin,
            year_joined: year_joined,
            clubname: clubname
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

// Updates names in the table.
async function updateValueclubownertable(event) {
    event.preventDefault();

    const updatedClubownerValue = document.getElementById('updatedClubowner').value;
    const updatedColumnValue = document.getElementById('updatedColumn').value;
    const newValueValue = document.getElementById('updateNewValue').value;

    const response = await fetch('/update-value-clubownertable', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            updatedClubowner: updatedClubownerValue,
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

async function deleteValueclubownertable(event) {
    event.preventDefault();

    const clubownerNameValue = document.getElementById('deleteClubowner').value;

    const response = await fetch('/delete-clubownertable', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            clubownername: clubownerNameValue
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
async function countclubownertable() {
    const response = await fetch("/count-clubownertable", {
        method: 'GET'
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('countResultMsg');

    if (responseData.success) {
        const tupleCount = responseData.count;
        messageElement.textContent = `The number of tuples in clubownertable: ${tupleCount}`;
    } else {
        alert("Error in count clubownertable!");
    }
}


// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function () {
    checkDbConnection();
    fetchTableData();
    document.getElementById("resetClubownertable").addEventListener("click", resetClubownertable);
    document.getElementById("insertClubownertable").addEventListener("submit", insertClubownertable);
    document.getElementById("updateValueclubownertable").addEventListener("submit", updateValueclubownertable);
    document.getElementById("deleteValueclubownertable").addEventListener("submit", deleteValueclubownertable);
    document.getElementById("countclubownertable").addEventListener("click", countclubownertable);
};

// General function to refresh the displayed table data. 
// You can invoke this after any table-modifying operation to keep consistency.
function fetchTableData() {
    fetchAndDisplayUsers();
}