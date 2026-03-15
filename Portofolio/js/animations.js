// animations.js (SAFE)

(() => {
  // Scroll header effect
  const nav = document.querySelector('.nav');

  window.addEventListener('scroll', () => {
    if (!nav) return;

    const scrollIndicator = document.querySelector('.scroll-indicator');

    if (window.scrollY > 100) {
      nav.classList.add('scrolled');
      if (scrollIndicator) scrollIndicator.style.opacity = '0';
    } else {
      nav.classList.remove('scrolled');
      if (scrollIndicator) scrollIndicator.style.opacity = '1';
    }
  }, { passive: true });

  // Smooth reveal on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe work rows (safe even if none)
  document.querySelectorAll('.work-row').forEach((row, index) => {
    row.style.opacity = '0';
    row.style.transform = 'translateY(30px)';
    row.style.transition = `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1}s`;
    observer.observe(row);
  });

  // Observe about sections
  document.querySelectorAll('.about-left, .about-middle, .about-right').forEach((section, index) => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.2}s`;
    observer.observe(section);
  });

  // Scroll-to-top button (GUARDED)
  const scrollBtn = document.querySelector('.scroll-top');
  if (scrollBtn) {
    scrollBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', () => {
      scrollBtn.style.display = (window.scrollY > 200) ? 'flex' : 'none';
    }, { passive: true });
  }

document.querySelectorAll("[data-carousel]").forEach((carousel) => {
  const track = carousel.querySelector(".tiko-carousel-track");
  const slides = Array.from(track.querySelectorAll("img"));
  const prevBtn = carousel.querySelector(".tiko-carousel-btn.prev");
  const nextBtn = carousel.querySelector(".tiko-carousel-btn.next");

  let index = 0;

  function update() {
    track.style.transform = `translateX(${-index * 100}%)`;
  }

  function goTo(i) {
    const total = slides.length;
    index = (i + total) % total;   // LOOP
    update();
  }

  prevBtn.addEventListener("click", () => goTo(index - 1));
  nextBtn.addEventListener("click", () => goTo(index + 1));

  carousel.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") goTo(index - 1);
    if (e.key === "ArrowRight") goTo(index + 1);
  });

  update();
});

const btn = document.querySelector('.scroll-top');

const toggleScrollTop = () => {
  if (window.scrollY > 400) btn.classList.add('is-visible');
  else btn.classList.remove('is-visible');
};

window.addEventListener('scroll', toggleScrollTop, { passive: true });
toggleScrollTop();

})();


