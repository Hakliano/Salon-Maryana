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
