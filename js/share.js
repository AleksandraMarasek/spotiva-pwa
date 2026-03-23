

function dataUrlToFile(dataUrl, baseName) {
  if (!dataUrl || !dataUrl.startsWith('data:')) {
    throw new Error('Nieprawidłowy dataURL');
  }

  const [header, base64] = dataUrl.split(',');

  if (!header || !base64) {
    throw new Error('Nie można sparsować dataURL');
  }

  const mimeMatch = header.match(/data:([^;]+);/);
  if (!mimeMatch) {
    throw new Error('Brak MIME type w dataURL');
  }

  const mime = mimeMatch[1]; 

  const extMap = {
    'image/jpeg': 'jpg',
    'image/jpg':  'jpg',
    'image/png':  'png',
    'image/gif':  'gif',
    'image/webp': 'webp',
    'image/heic': 'heic',
  };
  const ext = extMap[mime] ?? 'jpg';

  const safeName = baseName.replace(/[^\w\s\-]/g, '').trim() || 'zdjecie';
  const filename = `${safeName}.${ext}`;

  let binary;
  try {
    binary = atob(base64);
  } catch {
    throw new Error('Błąd dekodowania base64');
  }

  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return new File([bytes], filename, { type: mime });
}

async function sharePlaceById(id) {
  const place = Storage.getPlaceById(id);
  if (!place) return;

  const mapUrl = `https://www.openstreetmap.org/?mlat=${place.latitude}&mlon=${place.longitude}#map=18/${place.latitude}/${place.longitude}`;
  const text = `Miejsce: ${place.title}\nGPS: ${place.latitude}, ${place.longitude}`;

  if (navigator.share && navigator.canShare) {
    try {
      const imageFile = dataUrlToFile(place.photoDataUrl, place.title);

      const shareDataWithFile = {
        title: place.title,
        text,
        url: mapUrl,
        files: [imageFile],
      };

      if (navigator.canShare(shareDataWithFile)) {
        await navigator.share(shareDataWithFile);
        return;
      }
    } catch (error) {
      if (error.name === 'AbortError') return;
      console.warn('Udostępnianie ze zdjęciem nieudane, próba bez zdjęcia:', error);
    }
  }

  

  if (navigator.share) {
    try {
      await navigator.share({ title: place.title, text, url: mapUrl });
      return;
    } catch (error) {
      if (error.name === 'AbortError') return;
      console.warn('Web Share API nieudane:', error);
    }
  }

  try {
    await navigator.clipboard.writeText(`${text}\n${mapUrl}`);
    alert('Twoja przeglądarka nie obsługuje Web Share API. Skopiowano dane do schowka.');
  } catch {
    alert(`Skopiuj ręcznie:\n${text}\n${mapUrl}`);
  }
}