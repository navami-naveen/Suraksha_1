let map;
let safeZones = [];
let trackingStarted = false;

// Initialize Map
navigator.geolocation.getCurrentPosition(position => {

    const lat = position.coords.latitude;
    const lng = position.coords.longitude;

    map = L.map('map').setView([lat, lng], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(map);

    L.marker([lat, lng]).addTo(map)
        .bindPopup("Current Location")
        .openPopup();
});

// 🔎 Search Place
async function searchPlace() {

    const query = document.getElementById("searchInput").value;
    if(!query) return;

    const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}`
    );

    const data = await response.json();

    if(data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);

        map.setView([lat, lon], 15);

        L.marker([lat, lon]).addTo(map)
            .bindPopup("Search Result")
            .openPopup();
    } else {
        alert("Place not found");
    }
}

// Add Safe Zone
function enableZone() {

    alert("Tap on map to place safe zone");

    map.once("click", function(e) {

        const zone = {
            lat: e.latlng.lat,
            lng: e.latlng.lng,
            radius: 200
        };

        safeZones.push(zone);

        L.circle([zone.lat, zone.lng], {
            color:'green',
            fillColor:'#0f0',
            fillOpacity:0.3,
            radius:zone.radius
        }).addTo(map);

        alert("Safe zone added");
    });
}

// Distance Calculator
function getDistance(lat1, lon1, lat2, lon2) {

    const R = 6371e3;
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
}

// Start Tracking
function startTracking() {

    if(trackingStarted) return;
    trackingStarted = true;

    alert("Tracking Started");

    setInterval(() => {

        navigator.geolocation.getCurrentPosition(async position => {

            const lat = position.coords.latitude;
            const lng = position.coords.longitude;

            let inside = false;

            for(let zone of safeZones) {

                const distance = getDistance(lat, lng, zone.lat, zone.lng);

                if(distance <= zone.radius) {
                    inside = true;
                    break;
                }
            }

            if(!inside && safeZones.length > 0) {

                await fetch("/send-alert", {
                    method:"POST",
                    headers:{ "Content-Type":"application/json" },
                    body: JSON.stringify({
                        latitude: lat,
                        longitude: lng
                    })
                });

                alert("⚠ Outside safe zone! Alert sent.");
            }

        });

    }, 60000); // 1 minute
}