const banner  = document.getElementById('offline-banner');
const overlay = document.getElementById('map-overlay');

function setOfflineUI(offline) {
  banner.classList.toggle('visible', offline);
  overlay.classList.toggle('visible', offline);
  document.body.classList.toggle('is-offline', offline);
}

setOfflineUI(!navigator.onLine);

window.addEventListener('offline', () => setOfflineUI(true));
window.addEventListener('online',  () => setOfflineUI(false));