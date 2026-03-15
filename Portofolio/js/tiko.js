// tiko.js

(() => {

  function sendToIframe(iframe, method) {
    if (!iframe || !iframe.contentWindow) return;
    iframe.contentWindow.postMessage(
      JSON.stringify({ method }),
      'https://player.vimeo.com'
    );
  }

  // toate iframe-urile background din carduri
  function getAllBackgrounds() {
    return [...document.querySelectorAll('.tiko-carousel-viewport iframe')];
  }

  function pauseAllBackgrounds() {
    getAllBackgrounds().forEach(iframe => sendToIframe(iframe, 'pause'));
  }

  function playAllBackgrounds() {
    getAllBackgrounds().forEach(iframe => sendToIframe(iframe, 'play'));
  }

  // înregistrează evenimente pe video-ul principal (FILM)
  const mainVideo = document.querySelector('.tiko-video-wrap iframe');
  if (mainVideo) {
    mainVideo.addEventListener('load', () => {
      ['play', 'pause', 'finish'].forEach(event => {
        mainVideo.contentWindow.postMessage(
          JSON.stringify({ method: 'addEventListener', value: event }),
          'https://player.vimeo.com'
        );
      });
    });
  }

  // ascultă evenimente de la Vimeo
  window.addEventListener('message', e => {
    if (e.origin !== 'https://player.vimeo.com') return;

    try {
      const data = JSON.parse(e.data);

      // verifică dacă mesajul vine de la video-ul principal
      if (!mainVideo || mainVideo.contentWindow !== e.source) return;

      if (data.event === 'play') {
        pauseAllBackgrounds();
      }

      if (data.event === 'pause' || data.event === 'finish') {
        setTimeout(playAllBackgrounds, 150);
      }

    } catch (err) {}
  });

})();