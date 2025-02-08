document.addEventListener('DOMContentLoaded', function() {
    // Region Tabs Functionality
    const regionTabs = document.querySelectorAll('.region-tab');
    const regionSections = document.querySelectorAll('.region-section');

    regionTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and sections
            regionTabs.forEach(t => t.classList.remove('active'));
            regionSections.forEach(s => s.classList.remove('active'));

            // Add active class to clicked tab and corresponding section
            tab.classList.add('active');
            const region = tab.dataset.region;
            document.getElementById(region).classList.add('active');

            // Update map focus
            updateMapFocus(region);
        });
    });

    // Initialize Google Maps
    function initMap() {
        const albaniaCenter = { lat: 41.3275, lng: 19.8187 };
        const map = new google.maps.Map(document.getElementById('albania-map'), {
            zoom: 7,
            center: albaniaCenter,
            styles: [/* Custom map styles */]
        });

        // Add markers for destinations
        addDestinationMarkers(map);
    }

    function addDestinationMarkers(map) {
        const destinations = {
            theth: {
                position: { lat: 42.3833, lng: 19.7667 },
                title: 'Theth'
            },
            valbona: {
                position: { lat: 42.4275, lng: 19.8944 },
                title: 'Valbona Valley'
            },
            // Add more destinations
        };

        for (const [key, destination] of Object.entries(destinations)) {
            const marker = new google.maps.Marker({
                position: destination.position,
                map: map,
                title: destination.title,
                animation: google.maps.Animation.DROP
            });

            // Add click listener for marker info window
            marker.addListener('click', () => {
                // Show destination info
            });
        }
    }

    function updateMapFocus(region) {
        const regionCoordinates = {
            northern: { lat: 42.4, lng: 19.8, zoom: 8 },
            central: { lat: 41.3, lng: 19.8, zoom: 8 },
            southern: { lat: 40.5, lng: 19.8, zoom: 8 }
        };

        const coords = regionCoordinates[region];
        map.setCenter(coords);
        map.setZoom(coords.zoom);
    }

    // Initialize map
    initMap();
}); 