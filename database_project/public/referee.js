
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

// Fetches data from the refereetable and displays it.
async function fetchAndDisplayUsers() {
    const tableElement = document.getElementById('refereetable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/refereetable', {
        method: 'GET'
    });

    const responseData = await response.json();
    const refereetableContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    refereetableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

// This function resets or initializes the table.
async function resetRefereetable() {
    const response = await fetch("/initiate-refereetable", {
        method: 'POST'
    });
    const responseData = await response.json();

    if (responseData.success) {
        const messageElement = document.getElementById('resetResultMsg');
        messageElement.textContent = "refereetable initiated successfully!";
        fetchTableData();
    } else {
        alert("Error initiating table!");
    }
}

// Inserts new records into the table.
async function insertRefereetable(event) {
    event.preventDefault();

    const refereenameValue = document.getElementById('insertRefereeName').value;
    const years_of_experienceValue = document.getElementById('insertYearsOfExperience').value;

    const response = await fetch('/insert-refereetable', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            refereename: refereenameValue,
            years_of_experience: years_of_experienceValue
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
async function updateValuerefereetable(event) {
    event.preventDefault();

    const updatedRefereeValue = document.getElementById('updatedReferee').value;
    const updatedColumnValue = document.getElementById('updatedColumn').value;
    const newValueValue = document.getElementById('updateNewValue').value;

    const response = await fetch('/update-value-refereetable', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            updatedReferee: updatedRefereeValue,
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

async function deleteValuerefereetable(event) {
    event.preventDefault();

    const refereeNameValue = document.getElementById('deleteReferee').value;

    const response = await fetch('/delete-refereetable', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            refereename: refereeNameValue
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
async function countrefereetable() {
    const response = await fetch("/count-refereetable", {
        method: 'GET'
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('countResultMsg');

    if (responseData.success) {
        const tupleCount = responseData.count;
        messageElement.textContent = `The number of tuples in refereetable: ${tupleCount}`;
    } else {
        alert("Error in count refereetable!");
    }
}


// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function () {
    checkDbConnection();
    fetchTableData();
    document.getElementById("resetRefereetable").addEventListener("click", resetRefereetable);
    document.getElementById("insertRefereetable").addEventListener("submit", insertRefereetable);
    document.getElementById("updateValuerefereetable").addEventListener("submit", updateValuerefereetable);
    document.getElementById("deleteValuerefereetable").addEventListener("submit", deleteValuerefereetable);
    document.getElementById("countrefereetable").addEventListener("click", countrefereetable);
};

// General function to refresh the displayed table data. 
// You can invoke this after any table-modifying operation to keep consistency.
function fetchTableData() {
    fetchAndDisplayUsers();
}