let directionsService;
let directionsRenderer;

// Function to calculate and display route between two addresses
async function calculateRoute(address1, address2) {
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    const address1 = document.getElementById('address_1').value;
    const address2 = document.getElementById('address_2').value;

    const request = {
        origin: address1,
        destination: address2,
        travelMode: google.maps.TravelMode.DRIVING
    };

    directionsService.route(request, function(result, status) {
        if (status == 'OK') {
            directionsRenderer.setDirections(result);
        } else {
            alert('Could not display directions due to: ' + status);
        }
    });
}
