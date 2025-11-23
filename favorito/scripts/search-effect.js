

// Toggle search bar and options/3-dots
document.addEventListener('DOMContentLoaded', function () {
  const searchToggle = document.getElementById('searchToggle');
  const searchInput = document.getElementById('searchInput');
  const options = document.querySelector('.options');
  const optionsToggle = document.getElementById('optionsToggle');

  let searchOpen = false;



  function expandSearch() {
    searchToggle.classList.remove('search-toggle-collapsed');
    searchToggle.classList.add('search-toggle-expanded');
    options.classList.add('options-collapsed');
    optionsToggle.style.display = 'inline-flex';
    searchInput.focus();
    searchOpen = true;
  }

  function collapseSearch() {
    searchToggle.classList.remove('search-toggle-expanded');
    searchToggle.classList.add('search-toggle-collapsed');
    options.classList.remove('options-collapsed');
    optionsToggle.style.display = 'none';
    searchInput.value = '';
    searchOpen = false;
  }

  searchToggle.addEventListener('click', function (e) {
    if (!searchOpen) {
      expandSearch();
      e.stopPropagation();
    }
  });

  optionsToggle.addEventListener('click', function () {
    collapseSearch();
  });

  // ESC to close search
  document.addEventListener('keydown', function (e) {
    if (searchOpen && e.key === 'Escape') {
      collapseSearch();
    }
  });

  // Click outside to close
  document.addEventListener('mousedown', function (e) {
    if (searchOpen && !searchToggle.contains(e.target) && !optionsToggle.contains(e.target)) {
      collapseSearch();
    }
  });
});
