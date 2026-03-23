document.addEventListener("DOMContentLoaded", renderGallery);

function renderGallery() {
  const container = document.getElementById("galleryContainer");
  if (!container) return;

  const places = Storage.getPlaces();

  if (places.length === 0) {
    container.innerHTML = `
      <div class="col-12">
        <div class="alert alert-secondary text-center p-4">
          <h4 class="h5 mb-3">Wciąż tu pusto...</h4>
          <p class="mb-0">Brak zapisanych miejsc. Dodaj pierwsze zdjęcie nastronie głównej</p>
        </div>
      </div>
    `;
    return;
  }

  container.innerHTML = places
    .slice()
    .reverse()
    .map((place) => {
      return `
        <div class="col-12 col-md-6 col-lg-4">
          <div class="card place-card shadow-sm h-100">
            <img src="${place.photoDataUrl}" class="card-img-top" alt="${escapeHtml(place.title)}">
            <div class="card-body d-flex flex-column">
              <h2 class="h5">${escapeHtml(place.title)}</h2>
              <p class="small-coords mb-2">
                GPS: ${place.latitude.toFixed(5)}, ${place.longitude.toFixed(5)}
              </p>
              <p class="text-muted">${new Date(place.createdAt).toLocaleString("pl-PL")}</p>
              
              <div class="mt-auto d-flex gap-2">
                <button class="btn btn-outline-primary flex-grow-1" onclick="sharePlaceById('${place.id}')">
                  Udostępnij
                </button>
                <button class="btn btn-outline-danger flex-grow-1" onclick="deletePlaceHandler('${place.id}')">
                  Usuń
                </button>
              </div>

            </div>
          </div>
        </div>
      `;
    })
    .join("");
}

window.deletePlaceHandler = function(id) {
  if (confirm("Czy na pewno chcesz trwale usunąć to miejsce?")) {
    Storage.deletePlace(id);
    
    if ("vibrate" in navigator) {
      navigator.vibrate(50);
    }
    
    renderGallery();
  }
};

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}