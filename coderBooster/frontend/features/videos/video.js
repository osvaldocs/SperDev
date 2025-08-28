export function initVideoPlayer() {
  try {
    const videoDataRaw = localStorage.getItem('currentVideo');
    const videoData = videoDataRaw ? JSON.parse(videoDataRaw) : null;
    const placeholder = document.querySelector('.video-placeholder');
    const titleEl = document.getElementById('videoTitle');

    if (!placeholder || !titleEl) {
      console.warn('Elementos del reproductor no encontrados.');
      return;
    }

    if (!videoData?.url) {
      // Si no hay video seleccionado, dejar el placeholder por defecto
      return;
    }

    // Renderizar el video seleccionado
    placeholder.innerHTML = `
      <video src="${videoData.url}" controls class="w-100 rounded" style="max-height: 420px;"></video>
    `;
    titleEl.textContent = videoData.title || 'Video seleccionado';
  } catch (err) {
    console.error('Error inicializando el reproductor:', err);
  }
}


