(() => {
  document.querySelectorAll("[data-exclusive-accordion]").forEach(group => {
    const items = [...group.children].filter(item => item.matches("details"));

    items.forEach(item => {
      item.addEventListener("toggle", () => {
        if (!item.open) return;

        items.forEach(otherItem => {
          if (otherItem !== item && otherItem.open) otherItem.open = false;
        });
      });
    });

    const initiallyOpen = items.filter(item => item.open);
    initiallyOpen.slice(1).forEach(item => { item.open = false; });
  });
})();
