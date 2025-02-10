function initMap() {
    // Koman Lake coordinates
    const komanLocation = { lat: 42.1087, lng: 19.8267 };
    
    const map = new google.maps.Map(document.getElementById('destination-map'), {
        zoom: 12,
        center: komanLocation,
        mapTypeId: 'terrain', // Shows terrain features
        styles: [
            {
                featureType: 'water',
                elementType: 'geometry',
                stylers: [{ color: '#004358' }]
            },
            {
                featureType: 'landscape',
                elementType: 'geometry',
                stylers: [{ color: '#e9e5dc' }]
            }
        ]
    });

    // Add marker for Koman Lake
    new google.maps.Marker({
        position: komanLocation,
        map: map,
        title: 'Koman Lake'
    });
}

// Initialize map when page loads
google.maps.event.addDomListener(window, 'load', initMap); 