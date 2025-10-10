document.addEventListener('DOMContentLoaded', function () {
  const accountToggle = document.getElementById('accountToggle');
  const accountMenu = document.getElementById('accountMenu');

  function closeMenu() {
    accountMenu.classList.remove('open');
    accountToggle.setAttribute('aria-expanded', 'false');
  }

  function openMenu() {
    accountMenu.classList.add('open');
    accountToggle.setAttribute('aria-expanded', 'true');
  }

  accountToggle.addEventListener('click', function (e) {
    e.stopPropagation();
    if (accountMenu.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  document.addEventListener('click', function (e) {
    if (!accountMenu.contains(e.target) && e.target !== accountToggle) {
      closeMenu();
    }
  });

  // Optional: Close dropdown on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeMenu();
    }
  });

  closeMenu();
});
