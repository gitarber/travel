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
        // Map centered on Albania
        const albania = { lat: 41.0, lng: 20.0 };
        const map = new google.maps.Map(document.getElementById("albania-map"), {
            zoom: 7,
            center: albania,
            mapTypeId: 'terrain'
        });

        // Northern destinations data
        const northernDestinations = [
            {
                name: "Theth",
                position: { lat: 42.3833, lng: 19.7667 },
                type: "Mountain Village"
            },
            {
                name: "Valbona",
                position: { lat: 42.4275, lng: 19.8944 },
                type: "National Park"
            },
            {
                name: "Shkodër",
                position: { lat: 42.0683, lng: 19.5126 },
                type: "Historic City"
            },
            {
                name: "Lezhë",
                position: { lat: 41.7836, lng: 19.6436 },
                type: "Historical Site"
            },
            {
                name: "Koman Lake",
                position: { lat: 42.1333, lng: 19.8167 },
                type: "Lake & Ferry"
            },
            {
                name: "Razma",
                position: { lat: 42.3083, lng: 19.6333 },
                type: "Mountain Village"
            }
        ];

        // Add central destinations data after the northern and before southern
        const centralDestinations = [
            {
                name: "Tirana",
                position: { lat: 41.3275, lng: 19.8187 },
                type: "Capital City"
            },
            {
                name: "Durrës",
                position: { lat: 41.3233, lng: 19.4562 },
                type: "Coastal City"
            },
            {
                name: "Kruja",
                position: { lat: 41.5089, lng: 19.7950 },
                type: "Historic Town"
            }
        ];

        // Southern destinations data
        const southernDestinations = [
            {
                name: "Gjirokastër",
                position: { lat: 40.0758, lng: 20.1388 },
                type: "UNESCO Heritage"
            },
            {
                name: "Berat",
                position: { lat: 40.7050, lng: 19.9520 },
                type: "UNESCO Site"
            },
            {
                name: "Sarandë",
                position: { lat: 39.8756, lng: 20.0053 },
                type: "Coastal Resort"
            },
            {
                name: "Vlora",
                position: { lat: 40.4668, lng: 19.4912 },
                type: "Coastal City"
            },
            {
                name: "Himara",
                position: { lat: 40.1017, lng: 19.7445 },
                type: "Coastal Town"
            },
            {
                name: "Dhërmi",
                position: { lat: 40.1517, lng: 19.6411 },
                type: "Beach Paradise"
            }
        ];

        // Add markers for northern destinations
        const northernMarkers = [];
        const northernBounds = new google.maps.LatLngBounds();

        northernDestinations.forEach(destination => {
            const marker = new google.maps.Marker({
                position: destination.position,
                map: map,
                title: destination.name,
                animation: google.maps.Animation.DROP,
                visible: false // Initially hidden
            });

            // Info window for each marker
            const infoWindow = new google.maps.InfoWindow({
                content: `
                    <div class="map-info-window">
                        <h3>${destination.name}</h3>
                        <p>${destination.type}</p>
                        <a href="destinations/${destination.name.toLowerCase()}.html">Learn More</a>
                    </div>
                `
            });

            marker.addListener("click", () => {
                infoWindow.open(map, marker);
            });

            northernMarkers.push(marker);
            northernBounds.extend(destination.position);
        });

        // Add markers for central destinations after the northern markers code
        const centralMarkers = [];
        const centralBounds = new google.maps.LatLngBounds();

        centralDestinations.forEach(destination => {
            const marker = new google.maps.Marker({
                position: destination.position,
                map: map,
                title: destination.name,
                animation: google.maps.Animation.DROP,
                visible: false // Initially hidden
            });

            // Info window for each marker
            const infoWindow = new google.maps.InfoWindow({
                content: `
                    <div class="map-info-window">
                        <h3>${destination.name}</h3>
                        <p>${destination.type}</p>
                        <a href="destinations/${destination.name.toLowerCase()}.html">Learn More</a>
                    </div>
                `
            });

            marker.addListener("click", () => {
                infoWindow.open(map, marker);
            });

            centralMarkers.push(marker);
            centralBounds.extend(destination.position);
        });

        // Add markers for southern destinations
        const southernMarkers = [];
        const southernBounds = new google.maps.LatLngBounds();

        southernDestinations.forEach(destination => {
            const marker = new google.maps.Marker({
                position: destination.position,
                map: map,
                title: destination.name,
                animation: google.maps.Animation.DROP
            });

            // Info window for each marker
            const infoWindow = new google.maps.InfoWindow({
                content: `
                    <div class="map-info-window">
                        <h3>${destination.name}</h3>
                        <p>${destination.type}</p>
                        <a href="destinations/${destination.name.toLowerCase()}.html">Learn More</a>
                    </div>
                `
            });

            marker.addListener("click", () => {
                infoWindow.open(map, marker);
            });

            southernMarkers.push(marker);
            southernBounds.extend(destination.position);
        });

        // Update the region tab click handler to include central markers
        document.querySelectorAll('.region-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const region = e.target.dataset.region;
                
                // Hide all markers first
                [...northernMarkers, ...centralMarkers, ...southernMarkers].forEach(marker => 
                    marker.setVisible(false)
                );
                
                // Update map view based on region
                switch(region) {
                    case 'northern':
                        map.fitBounds(northernBounds);
                        northernMarkers.forEach(marker => marker.setVisible(true));
                        break;
                    case 'central':
                        map.fitBounds(centralBounds);
                        centralMarkers.forEach(marker => marker.setVisible(true));
                        break;
                    case 'southern':
                        map.fitBounds(southernBounds);
                        southernMarkers.forEach(marker => marker.setVisible(true));
                        break;
                }
            });
        });

        // Show northern destinations by default if northern tab is active
        if (document.querySelector('.region-tab[data-region="northern"]').classList.contains('active')) {
            map.fitBounds(northernBounds);
            northernMarkers.forEach(marker => marker.setVisible(true));
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