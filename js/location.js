let currentCoords = null;

const getLocationBtn = document.getElementById("getLocationBtn");
const locationStatus = document.getElementById("locationStatus");

if (getLocationBtn) {
  getLocationBtn.addEventListener("click", getCurrentLocation);
}

function getCurrentLocation() {
  if (!navigator.geolocation) {
    showLocationMessage("Geolokalizacja nie jest wspierana przez tę przeglądarkę.", "danger");
    return;
  }

  showLocationMessage("Pobieranie lokalizacji...", "secondary");

  navigator.geolocation.getCurrentPosition(
    (position) => {
      currentCoords = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };

      showLocationMessage(
        `Pobrano lokalizację: ${currentCoords.latitude.toFixed(5)}, ${currentCoords.longitude.toFixed(5)}`,
        "success"
      );
    },
    (error) => {
      let message = "Nie udało się pobrać lokalizacji.";
      if (error.code === 1) message = "Odmówiono dostępu do lokalizacji.";
      if (error.code === 2) message = "Pozycja jest niedostępna.";
      if (error.code === 3) message = "Przekroczono czas oczekiwania na lokalizację.";

      showLocationMessage(message, "danger");
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    }
  );
}

function getCurrentCoords() {
  return currentCoords;
}

function showLocationMessage(text, type) {
  if (!locationStatus) return;
  locationStatus.className = `alert alert-${type}`;
  locationStatus.textContent = text;
}