// Minimal JS pro mobilní menu na one-pageru
// Požaduje v HTML: tlačítko s id="burgerBtn" a panel s id="mobilePanel"

(function () {
  const burgerBtn = document.getElementById('burgerBtn');
  const mobilePanel = document.getElementById('mobilePanel');
  const mqDesktop = window.matchMedia('(min-width: 981px)');

  if (!burgerBtn || !mobilePanel) return;

  function openNav() {
    document.body.classList.add('nav-open');
    burgerBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeNav() {
    document.body.classList.remove('nav-open');
    burgerBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  function toggleNav() {
    const isOpen = document.body.classList.contains('nav-open');
    isOpen ? closeNav() : openNav();
  }

  // Klik na burger
  burgerBtn.addEventListener('click', toggleNav);

  // Klik na odkaz v panelu = zavřít
  mobilePanel.addEventListener('click', (e) => {
    if (e.target.matches('a')) closeNav();
  });

  // Zavřít při přechodu na desktop
  mqDesktop.addEventListener('change', (e) => {
    if (e.matches) closeNav();
  });

  // Zavřít ESC
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeNav();
  });
})();
// === Carousel (Galerie) – 3/2/1 snímky na stránku ===
(function () {
  const track   = document.getElementById('galleryTrack');
  const dotsBox = document.getElementById('galleryDots');
  if (!track || !dotsBox) return;

  const slides = Array.from(track.children);
  let page = 0;              // index aktuální "stránky"
  let timer = null;
  const AUTOPLAY_MS = 4500;

  // Kolik snímků je vidět naráz (podle šířky okna)
  function perView() {
    if (window.innerWidth <= 600) return 1;
    if (window.innerWidth <= 900) return 2;
    return 3;
  }

  // Kolik stránek celkem
  function pagesTotal() {
    return Math.max(1, Math.ceil(slides.length / perView()));
  }

  // Vytvoření teček podle počtu stránek
  function buildDots() {
    dotsBox.innerHTML = '';
    const total = pagesTotal();
    for (let i = 0; i < total; i++) {
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', `Strana ${i + 1}`);
      b.addEventListener('click', () => goTo(i, true));
      dotsBox.appendChild(b);
    }
    return Array.from(dotsBox.children);
  }
  let dots = buildDots();

  // Aktualizace posunu + teček
  function update() {
    // Každá stránka = 100 % šířky viewportu
    track.style.transform = `translateX(${-page * 100}%)`;
    dots.forEach((d, i) =>
      d.setAttribute('aria-current', i === page ? 'true' : 'false')
    );
  }

  // Přechod na stránku (s omezením rozsahu)
  function goTo(targetPage, userAction = false) {
    const max = pagesTotal() - 1;
    page = ((targetPage % (max + 1)) + (max + 1)) % (max + 1); // bezpečné modulo
    update();
    if (userAction) restartAutoplay();
  }

  // Šipky
  document.querySelector('.carousel__btn.prev')
    ?.addEventListener('click', () => goTo(page - 1, true));
  document.querySelector('.carousel__btn.next')
    ?.addEventListener('click', () => goTo(page + 1, true));

  // Autoplay
  function startAutoplay() { timer = setInterval(() => goTo(page + 1, false), AUTOPLAY_MS); }
  function stopAutoplay()  { clearInterval(timer); timer = null; }
  function restartAutoplay(){ stopAutoplay(); startAutoplay(); }

  // Pauza při přejetí myší
  track.addEventListener('mouseenter', stopAutoplay);
  track.addEventListener('mouseleave', startAutoplay);

  // Swipe (mobil)
  let startX = 0, dx = 0, touching = false;
  track.addEventListener('touchstart', (e) => {
    touching = true; startX = e.touches[0].clientX; stopAutoplay();
  }, { passive: true });

  track.addEventListener('touchmove', (e) => {
    if (!touching) return;
    dx = e.touches[0].clientX - startX;
  }, { passive: true });

  track.addEventListener('touchend', () => {
    if (Math.abs(dx) > 50) goTo(page + (dx < 0 ? 1 : -1), true);
    dx = 0; touching = false; startAutoplay();
  });

  // Reakce na resize – přestavět tečky, udržet platný index
  window.addEventListener('resize', () => {
    const oldMax = pagesTotal() - 1;
    dots = buildDots();
    if (page > oldMax) page = oldMax;
    update();
  });

  // Init
  update();
  startAutoplay();
})();
