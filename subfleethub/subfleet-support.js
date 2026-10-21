(() => {
  const toggle = document.querySelector('[data-vehicle-toggle]');
  const options = document.getElementById('subfleet-vehicle-options');
  if (!toggle || !options) return;

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    options.hidden = expanded;
  });
})();
