// multimedia.js

(() => {

  function sendToIframe(iframe, method) {
    iframe.contentWindow.postMessage(
      JSON.stringify({ method }),
      'https://player.vimeo.com'
    );
  }

  function pauseAllBackgrounds() {
    document.querySelectorAll(
      '.carousel-slide:not(.has-controls) iframe, .carousel-track > iframe'
    ).forEach(iframe => sendToIframe(iframe, 'pause'));
  }

  function playAllBackgrounds() {
    document.querySelectorAll(
      '.carousel-slide:not(.has-controls) iframe, .carousel-track > iframe'
    ).forEach(iframe => sendToIframe(iframe, 'play'));
  }

  // ---------- CAROUSEL ----------
  document.querySelectorAll('.card-carousel').forEach(carousel => {
    const track = carousel.querySelector('.carousel-track');
    const slides = Array.from(track.children);
    const prev = carousel.querySelector('.prev');
    const next = carousel.querySelector('.next');

    let index = 0;

    function goToSlide(i) {
      index = (i + slides.length) % slides.length;
      track.style.transform = `translateX(-${index * 100}%)`;

      // dacă ajungem pe un slide background, pornim toate background-urile
      const currentSlide = slides[index];
      if (!currentSlide.classList || !currentSlide.classList.contains('has-controls')) {
        setTimeout(playAllBackgrounds, 150);
      }
    }

    next.addEventListener('click', () => goToSlide(index + 1));
    prev.addEventListener('click', () => goToSlide(index - 1));

    // înregistrează evenimente pe iframe-urile cu controale
    slides.forEach(slide => {
      if (!slide.classList || !slide.classList.contains('has-controls')) return;
      const iframe = slide.querySelector('iframe');
      if (!iframe) return;

      iframe.addEventListener('load', () => {
        // înregistrează play, pause, finish
        ['play', 'pause', 'finish'].forEach(event => {
          iframe.contentWindow.postMessage(
            JSON.stringify({ method: 'addEventListener', value: event }),
            'https://player.vimeo.com'
          );
        });
      });
    });
  });

  // ---------- VIMEO EVENTS ----------
  window.addEventListener('message', e => {
    if (e.origin !== 'https://player.vimeo.com') return;

    try {
      const data = JSON.parse(e.data);

      // verifică dacă mesajul vine de la un iframe cu controale
      const sender = [...document.querySelectorAll('.has-controls iframe')]
        .find(f => f.contentWindow === e.source);
      if (!sender) return;

      if (data.event === 'play') {
        // utilizatorul a apăsat play — pauzează toate background-urile
        pauseAllBackgrounds();
      }

      if (data.event === 'pause' || data.event === 'finish') {
        // utilizatorul a apăsat pause sau video s-a terminat
        // pornește toate background-urile
        setTimeout(playAllBackgrounds, 150);

        // dacă s-a terminat, mergi la slide-ul următor
        if (data.event === 'finish') {
          document.querySelectorAll('.card-carousel').forEach(carousel => {
            const track = carousel.querySelector('.carousel-track');
            const slides = Array.from(track.children);
            const currentSlide = sender.closest('.carousel-slide');
            if (!currentSlide) return;

            const currentIndex = slides.indexOf(currentSlide);
            if (currentIndex === -1) return;

            const nextIndex = (currentIndex + 1) % slides.length;
            track.style.transform = `translateX(-${nextIndex * 100}%)`;
            setTimeout(playAllBackgrounds, 150);
          });
        }
      }

    } catch (err) {}
  });

})();