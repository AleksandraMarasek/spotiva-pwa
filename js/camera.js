let selectedPhotoDataUrl = "";
let selectedPhotoFile = null;

const photoInput = document.getElementById("photoInput");
const photoPreview = document.getElementById("photoPreview");

if (photoInput) {
  photoInput.addEventListener("change", handlePhotoChange);
}

function handlePhotoChange(event) {
  const file = event.target.files?.[0];

  if (!file) {
    selectedPhotoDataUrl = "";
    selectedPhotoFile = null;
    photoPreview.classList.add("d-none");
    photoPreview.src = "";
    return;
  }

  if (!file.type.startsWith("image/")) {
    alert("Wybierz poprawny plik graficzny.");
    return;
  }

  selectedPhotoFile = file;

  const reader = new FileReader();
  reader.onload = function (e) {
    selectedPhotoDataUrl = e.target.result;
    photoPreview.src = selectedPhotoDataUrl;
    photoPreview.classList.remove("d-none");
  };
  reader.readAsDataURL(file);
}

function getSelectedPhotoDataUrl() {
  return selectedPhotoDataUrl;
}

function getSelectedPhotoFile() {
  return selectedPhotoFile;
}