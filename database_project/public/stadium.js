

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

// Fetches data from the stadiumtable and displays it.
async function fetchAndDisplayUsers() {
    const tableElement = document.getElementById('stadiumtable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/stadiumtable', {
        method: 'GET'
    });

    const responseData = await response.json();
    const stadiumtableContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    stadiumtableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

// This function resets or initializes the table.
async function resetStadiumtable() {
    const response = await fetch("/initiate-stadiumtable", {
        method: 'POST'
    });
    const responseData = await response.json();

    if (responseData.success) {
        const messageElement = document.getElementById('resetResultMsg');
        messageElement.textContent = "stadiumtable initiated successfully!";
        fetchTableData();
    } else {
        alert("Error initiating table!");
    }
}

// Inserts new records into the table.
async function insertStadiumtable(event) {
    event.preventDefault();

    const stadiumnameValue = document.getElementById('insertStadiumName').value;
    const cityValue = document.getElementById('insertCity').value;
    const countryValue = document.getElementById('insertCountry').value;
    const capacityValue = document.getElementById('insertCapacity').value;
    const yearbuiltValue = document.getElementById('insertYearBuilt').value;

    const response = await fetch('/insert-stadiumtable', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            stadiumname: stadiumnameValue,
            city: cityValue,
            country: countryValue,
            capacity: capacityValue,
            yearbuilt: yearbuiltValue
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

// Updates values in the table.
async function updateValuestadiumtable(event) {
    event.preventDefault();

    const updatedStadiumValue = document.getElementById('updatedStadium').value;
    const updatedStadiumColumnValue = document.getElementById('updatedStadiumColumn').value;
    const newStadiumValueValue = document.getElementById('updatedStadiumValue').value;

    const response = await fetch('/update-value-stadiumtable', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            updatedStadium: updatedStadiumValue,
            updatedStadiumColumn: updatedStadiumColumnValue,
            newStadiumValue: newStadiumValueValue
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

async function deleteValuestadiumtable(event) {
    event.preventDefault();

    const stadiumNameValue = document.getElementById('deleteStadium').value;

    const response = await fetch('/delete-stadiumtable', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            stadiumname: stadiumNameValue
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
async function countstadiumtable() {
    const response = await fetch("/count-stadiumtable", {
        method: 'GET'
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('countResultMsg');

    if (responseData.success) {
        const tupleCount = responseData.count;
        messageElement.textContent = `The number of tuples in stadiumtable: ${tupleCount}`;
    } else {
        alert("Error in count stadiumtable!");
    }
}


//JOIN
// Fetches games and stadiums based on the selected country.
async function fetchGamesAndStadiumsByCountry(event) {
    event.preventDefault();
    const countryValue = document.getElementById('inputcountry').value;
    const tableElement = document.getElementById('joinedtable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch(`/games-and-stadiums/${countryValue}`, {
        method: 'GET'
    });

    const responseData = await response.json();
    console.log('Response Data:', responseData);
    
    // Check if data is an array and not empty
    if (Array.isArray(responseData) && responseData.length > 0) {
        const gamesAndStadiumsContent = responseData;

        // Always clear old, already fetched data before new fetching process.
        if (tableBody) {
            tableBody.innerHTML = '';
        }

        // Add table headers (title) to thead
        const tableHead = tableElement.querySelector('thead tr');
        tableHead.innerHTML = '<th>Game code</th><th>Date</th><th>Score</th><th>Stadium Name</th><th>City</th><th>Country</th><th>Capacity</th><th>Year Built</th>';

        gamesAndStadiumsContent.forEach(gameDataArray => {
            // Check if the array has the expected length
            if (gameDataArray.length === 8) {
                const row = tableBody.insertRow();
                
                gameDataArray.forEach((field, index) => {
                    const cell = row.insertCell(index);
                    cell.textContent = field;
                });
            } else {
                console.error('Invalid data structure for game:', gameDataArray);
            }
        });
    } else {
        console.error('Invalid or empty data received:', responseData);
    }
}

// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function () {
    checkDbConnection();
    fetchTableData();
    document.getElementById("resetStadiumtable").addEventListener("click", resetStadiumtable);
    document.getElementById("insertStadiumtable").addEventListener("submit", insertStadiumtable);
    document.getElementById("updateValuestadiumtable").addEventListener("submit", updateValuestadiumtable);
    document.getElementById("deleteValuestadiumtable").addEventListener("submit", deleteValuestadiumtable);
    document.getElementById("countstadiumtable").addEventListener("click", countstadiumtable);
    document.getElementById('joinstadiumtablebycountry').addEventListener('submit', fetchGamesAndStadiumsByCountry);

};

// General function to refresh the displayed table data. 
// You can invoke this after any table-modifying operation to keep consistency.
function fetchTableData() {
    fetchAndDisplayUsers();
}
