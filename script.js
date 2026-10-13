(() => {
  const button = document.querySelector('.menu-toggle');
  const links = document.querySelector('.nav-links');
  if (!button || !links) return;

  const closeMenu = () => {
    button.setAttribute('aria-expanded', 'false');
    links.classList.remove('is-open');
  };

  button.addEventListener('click', () => {
    const isOpen = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!isOpen));
    links.classList.toggle('is-open', !isOpen);
  });

  links.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

  window.addEventListener('resize', () => {
    if (window.innerWidth > 980) closeMenu();
  });
})();
