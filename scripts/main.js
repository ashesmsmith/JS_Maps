// Initialize Google Maps API - default location Rexburg, ID
// Input from user (nickname and location) processed added to locations and markers arrays
// Calculate and display route using Directions API
// Calculate and display total distance and duration of route

let map;
let markers = []; // Array to hold map markers
let locations = []; // Array to hold location data
let directionsService;
let directionsRenderer;

// Event listener for Add Location button
const addBtn = document.getElementById('add-btn');
addBtn.addEventListener('click', addLocation);

// Event listener for Create Itinerary button
const createItineraryBtn = document.getElementById('create-itinerary-btn');
createItineraryBtn.addEventListener('click', createRoute);

// Initialize
// 'async' allows us to wait for the map library to load
async function initMap() {
    // Location coordinates for Rexburg, ID - Shown on map load as default
    const defaultPosition = { lat: 43.8231, lng: -111.7924 };

    // Request libraries from the Google Maps API
    // 'await' makes sure the library is loaded before continuing
    const { Map } = await google.maps.importLibrary('maps');

    // Find the 'map' div element and display the map in it
    map = new Map(document.getElementById('map'), {
        center: defaultPosition, // Rexburg, ID
        zoom: 10, // City View
        mapId: 'JS Maps'
    });

    // Initialize Directions Service and Renderer - Directions API
    // 'DirectionsService' is used to calculate the route
    // 'DirectionsRenderer' is used to display the route on the map
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer( { map: map } );
}


// Function to add a location based on user input
function addLocation() {
    const locationInput = document.querySelector('#location').value;
    const locationNickname = document.querySelector('#nickname').value;

    if (!locationInput || !locationNickname) {
        alert("Please enter a Location and Nickname.");
        return;
    }

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode( { 'address': locationInput }, function(results, status) {
        if (status == 'OK') {
            const position = results[0].geometry.location;

            // Add location to locations array
            locations.push({ nickname: locationNickname, location: position});

            // Create a marker for the location
            const marker = new google.maps.Marker({
                map,
                position: position,
                title: locationNickname
            });
            markers.push(marker);
        } else {
            alert('Geocode Failed for reason: ' + status);
        }

        // Add location to the list on page
        const locationsList = document.getElementById('locations-list');
        const listItem = document.createElement('li');
        listItem.textContent = `${locationNickname}`;
        locationsList.appendChild(listItem);

    });

    // Clear the input fields
    document.querySelector('#nickname').value = '';
    document.querySelector('#location').value = '';
}


// Function to create and display the route
function createRoute() {
    if (locations.length < 2) {
        alert("Please add at least two locations to create a route.");
        return;
    }

    // Select Waypoints (all locations except start and end) for the route
    // .map() creates a new array with waypoints in API required format (location, stopover)
    let waypoints = []; // Remains empty if only 2 locations
    if (locations.length > 2) {
        waypoints = locations.slice(1, -1).map(loc => ({
            location: loc.location,
            stopover: true
        }));
    }

    // Directions Service method route() to calculate the route
    directionsService.route(
        {
            origin: locations[0].location, // Required - Start location
            destination: locations[locations.length - 1].location, // Required - End location
            waypoints: waypoints, // Optional - All the locations in between
            travelMode: google.maps.TravelMode.DRIVING, // Required - Travel by driving
        },
        (result, status) => {
            if (status == 'OK') {
                directionsRenderer.setDirections(result);

                // Calculate and Display Total Distance
                const distances = result.routes[0].legs.map(leg => leg.distance.value); // distance in meters
                const totalDistance = calculateDistance(distances).toFixed(2);

                document.getElementById('total-distance').innerText = `${(totalDistance)} miles`;

                // Calculate and Display Total Duration
                const durations = result.routes[0].legs.map(leg => leg.duration.value); // duration in seconds
                const totalDuration = calculateDuration(durations);

                document.getElementById('total-duration').innerText = `${totalDuration}`;
            } else {
                alert('Directions Request Failed:' + status);
            }
        }
    )
}


// Function to calculate total distance in miles
function calculateDistance(distances, i = 0) {
    if (i >= distances.length) return 0; // base case to stop recursion

    // Convert meters to miles (1 meter = 0.00062137 miles)
    // Recursion - add current distance conversion to the sum of the rest
    return (distances[i] * 0.00062137) + calculateDistance(distances, i + 1);
}


// Function to calculate total time in minutes
function calculateDuration(durations, i = 0) {
    if (i >= durations.length) return 0; // base case to stop recursion

    // Convert seconds to minutes
    // Recursion - add current duration conversion to the sum of the rest
    let duration = (durations[i] / 60) + calculateDuration(durations, i + 1);

    // Formatting - Complete after recursion
    // Convert to hours and minutes if 60 minutes or more
    if (i === 0) {
        if (duration >= 60) {
            const hours = Math.floor(duration / 60); // Rounds down to nearest hour
            const minutes = Math.round(duration % 60); // Remaining minutes rounded to nearest minute
            duration = `${hours} hr ${minutes} min`;
        } else {
            duration = `${Math.round(duration)} min`;
        }
    }

    return duration;
}

// Run on page load
window.onload = initMap;
