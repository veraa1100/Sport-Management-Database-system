/*
 * These functions below are for various webpage functionalities. 
 * Each function serves to process data on the frontend:
 *      - Before sending requests to the backend.
 *      - After receiving responses from the backend.
 * 
 * To tailor them to your specific needs,
 * adjust or expand these functions to match both your 
 *   backend endpoints 
 * and 
 *   HTML structure.
 * 
 */


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

// Fetches data from the clubtable and displays it.
async function fetchAndDisplayUsers() {
    const tableElement = document.getElementById('clubtable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/clubtable', {
        method: 'GET'
    });

    const responseData = await response.json();
    const clubtableContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    clubtableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

/*
// This function resets or initializes the clubtable.
async function resetclubtable() {
    const response = await fetch("/initiate-clubtable", {
        method: 'POST'
    });
    const responseData = await response.json();

    if (responseData.success) {
        const messageElement = document.getElementById('resetResultMsg');
        messageElement.textContent = "clubtable initiated successfully!";
        fetchTableData();
    } else {
        alert("Error initiating table!");
    }
}
*/

// Inserts new records into the clubtable.
async function insertClubtable(event) {
    event.preventDefault();

    const clubnameValue = document.getElementById('insertClubName').value;
    const cityValue = document.getElementById('insertCity').value;
    const yearfoundedValue = document.getElementById('insertYearFounded').value;
    const stadiumameValue = document.getElementById('insertStadiumName').value;
    const managernameValue = document.getElementById('insertManagerName').value;
    
    const response = await fetch('/insert-clubtable', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            clubname: clubnameValue,
            city: cityValue,
            yearfounded: yearfoundedValue,
            stadiumname:stadiumameValue,
            managername: managernameValue
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


async function updateValueclubtable(event) {
    event.preventDefault();

    const updatedClubValue = document.getElementById('updatedClub').value;
    const updatedColumnValue = document.getElementById('updatedColumn').value;
    const newValueValue = document.getElementById('updateNewValue').value;

    const response = await fetch('/update-value-clubtable', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            updatedClub: updatedClubValue,
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

async function deleteValueclubtable(event) {
    event.preventDefault();

    const clubNameValue = document.getElementById('deleteClub').value;

    const response = await fetch('/delete-clubtable', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            clubname: clubNameValue
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

// Counts rows in the clubtable.
// Modify the function accordingly if using different aggregate functions or procedures.
async function countclubtable() {
    const response = await fetch("/count-clubtable", {
        method: 'GET'
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('countResultMsg');

    if (responseData.success) {
        const tupleCount = responseData.count;
        messageElement.textContent = `The number of tuples in clubtable: ${tupleCount}`;
    } else {
        alert("Error in count clubtable!");
    }
}

// Function to find clubs with the maximum total goals
async function findClubWithMaxTotalGoals() {
    const response = await fetch("/find-club-max-total-goals", {
        method: 'GET'
    });


    const responseData = await response.json();
    const messageElement = document.getElementById('findClubResultMsg');

   // console.log(responseData);
    if (messageElement) {
        if (responseData.success) {
            const clubWithMaxTotalGoals = responseData.clubWithMaxTotalGoals[0];
            messageElement.textContent = `Club with Max Total Goals: ${clubWithMaxTotalGoals.clubname}, Max Total Goals: ${clubWithMaxTotalGoals.max_total_goals}`;
        } else {
            alert("Error in finding club with max total goals!");
        }
    } else {
        console.error("Element with id 'countResultMsg' not found in the HTML.");
    }
    
}



// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function () {
    checkDbConnection();
    fetchTableData();
    //document.getElementById("resetclubtable").addEventListener("click", resetclubtable);
    document.getElementById("insertClubtable").addEventListener("submit", insertClubtable);
    document.getElementById("updateValueclubtable").addEventListener("submit", updateValueclubtable);
    document.getElementById("deleteValueclubtable").addEventListener("submit", deleteValueclubtable);
    //document.getElementById("countclubtable").addEventListener("click", countclubtable);
    document.getElementById("findClubMaxTotalGoals").addEventListener("click", findClubWithMaxTotalGoals);
};

// General function to refresh the displayed table data. 
// You can invoke this after any table-modifying operation to keep consistency.
function fetchTableData() {
    fetchAndDisplayUsers();
}
