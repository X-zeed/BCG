document.getElementById('myButton').addEventListener('click', function() {
    let url = 'https://api.sheety.co/2a2edb32246966ec3fcd0f1adf2db8d0/bcg/data';

    // Show the loading indicator while data is being fetched
    document.getElementById('loadingIndicator').style.display = 'block';

    // Fetch data from the API
    fetch(url)
    .then((response) => {
        // Check if the response is okay, if not throw an error
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        // Return the JSON data from the response
        return response.json();
    })
    .then(json => {
        // Log the data to the console for debugging purposes
        console.log(json.data);  // Inspect the structure of the data
        
        // Display the data in the table
        window.tableData = json.data;  // Store data globally to access in search
        displayDataInTable(json.data);
    })
    .catch(error => {
        // Log any errors to the console
        console.error('Error fetching data:', error);
    })
    .finally(() => {
        // Hide the loading indicator once data is loaded or an error occurs
        document.getElementById('loadingIndicator').style.display = 'none';
    });
});

// Function to display the fetched data in the HTML table
function displayDataInTable(data) {
    const tableBody = document.getElementById('dataTable').getElementsByTagName('tbody')[0];

    // Clear any existing rows in the table
    tableBody.innerHTML = '';

    // Loop through the data and create table rows
    data.forEach(item => {
        const row = tableBody.insertRow();  // Create a new row

        // Insert cells for ID, Name, and Score
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        const cell3 = row.insertCell(2);

        // Populate cells with the data
        cell1.textContent = item.id - 1;  // Assuming ID starts from 1 and you want to show 0-based index
        cell2.textContent = item["ชื่อ นามสกุล"] || 'N/A';    // Display the 'ชื่อ นามสกุล' field or 'N/A' if undefined
        cell3.textContent = item.score || 0;   // Display the 'score' field or 0 if undefined
    });
}

// Add an event listener for the search input
document.querySelector('input[type="search"]').addEventListener('input', function(event) {
    const query = event.target.value.toLowerCase();
    const filteredData = window.tableData.filter(item => {
        const name = item["ชื่อ นามสกุล"] ? item["ชื่อ นามสกุล"].toLowerCase() : '';
        return name.includes(query);
    });
    displayDataInTable(filteredData);
});
