// Initialize and add the map
let map;

// 'async' allows us to wait for the map library to load
async function initMap() {
    // Location coordinates for Rexburg, ID - Shown on map load
    const position = { lat: 43.8283592, lng: -111.8753124};

    // Request 'maps' and 'marker' libraries from the Google Maps API
    // 'await' makes sure the library is loaded before continuing
    const { Map } = await google.maps.importLibrary('maps');
    const { AdvancedMarkerElement } = await google.maps.importLibrary('marker');

    // Add the map to index.html
    // Find the 'map' div element on the page and create a map in it
    // 'new Map' can be used because we imported  from the library
    map = new Map(document.getElementById('map'), {
        center: position, // Rexburg, ID
        zoom: 10, // City View
        mapId: 'JS Maps'
    });

    // Add a marker to the map at the specified position
    const marker = new AdvancedMarkerElement({
        map: map,
        position: position,
        title: "Rexburg, ID"
    });
}

// Run on page load
window.onload = initMap;
