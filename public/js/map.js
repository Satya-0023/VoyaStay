let map, marker;
const locationIQKey = mapToken; // NOT a string

function initMap() {
  map = L.map('map').setView([28.6139, 77.2090], 10);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 18
  }).addTo(map);

  geocode();
}
async function geocode() {
  const address = document.getElementById('address').value.trim();
  if (!address) return alert("Please enter a location");

  try {
    const geoRes = await fetch(`https://us1.locationiq.com/v1/search.php?key=${locationIQKey}&q=${encodeURIComponent(address)}&format=json`);
    const geoData = await geoRes.json();

    if (!geoData || !geoData[0]) return alert("Location not found");

    const lat = parseFloat(geoData[0].lat);
    const lon = parseFloat(geoData[0].lon);

    if (marker) marker.remove();

    // Custom colored icon (optional)
    const customIcon = L.icon({
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/484/484167.png', // or your own
      iconSize: [30, 40],
      iconAnchor: [15, 40],
      popupAnchor: [0, -35]
    });

    marker = L.marker([lat, lon], { icon: customIcon })
      .addTo(map)
      .bindPopup(`<strong>📍 ${address}</strong>`)
      .openPopup();

    map.setView([lat, lon], 11);

    // Fix Leaflet map size after re-render (if inside hidden container initially)
    setTimeout(() => map.invalidateSize(), 300);
  } catch (err) {
    console.error('Geocoding failed:', err);
    alert('Error fetching location data');
  }
}



document.addEventListener("DOMContentLoaded", initMap);
