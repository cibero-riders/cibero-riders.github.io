document.querySelectorAll('[data-reveal]').forEach(stack => {
  const items = [...stack.querySelectorAll('.reveal-item')];
  const button = stack.querySelector('.reveal-next');
  let visible = 1;

  button.addEventListener('click', () => {
    if (visible >= items.length) return;
    items[visible].classList.add('visible');
    visible += 1;

    if (visible === items.length) {
      button.innerHTML = 'Am citit toate punctele <span>✓</span>';
      button.classList.add('done');
    } else if (visible === 2) {
      button.innerHTML = 'Mai departe <span>→</span>';
    }
  });
});
