document.addEventListener("DOMContentLoaded", function () {
  const accountToggle = document.getElementById("accountToggle");
  const accountMenu = document.getElementById("accountMenu");
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));

  // MONTA O MENU DEPENDENDO DO LOGIN
  if (loggedUser) {
    accountMenu.innerHTML = `
      <a href="../profilepage/profile.html">Perfil (${loggedUser.username})</a>
      <a href="#" id="logoutLink">Sair</a>
    `;

    // agora que o elemento existe, podemos pegar ele
    const logoutLink = document.getElementById("logoutLink");
    logoutLink.addEventListener("click", function (e) {
      e.preventDefault();
      localStorage.removeItem("loggedUser");
      window.location.href = "../homepage/index.html";
    });
  } else {
    accountMenu.innerHTML = `
      <a href="../loginpage/login.html">Entrar</a>
      <a href="../registerpage/register.html">Criar conta</a>
    `;
  }

  // FUNÇÕES DE ABRIR/FECHAR
  function closeMenu() {
    accountMenu.classList.remove("open");
    accountToggle.setAttribute("aria-expanded", "false");
  }

  function openMenu() {
    accountMenu.classList.add("open");
    accountToggle.setAttribute("aria-expanded", "true");
  }

  // Toggle do botão
  accountToggle.addEventListener("click", function (e) {
    e.stopPropagation();
    accountMenu.classList.contains("open") ? closeMenu() : openMenu();
  });

  // Fecha ao clicar fora
  document.addEventListener("click", function (e) {
    if (!accountMenu.contains(e.target) && e.target !== accountToggle) {
      closeMenu();
    }
  });

  // Fecha com ESC
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });

  closeMenu(); // garante que inicia fechado
});
