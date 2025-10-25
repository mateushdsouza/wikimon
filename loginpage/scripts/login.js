// se já estiver logado, manda para home
const alreadyLogged = JSON.parse(localStorage.getItem("loggedUser"));
if (alreadyLogged) {
  window.location.href = "../homepage/index.html";
}

// Registrar o listener quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  const formLogin = document.getElementById("formlogin");
  if (!formLogin) return; // nada a fazer se o formulário não existir

  formLogin.addEventListener("submit", (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const userFound = users.find(
      (u) => u.username === username && u.password === password
    );

    if (userFound) {
      localStorage.setItem("loggedUser", JSON.stringify(userFound));
      alert("Login realizado com sucesso!");
      window.location.href = "../homepage/index.html";
    } else {
      alert("Usuário ou senha incorretos!");
    }
  });
});
