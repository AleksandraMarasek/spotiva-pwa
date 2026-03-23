const savePlaceBtn = document.getElementById("savePlaceBtn");
const titleInput = document.getElementById("titleInput");
const formMessage = document.getElementById("formMessage");

if (savePlaceBtn) {
  savePlaceBtn.addEventListener("click", savePlace);
}

function savePlace() {
  const title = titleInput.value.trim();
  const photoDataUrl = getSelectedPhotoDataUrl();
  const coords = getCurrentCoords();

  if (!title) {
    showFormMessage("Podaj nazwę miejsca", "danger");
    return;
  }

  if (!photoDataUrl) {
    showFormMessage("Najpierw zrób zdjęcie miejsca", "danger");
    return;
  }

  if (!coords) {
    showFormMessage("Najpierw pobierz lokalizację GPS", "danger");
    return;
  }

  const place = {
    id: crypto.randomUUID(),
    title,
    photoDataUrl,
    latitude: coords.latitude,
    longitude: coords.longitude,
    createdAt: new Date().toISOString(),
  };

  try {
    Storage.savePlace(place);

    showFormMessage("Miejsce zostało pomyślnie zapisane!", "success");

    if ("vibrate" in navigator) {
      navigator.vibrate([100, 50, 100]); 
    }

    titleInput.value = "";
    document.getElementById("photoInput").value = "";
    document.getElementById("photoPreview").src = "";
    document.getElementById("photoPreview").classList.add("d-none");
    selectedPhotoDataUrl = "";
    selectedPhotoFile = null;
    currentCoords = null;
    showLocationMessage("Lokalizacja nie została jeszcze pobrana.", "secondary");

  } catch (error) {
    if (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED' || error.code === 22) {
      showFormMessage("Błąd: Przekroczono limit pamięci przeglądarki! Usuń stare miejsca w Galerii, aby dodać nowe", "danger");
    } else {
      showFormMessage("Wystąpił nieznany błąd podczas zapisywania", "danger");
      console.error(error);
    }

    if ("vibrate" in navigator) {
      navigator.vibrate([300, 100, 300]); 
    }
  }
}

function showFormMessage(text, type) {
  if (!formMessage) return;
  formMessage.innerHTML = `<div class="alert alert-${type}">${text}</div>`;
}