document.addEventListener('DOMContentLoaded', function () {
  const select = document.getElementById('talk-order-select');
  const listContainer = document.getElementById('talks-list');
  if (!select || !listContainer) return;

  // Helper to parse ISO date string; returns timestamp or NaN
  function parseDateAttr(el, attr) {
    const v = el.getAttribute(attr);
    return v ? Date.parse(v) : NaN;
  }

  function getItems() {
    // articles are descendants with class .archive__item
    return Array.from(listContainer.querySelectorAll('.archive__item'));
  }

  function sortItems(mode) {
    const items = getItems();
    let comparator;
    switch (mode) {
      case 'post-date-desc':
        comparator = (a, b) => parseDateAttr(b, 'data-post-date') - parseDateAttr(a, 'data-post-date');
        break;
      case 'post-date-asc':
        comparator = (a, b) => parseDateAttr(a, 'data-post-date') - parseDateAttr(b, 'data-post-date');
        break;
      case 'venue-date-desc':
        comparator = (a, b) => parseDateAttr(b, 'data-latest-venue-date') - parseDateAttr(a, 'data-latest-venue-date');
        break;
      case 'venue-date-asc':
        comparator = (a, b) => parseDateAttr(a, 'data-latest-venue-date') - parseDateAttr(b, 'data-latest-venue-date');
        break;
      default:
        comparator = (a, b) => 0;
    }

    items.sort(comparator);

    // Re-attach items in the new order. Each `.archive__item` is inside a wrapper `.list__item` div.
    items.forEach(item => {
      const wrapper = item.closest('.list__item');
      if (wrapper) listContainer.appendChild(wrapper);
      else listContainer.appendChild(item);
    });

    // persist choice
    try { localStorage.setItem('talks_sort_mode', mode); } catch (e) { /* ignore */ }
  }

  // initialize select from localStorage
  const saved = localStorage.getItem('talks_sort_mode');
  if (saved) select.value = saved;
  sortItems(select.value);

  select.addEventListener('change', function () {
    sortItems(this.value);
  });
});
