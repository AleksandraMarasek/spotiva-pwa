document.addEventListener("DOMContentLoaded", initMap);

function initMap() {
  const mapElement = document.getElementById("map");
  if (!mapElement) return;

  const places = Storage.getPlaces();

  const map = L.map("map").setView([52.2297, 21.0122], 6);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  if (places.length === 0) return;

  const bounds = [];

  places.forEach((place) => {
    const marker = L.marker([place.latitude, place.longitude]).addTo(map);

    marker.bindPopup(`
      <div style="max-width: 200px;">
        <strong>${escapeHtml(place.title)}</strong><br>
        <img src="${place.photoDataUrl}" alt="${escapeHtml(place.title)}" style="width:100%; margin-top:8px; border-radius:8px;" />
        <div style="margin-top:8px;">
          ${place.latitude.toFixed(5)}, ${place.longitude.toFixed(5)}
        </div>
      </div>
    `);

    bounds.push([place.latitude, place.longitude]);
  });

  if (bounds.length === 1) {
    map.setView(bounds[0], 15);
  } else {
    map.fitBounds(bounds, { padding: [30, 30] });
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}