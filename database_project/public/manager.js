

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

// Fetches data from the managertable and displays it.
async function fetchAndDisplayUsers() {
    const tableElement = document.getElementById('managertable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/managertable', {
        method: 'GET'
    });

    const responseData = await response.json();
    const managertableContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    managertableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

// This function resets or initializes the table.
async function resetManagertable() {
    const response = await fetch("/initiate-managertable", {
        method: 'POST'
    });
    const responseData = await response.json();

    if (responseData.success) {
        const messageElement = document.getElementById('resetResultMsg');
        messageElement.textContent = "managertable initiated successfully!";
        fetchTableData();
    } else {
        alert("Error initiating table!");
    }
}

// Inserts new records into the table.
async function insertManagertable(event) {
    event.preventDefault();

    const managernameValue = document.getElementById('insertManagerName').value;
    const country_of_originValue = document.getElementById('insertCountryOfOrigin').value;
    const yearjoinedValue = document.getElementById('insertYearJoined').value;

    const response = await fetch('/insert-managertable', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            managername: managernameValue,
            country_of_origin: country_of_originValue,
            yearjoined: yearjoinedValue
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

async function updateValuemanagertable(event) {
    event.preventDefault();

    const updatedManagerValue = document.getElementById('updatedManager').value;
    const updatedColumnValue = document.getElementById('updatedColumn').value;
    const newValueValue = document.getElementById('updateNewValue').value;

    const response = await fetch('/update-value-managertable', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            updatedManager: updatedManagerValue,
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

async function deleteValuemanagertable(event) {
    event.preventDefault();

    const managerNameValue = document.getElementById('deleteManager').value;

    const response = await fetch('/delete-managertable', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            managername: managerNameValue
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
async function countmanagertable() {
    const response = await fetch("/count-managertable", {
        method: 'GET'
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('countResultMsg');

    if (responseData.success) {
        const tupleCount = responseData.count;
        messageElement.textContent = `The number of tuples in managertable: ${tupleCount}`;
    } else {
        alert("Error in count managertable!");
    }
}


// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function () {
    checkDbConnection();
    fetchTableData();
    document.getElementById("resetManagertable").addEventListener("click", resetManagertable);
    document.getElementById("insertManagertable").addEventListener("submit", insertManagertable);
    document.getElementById("updateValuemanagertable").addEventListener("submit", updateValuemanagertable);
    document.getElementById("deleteValuemanagertable").addEventListener("submit", deleteValuemanagertable);
    document.getElementById("countmanagertable").addEventListener("click", countmanagertable);
};

// General function to refresh the displayed table data. 
// You can invoke this after any table-modifying operation to keep consistency.
function fetchTableData() {
    fetchAndDisplayUsers();
}