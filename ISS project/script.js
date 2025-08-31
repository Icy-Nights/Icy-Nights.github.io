//Start

// Initialize the chart data
let timeLabels = [];  // Store time (x-axis)
let speedData = [];   // Store ISS speed data (y-axis)
let heightData = [];   // Store ISS height data (y-axis)

// Create the chart for Time vs Velocity
const ctx = document.getElementById('velocityChart').getContext('2d');
const velocityChart = new Chart(ctx, {
    type: 'line', // Line chart
    data: {
        labels: timeLabels, // Time labels (x-axis)
        datasets: [{
            label: 'ISS Orbital Velocity (km/h)',
            data: speedData,  // ISS speed data (y-axis)
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: false,
            lineTension: 0.1,
        }]
    },
    options: {
        scales: {
            x: {
                type: 'linear',
                position: 'bottom',
                ticks: {
                    callback: function(value, index, values) {
                        return new Date(value).toLocaleTimeString(); // Display time in readable format
                    }
                }
            },
            y: {
                beginAtZero: false,
                min: 27500,      // Set the minimum value of the y-axis
                max: 27700,      // Set the maximum value of the y-axis
                title: {
                    display: true,
                    text: 'Speed (km/h)'
                }
            }
        },
        responsive: true,
        maintainAspectRatio: true,
    }
});

// Create the chart for Time vs Height
const heightctx = document.getElementById('heightChart').getContext('2d');
const heightChart = new Chart(heightctx, {
    type: 'line', // Line chart
    data: {
        labels: timeLabels, // Time labels (x-axis)
        datasets: [{
            label: 'ISS Orbital Velocity (km/h)',
            data: heightData,  // ISS height data (y-axis)
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: false,
            lineTension: 0.1,
        }]
    },
    options: {
        scales: {
            x: {
                type: 'linear',
                position: 'bottom',
                ticks: {
                    callback: function(value, index, values) {
                        return new Date(value).toLocaleTimeString(); // Display time in readable format
                    }
                }
            },
            y: {
                beginAtZero: false,
                min: 410,      // Set the minimum value of the y-axis
                max: 425,      // Set the maximum value of the y-axis
                title: {
                    display: true,
                    text: 'Altitude (km)'
                }
            }
        },
        responsive: true,
        maintainAspectRatio: true,
    }
});

//Declares function and async means  function will use asynchronous operations 
//(like fetch) and allows the use of await.
let inputNum;
async function getISSData() {
    // Try block to safely run code that might cause an error (like fetching data from the internet)
    try {
        // Result is stored in the variable response
        // fetch() function to make a network request to the ISS location API.
        // await pauses the function until the response comes back
        const response = await fetch('http://api.open-notify.org/iss-now.json');
        const response2 = await fetch('https://api.wheretheiss.at/v1/satellites/25544');
        // Converts the response (which is a stream) into a usable JavaScript object using .json()
        // await is used because .json() is also asynchronous
        // stored in data variable

        //Example of data returned:
        /*
            {
                "message": "success",
                "timestamp": 1596569091,
                "iss_position": {
                    "latitude": "42.2456",
                    "longitude": "75.6789"
                }
            }
        */
        const data = await response.json();
        // From ISS Tracker
        const data2 = await response2.json();

        //Extracts the latitude and longitude from the JSON response.
        const latitude = data.iss_position.latitude;
        const longitude = data.iss_position.longitude;
        const sLatitude = data2.solar_lat;
        const sLongitude = data2.solar_lon;

        const the_speed = data2.velocity;
        const the_height = data2.altitude;
        const the_light = data2.visibility;
        

        // Extract speed (velocity) from API response
        const graph_speed = data2.velocity;
        const graph_height = data2.altitude;
        const currentTime = Date.now();  // Current timestamp in ms


        // Finds the HTML elements with id="lat" and id="lon" and updates variable DOM
        document.getElementById('lat').textContent = latitude;
        document.getElementById('lon').textContent = longitude;

        // Finds the HTML elements with id="s_lat" and id="s_lon" and updates variable DOM
        document.getElementById('s_lat').textContent = sLatitude;
        document.getElementById('s_lon').textContent = sLongitude;

       // document.getElementById('time').textContent = the_time;
        document.getElementById('speed').textContent = the_speed + " km/h";
        document.getElementById('height').textContent = the_height + " km";
        document.getElementById('daylight').textContent = the_light;


        // Add new data to the chart
        timeLabels.push(currentTime);  // Add current time (in ms)
        speedData.push(graph_speed);   // Add ISS speed
        heightData.push(graph_height);  // Add ISS height
        
        // Keep the graph up to date (remove old data to avoid overfilling the graph)
        if (timeLabels.length > 20) {
            timeLabels.shift();
            speedData.shift();
            heightData.shift();
        }

        // Update the chart
        velocityChart.update();
        heightChart.update();

    // Code for ISS calculator
    document.getElementById("calculatePositionButton").onclick = function() {
        inputLat = document.getElementById("calculatePosition1").value;
        inputLong = document.getElementById("calculatePosition2").value;
        document.getElementById("distanceResult").textContent = 2 * 6371 * Math.asin(Math.sqrt(Math.pow(Math.sin((inputLat - latitude)/2),2) + Math.cos(latitude) * Math.cos(inputLat) * Math.pow(Math.sin((inputLong - longitude)/2),2)))
    }

    //Code for Solar Panel Power calculator
    document.getElementById("calculatePowerButton").onclick = function() {
        inputArea = document.getElementById("panelArea").value;
        inputEffi = document.getElementById("panelEfficiency").value;
        inputIrr = document.getElementById("panelIrradiance").value;
        document.getElementById("powerResult").textContent = inputArea * inputEffi * inputIrr;
    }
    
    //If error occurs then display message
    } catch (error) {
        console.error("Error fetching ISS data:", error);
    }


}

function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    const meridiem = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    hours = hours.toString().padStart(2, 0);

    const minutes = now.getMinutes().toString().padStart(2, 0);
    const seconds = now.getSeconds().toString().padStart(2, 0);
    const timeString = `${hours}:${minutes}:${seconds} ${meridiem}`;
    document.getElementById("time").textContent = timeString;
}

updateClock();
setInterval(updateClock, 1000);

// Update every 5 seconds
getISSData();
setInterval(getISSData, 5000);


//CSV Table Code

function demoB () {
  // (PART A) READ CSV FILE
  Papa.parse(document.getElementById("picker").files[0], {
    skipEmptyLines: true,

    // (PART B) DRAW CSV FILE
    complete : csv => {
      // (B1) GET + RESET HTML TABLE
      var table = document.getElementById("demoB");
          table.innerHTML = "";

      // (B2) DRAW TABLE ROWS
      for (let row of csv.data) {
        let tr = table.insertRow();
        for (let cell of row) {
          let td = tr.insertCell();
          td.innerHTML = cell;
        }
      }
    }
  });
}