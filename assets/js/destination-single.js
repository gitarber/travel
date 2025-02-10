document.addEventListener('DOMContentLoaded', function() {
    // Initialize map for single destination
    function initDestinationMap() {
        // Theth coordinates
        const thethLocation = { lat: 42.3833, lng: 19.7667 };
        
        const map = new google.maps.Map(document.getElementById('destination-map'), {
            zoom: 13,
            center: thethLocation,
            mapTypeId: 'terrain'
        });

        // Add marker for Theth
        const marker = new google.maps.Marker({
            position: thethLocation,
            map: map,
            title: 'Theth',
            animation: google.maps.Animation.DROP
        });

        // Info window for Theth
        const infoWindow = new google.maps.InfoWindow({
            content: `
                <div class="map-info-window">
                    <h3>Theth</h3>
                    <p>Mountain Village</p>
                    <p>Elevation: 750m</p>
                </div>
            `
        });

        marker.addListener('click', () => {
            infoWindow.open(map, marker);
        });
    }

    // Initialize map if map element exists
    if (document.getElementById('destination-map')) {
        initDestinationMap();
    }

    // Handle weather alerts
    const weatherAlert = document.querySelector('.weather-alert');
    if (weatherAlert) {
        weatherAlert.style.display = 'block';
    }

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

    // Weather widget functionality
    class WeatherWidget {
        constructor() {
            this.API_KEY = 'e4dbf30cab254c74b03184912251002';
            this.locationCoords = {
                'Shkodër': '42.0683,19.5126',
                'Theth': '42.3833,19.7667',
                'Valbona': '42.4275,19.8961',
                'Koman Lake': '42.1087,19.8267',
                'Lezhe': '41.7836,19.6442',
                'Berat': '40.7050,19.9520',
                'Gjirokastër': '40.0758,20.1388',
                'Sarandë': '39.8759,20.0027',
                'Razma': '42.2167,19.6333'
            };
            this.initWeather();
        }

        async initWeather() {
            // Get current page location from the last breadcrumb item
            const location = document.querySelector('.breadcrumb span:last-child').textContent.trim();
            const coordinates = this.locationCoords[location] || `${location},Albania`;
            await this.updateWeather(coordinates);
        }

        async updateWeather(coordinates) {
            try {
                const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${this.API_KEY}&q=${coordinates}&days=3`);
                const data = await response.json();
                
                if (data.error) {
                    console.error('Weather API Error:', data.error);
                    return;
                }

                // Update current weather
                const currentTemp = Math.round(data.current.temp_c);
                const currentCondition = data.current.condition.code;
                
                // Update main temperature display
                const weatherInfo = document.querySelector('.weather-info');
                const mainDisplay = weatherInfo.querySelector('div:first-child');
                mainDisplay.innerHTML = `
                    <i class="fas ${this.getWeatherIcon(currentCondition)}" style="color: #FFD700; font-size: 3rem;"></i>
                    <span style="font-size: 3rem; color: #2B3B4E; margin-left: 10px;">${currentTemp}°C</span>
                `;

                // Update humidity and wind
                weatherInfo.querySelector('.weather-details').innerHTML = `
                    <div>
                        <i class="fas fa-tint"></i> Humidity: ${data.current.humidity}%
                    </div>
                    <div>
                        <i class="fas fa-wind"></i> Wind: ${Math.round(data.current.wind_kph)} km/h
                    </div>
                `;

                // Update 3-day forecast
                const forecastContainer = weatherInfo.querySelector('.forecast');
                const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                
                let forecastHTML = '';
                data.forecast.forecastday.forEach(day => {
                    const date = new Date(day.date);
                    const dayName = days[date.getDay()];
                    const icon = this.getWeatherIcon(day.day.condition.code);
                    const temp = Math.round(day.day.avgtemp_c);
                    
                    forecastHTML += `
                        <div>
                            <div>${dayName}</div>
                            <i class="fas ${icon}" ${icon.includes('sun') ? 'style="color: #FFD700;"' : ''}></i>
                            <div>${temp}°C</div>
                        </div>
                    `;
                });
                forecastContainer.innerHTML = forecastHTML;

            } catch (error) {
                console.error('Error fetching weather data:', error);
            }
        }

        getWeatherIcon(code) {
            // Extended weather code mapping
            const iconMap = {
                1000: 'fa-sun', // Clear
                1003: 'fa-cloud-sun', // Partly cloudy
                1006: 'fa-cloud', // Cloudy
                1009: 'fa-cloud', // Overcast
                1030: 'fa-smog', // Mist
                1063: 'fa-cloud-rain', // Patchy rain
                1066: 'fa-snowflake', // Patchy snow
                1069: 'fa-snowflake', // Patchy sleet
                1072: 'fa-cloud-rain', // Patchy freezing drizzle
                1087: 'fa-bolt', // Thundery outbreaks
                1114: 'fa-snowflake', // Blowing snow
                1117: 'fa-snowflake', // Blizzard
                1135: 'fa-smog', // Fog
                1147: 'fa-smog', // Freezing fog
                1150: 'fa-cloud-rain', // Patchy light drizzle
                1153: 'fa-cloud-rain', // Light drizzle
                1168: 'fa-cloud-rain', // Freezing drizzle
                1171: 'fa-cloud-rain', // Heavy freezing drizzle
                1180: 'fa-cloud-rain', // Patchy light rain
                1183: 'fa-cloud-rain', // Light rain
                1186: 'fa-cloud-rain', // Moderate rain
                1189: 'fa-cloud-rain', // Moderate rain
                1192: 'fa-cloud-showers-heavy', // Heavy rain
                1195: 'fa-cloud-showers-heavy', // Heavy rain
                1198: 'fa-cloud-rain', // Light freezing rain
                1201: 'fa-cloud-rain', // Moderate/heavy freezing rain
                1204: 'fa-snowflake', // Light sleet
                1207: 'fa-snowflake', // Moderate/heavy sleet
                1210: 'fa-snowflake', // Patchy light snow
                1213: 'fa-snowflake', // Light snow
                1216: 'fa-snowflake', // Patchy moderate snow
                1219: 'fa-snowflake', // Moderate snow
                1222: 'fa-snowflake', // Patchy heavy snow
                1225: 'fa-snowflake', // Heavy snow
                1237: 'fa-snowflake', // Ice pellets
                1240: 'fa-cloud-rain', // Light rain shower
                1243: 'fa-cloud-showers-heavy', // Moderate/heavy rain shower
                1246: 'fa-cloud-showers-heavy', // Torrential rain shower
                1249: 'fa-cloud-rain', // Light sleet showers
                1252: 'fa-cloud-rain', // Moderate/heavy sleet showers
                1255: 'fa-snowflake', // Light snow showers
                1258: 'fa-snowflake', // Moderate/heavy snow showers
                1261: 'fa-snowflake', // Light showers of ice pellets
                1264: 'fa-snowflake', // Moderate/heavy showers of ice pellets
                1273: 'fa-bolt', // Patchy light rain with thunder
                1276: 'fa-bolt', // Moderate/heavy rain with thunder
                1279: 'fa-bolt', // Patchy light snow with thunder
                1282: 'fa-bolt' // Moderate/heavy snow with thunder
            };

            return iconMap[code] || 'fa-cloud'; // Default to cloud if code not found
        }
    }

    // Initialize weather widget when page loads
    new WeatherWidget();

    // Tour booking functionality
    const bookButtons = document.querySelectorAll('.book-button');
    bookButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tourName = this.closest('.tour-option')?.querySelector('h4')?.textContent || 'Selected tour';
            // Show booking modal or redirect to booking system
            alert(`Booking system for ${tourName} coming soon!`);
        });
    });

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