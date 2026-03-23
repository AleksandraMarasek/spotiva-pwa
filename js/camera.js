let selectedPhotoDataUrl = "";
let selectedPhotoFile = null;
let webcamStream = null;

const photoInput   = document.getElementById("photoInput");
const photoPreview = document.getElementById("photoPreview");
const openCamBtn   = document.getElementById("openCamBtn");
const camModal     = document.getElementById("cam-modal");
const camVideo     = document.getElementById("cam-video");
const camCapture   = document.getElementById("cam-capture");
const camSwitch    = document.getElementById("cam-switch");
const camClose     = document.getElementById("cam-close");
const camCanvas    = document.getElementById("cam-canvas");

let facingMode = "user"; 

if (photoInput) {
  photoInput.addEventListener("change", handlePhotoChange);
}

function handlePhotoChange(event) {
  const file = event.target.files?.[0];

  if (!file) {
    selectedPhotoDataUrl = "";
    selectedPhotoFile = null;
    setPreview(null);
    return;
  }

  if (!file.type.startsWith("image/")) {
    alert("Wybierz poprawny plik graficzny.");
    return;
  }

  selectedPhotoFile = file;

  const reader = new FileReader();
  reader.onload = (e) => {
    selectedPhotoDataUrl = e.target.result;
    setPreview(selectedPhotoDataUrl);
  };
  reader.readAsDataURL(file);
}


if (openCamBtn) {
  openCamBtn.addEventListener("click", openCamera);
}

if (camClose) {
  camClose.addEventListener("click", closeCamera);
}

if (camSwitch) {
  camSwitch.addEventListener("click", switchCamera);
}

if (camCapture) {
  camCapture.addEventListener("click", capturePhoto);
}

if (camModal) {
  camModal.addEventListener("click", (e) => {
    if (e.target === camModal) closeCamera();
  });
}

async function openCamera() {
  if (!navigator.mediaDevices?.getUserMedia) {
    alert("Twoja przeglądarka nie obsługuje dostępu do kamery.");
    return;
  }

  try {
    webcamStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode, width: { ideal: 1920 }, height: { ideal: 1080 } },
      audio: false,
    });

    camVideo.srcObject = webcamStream;
    await camVideo.play();

    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter((d) => d.kind === "videoinput");
    camSwitch.style.display = videoDevices.length > 1 ? "flex" : "none";

    camModal.classList.add("cam-visible");
  } catch (err) {
    if (err.name === "NotAllowedError") {
      alert("Odmówiono dostępu do kamery. Zezwól na kamerę w ustawieniach przeglądarki.");
    } else if (err.name === "NotFoundError") {
      alert("Nie znaleziono kamery na tym urządzeniu.");
    } else {
      alert("Nie można uruchomić kamery: " + err.message);
    }
  }
}

function closeCamera() {
  if (webcamStream) {
    webcamStream.getTracks().forEach((t) => t.stop());
    webcamStream = null;
  }
  camVideo.srcObject = null;
  camModal.classList.remove("cam-visible");
}

async function switchCamera() {
  facingMode = facingMode === "user" ? "environment" : "user";
  closeCamera();
  await openCamera();
}

function capturePhoto() {
  if (!camVideo.videoWidth) return;

  camCanvas.width  = camVideo.videoWidth;
  camCanvas.height = camVideo.videoHeight;

  const ctx = camCanvas.getContext("2d");

  if (facingMode === "user") {
    ctx.translate(camCanvas.width, 0);
    ctx.scale(-1, 1);
  }

  ctx.drawImage(camVideo, 0, 0);

  selectedPhotoDataUrl = camCanvas.toDataURL("image/jpeg", 0.92);

  camCanvas.toBlob((blob) => {
    selectedPhotoFile = new File([blob], "zdjecie-kamera.jpg", { type: "image/jpeg" });
  }, "image/jpeg", 0.92);

  setPreview(selectedPhotoDataUrl);

  if (photoInput) photoInput.value = "";

  closeCamera();
}

function setPreview(src) {
  if (!photoPreview) return;
  if (src) {
    photoPreview.src = src;
    photoPreview.classList.remove("d-none");
  } else {
    photoPreview.src = "";
    photoPreview.classList.add("d-none");
  }
}

function getSelectedPhotoDataUrl() {
  return selectedPhotoDataUrl;
}

function getSelectedPhotoFile() {
  return selectedPhotoFile;
}