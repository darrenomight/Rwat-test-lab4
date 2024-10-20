document.getElementById("syncBtn").addEventListener("click", fetchSync);
document.getElementById("asyncBtn").addEventListener("click", fetchAsync);
document.getElementById("fetchBtn").addEventListener("click", fetchWithPromises);

const basePath = "data/";

function parseData(data) {
    return data.map(entry => {
        const [firstName, lastName] = entry.name.split(" ");
        return { firstName, lastName, id: entry.id };
    });
}

function updateTable(data) {
    const tbody = document.getElementById('dataTable').querySelector('tbody');
    tbody.innerHTML = ''; // Clear previous entries
    data.forEach(entry => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${entry.firstName}</td><td>${entry.lastName}</td><td>${entry.id}</td>`;
        tbody.appendChild(row);
    });
}

// Synchronous XMLHttpRequest
function fetchSync() {
    try {
        const referenceData = fetchSyncData(basePath + "reference.json");
        const data1File = referenceData.data_location;
        const data1 = fetchSyncData(basePath + data1File);
        const data2File = data1.data_location;
        const data2 = fetchSyncData(basePath + data2File);
        const data3 = fetchSyncData(basePath + "data3.json");

        const allData = [...data1.data, ...data2.data, ...data3.data];
        updateTable(parseData(allData));
    } catch (error) {
        console.error(error);
    }
}

function fetchSyncData(url) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, false); // Synchronous
    xhr.send();

    if (xhr.status === 200) {
        return JSON.parse(xhr.responseText);
    } else {
        throw new Error("Error fetching data");
    }
}

// Asynchronous XMLHttpRequest with callbacks
function fetchAsync() {
    fetchAsyncData(basePath + "reference.json", function (referenceData) {
        fetchAsyncData(basePath + referenceData.data_location, function (data1) {
            fetchAsyncData(basePath + data1.data_location, function (data2) {
                fetchAsyncData(basePath + "data3.json", function (data3) {
                    const allData = [...data1.data, ...data2.data, ...data3.data];
                    updateTable(parseData(allData));
                });
            });
        });
    });
}

function fetchAsyncData(url, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true); // Asynchronous
    xhr.onload = function () {
        if (xhr.status === 200) {
            callback(JSON.parse(xhr.responseText));
        } else {
            console.error("Error fetching data");
        }
    };
    xhr.send();
}

// Fetch with Promises
function fetchWithPromises() {
    fetch(basePath + "reference.json")
        .then(response => response.json())
        .then(referenceData => fetch(basePath + referenceData.data_location))
        .then(response => response.json())
        .then(data1 => fetch(basePath + data1.data_location)
            .then(response => response.json())
            .then(data2 => fetch(basePath + "data3.json")
                .then(response => response.json())
                .then(data3 => {
                    const allData = [...data1.data, ...data2.data, ...data3.data];
                    updateTable(parseData(allData));
                })
            )
        )
        .catch(error => console.error('Error fetching data:', error));
}
