document.addEventListener('DOMContentLoaded', function() {
    // Initialize map with Valbona coordinates
    function initMap() {
        const valbonaLocation = { lat: 42.4275, lng: 19.8961 };
        const map = new google.maps.Map(document.getElementById('destination-map'), {
            zoom: 14,
            center: valbonaLocation,
            styles: [
                {
                    "featureType": "landscape.natural",
                    "elementType": "geometry",
                    "stylers": [{"color": "#e8e8e8"}, {"visibility": "on"}]
                },
                {
                    "featureType": "poi.park",
                    "elementType": "all",
                    "stylers": [{"color": "#c6e8b3"}, {"visibility": "on"}]
                },
                {
                    "featureType": "landscape.natural.terrain",
                    "elementType": "geometry",
                    "stylers": [{"color": "#c6e8b3"}]
                },
                {
                    "featureType": "water",
                    "elementType": "geometry",
                    "stylers": [{"color": "#a3ccff"}]
                }
            ]
        });

        // Add marker for Valbona village center
        new google.maps.Marker({
            position: valbonaLocation,
            map: map,
            title: 'Valbona Village'
        });

        // Add markers for main attractions
        const attractions = [
            {
                position: { lat: 42.4275, lng: 19.8961 },
                title: 'Valbona Village',
                icon: {
                    url: '../assets/images/icons/village.png',
                    scaledSize: new google.maps.Size(32, 32)
                }
            },
            {
                position: { lat: 42.4500, lng: 19.9100 },
                title: 'Valbona Peak',
                icon: {
                    url: '../assets/images/icons/mountain.png',
                    scaledSize: new google.maps.Size(32, 32)
                }
            },
            {
                position: { lat: 42.3911, lng: 19.7744 },
                title: 'Theth Waterfall',
                icon: {
                    url: '../assets/images/icons/waterfall.png',
                    scaledSize: new google.maps.Size(32, 32)
                }
            },
            {
                position: { lat: 42.3989, lng: 19.7850 },
                title: 'Blue Eye of Theth',
                icon: {
                    url: '../assets/images/icons/water.png',
                    scaledSize: new google.maps.Size(32, 32)
                }
            },
            {
                position: { lat: 42.3836, lng: 19.7722 },
                title: 'Lock-in Tower',
                icon: {
                    url: '../assets/images/icons/tower.png',
                    scaledSize: new google.maps.Size(32, 32)
                }
            },
            {
                position: { lat: 42.3831, lng: 19.7717 },
                title: 'Church of Theth',
                icon: {
                    url: '../assets/images/icons/church.png',
                    scaledSize: new google.maps.Size(32, 32)
                }
            }
        ];

        // Add markers for all attractions
        attractions.forEach(attraction => {
            const marker = new google.maps.Marker({
                position: attraction.position,
                map: map,
                title: attraction.title,
                icon: attraction.icon
            });

            // Add click listener to center map on marker
            marker.addListener('click', () => {
                map.setCenter(attraction.position);
                map.setZoom(15);
            });
        });

        // Add hiking trails (polylines)
        const hikingTrails = [
            {
                name: 'Theth-Valbona Trail',
                path: [
                    { lat: 42.3833, lng: 19.7667 }, // Theth
                    { lat: 42.4000, lng: 19.7800 }, // Intermediate point
                    { lat: 42.4167, lng: 19.8000 }  // Valbona Pass
                ],
                color: '#FF4136'
            },
            {
                name: 'Blue Eye Trail',
                path: [
                    { lat: 42.3833, lng: 19.7667 }, // Theth
                    { lat: 42.3900, lng: 19.7800 }, // Intermediate point
                    { lat: 42.3989, lng: 19.7850 }  // Blue Eye
                ],
                color: '#0074D9'
            }
        ];

        // Draw hiking trails
        hikingTrails.forEach(trail => {
            new google.maps.Polyline({
                path: trail.path,
                geodesic: true,
                strokeColor: trail.color,
                strokeOpacity: 1.0,
                strokeWeight: 2,
                map: map
            });
        });
    }

    // Initialize map if Google Maps API is loaded
    if (typeof google !== 'undefined') {
        initMap();
    }

    // Weather widget update
    function updateWeather() {
        // Fetch weather data for Valbona
        fetch('https://api.weatherapi.com/v1/forecast.json?key=YOUR_API_KEY&q=Valbona,Albania&days=3')
            .then(response => response.json())
            .then(data => {
                // Update current weather
                document.querySelector('.temperature').textContent = `${data.current.temp_c}°C`;
                
                // Update weather icon based on conditions
                const weatherIcon = document.querySelector('.weather-main i');
                const condition = data.current.condition.code;
                updateWeatherIcon(weatherIcon, condition);

                // Update weather details
                document.querySelector('.weather-details span:first-child').innerHTML = 
                    `<i class="fas fa-tint"></i> Humidity: ${data.current.humidity}%`;
                document.querySelector('.weather-details span:last-child').innerHTML = 
                    `<i class="fas fa-wind"></i> Wind: ${data.current.wind_kph} km/h`;

                // Update forecast
                const forecastDays = document.querySelectorAll('.forecast-day');
                data.forecast.forecastday.forEach((day, index) => {
                    if (forecastDays[index]) {
                        const dayTemp = day.day.avgtemp_c;
                        const dayCondition = day.day.condition.code;
                        const dayIcon = forecastDays[index].querySelector('i');
                        
                        updateWeatherIcon(dayIcon, dayCondition);
                        forecastDays[index].querySelector('span:last-child').textContent = `${dayTemp}°C`;
                    }
                });
            })
            .catch(error => console.error('Error fetching weather:', error));
    }

    // Helper function to update weather icons
    function updateWeatherIcon(iconElement, conditionCode) {
        // Map condition codes to Font Awesome icons
        const iconMap = {
            1000: 'sun', // Clear
            1003: 'cloud-sun', // Partly cloudy
            1006: 'cloud', // Cloudy
            1183: 'cloud-rain', // Light rain
            1189: 'cloud-showers-heavy', // Moderate rain
            1216: 'snowflake', // Light snow
            1225: 'snowflake' // Heavy snow
        };

        const iconClass = iconMap[conditionCode] || 'cloud';
        iconElement.className = `fas fa-${iconClass}`;
    }

    // Tour booking functionality
    const bookButtons = document.querySelectorAll('.book-button');
    bookButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tourName = this.closest('.tour-option')?.querySelector('h4')?.textContent || 'Selected tour';
            // Show booking modal or redirect to booking system
            alert(`Booking system for ${tourName} coming soon!`);
        });
    });

    // Initialize weather updates
    updateWeather();
    setInterval(updateWeather, 1800000); // Update every 30 minutes

    // Add trail difficulty warnings based on weather
    function updateTrailWarnings() {
        const currentTemp = parseFloat(document.querySelector('.temperature').textContent);
        const warningElement = document.createElement('div');
        warningElement.className = 'trail-warning';

        if (currentTemp < 5) {
            warningElement.innerHTML = `
                <i class="fas fa-exclamation-triangle"></i>
                <span>Trail conditions may be icy. Extra caution advised.</span>
            `;
            document.querySelector('.transport-section').prepend(warningElement);
        }
    }

    // Call updateTrailWarnings after weather updates
    document.addEventListener('weatherUpdated', updateTrailWarnings);
}); 