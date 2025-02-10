// Initialize the map for Valbona Valley
function initMap() {
    // Valbona Valley coordinates
    const valbonaCoords = { lat: 42.4269, lng: 19.8744 };
    
    // Map options
    const mapOptions = {
        zoom: 12,
        center: valbonaCoords,
        mapTypeId: 'terrain', // Shows terrain features
        styles: [
            {
                featureType: 'landscape.natural',
                elementType: 'geometry',
                stylers: [{ color: '#e9e5dc' }]
            },
            {
                featureType: 'poi.park',
                elementType: 'geometry',
                stylers: [{ color: '#c5dac6' }]
            }
        ]
    };

    // Create the map
    const map = new google.maps.Map(document.getElementById('destination-map'), mapOptions);

    // Add marker for Valbona Valley
    const marker = new google.maps.Marker({
        position: valbonaCoords,
        map: map,
        title: 'Valbona Valley National Park',
        animation: google.maps.Animation.DROP
    });

    // Add info window
    const infoWindow = new google.maps.InfoWindow({
        content: `
            <div class="map-info-window">
                <h3>Valbona Valley</h3>
                <p>National Park in the Albanian Alps</p>
                <p>Elevation: 1,800m</p>
            </div>
        `
    });

    // Show info window when marker is clicked
    marker.addListener('click', () => {
        infoWindow.open(map, marker);
    });

    // Add additional points of interest
    const pointsOfInterest = [
        {
            position: { lat: 42.4219, lng: 19.8644 },
            title: 'Valbona Peak',
            info: 'Elevation: 2,694m'
        },
        {
            position: { lat: 42.4319, lng: 19.8844 },
            title: 'Rrogam Village',
            info: 'Traditional mountain village'
        },
        {
            position: { lat: 42.4169, lng: 19.8544 },
            title: 'Valbona Pass',
            info: 'Trail to Theth'
        }
    ];

    // Add markers for points of interest
    pointsOfInterest.forEach(poi => {
        const poiMarker = new google.maps.Marker({
            position: poi.position,
            map: map,
            title: poi.title,
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: '#FF6E40',
                fillOpacity: 0.8,
                strokeWeight: 1,
                strokeColor: '#FFFFFF'
            }
        });

        const poiInfoWindow = new google.maps.InfoWindow({
            content: `
                <div class="map-info-window">
                    <h3>${poi.title}</h3>
                    <p>${poi.info}</p>
                </div>
            `
        });

        poiMarker.addListener('click', () => {
            poiInfoWindow.open(map, poiMarker);
        });
    });
}

// Initialize map when page loads
window.onload = initMap; 