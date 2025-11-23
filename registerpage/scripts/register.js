const formRegister = document.getElementById("formregister");

formRegister.addEventListener("submit", (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmpassword").value;

    if (password !== confirmPassword) {
        alert("As senhas não coincidem.");
        return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    // impede cadastro de nome repetido
    if (users.some(u => u.username === username)) {
        alert("Esse nome de usuário já está em uso.");
        return;
    }

    users.push({ username, password, favoritos: [] });
    localStorage.setItem("users", JSON.stringify(users));

    alert("Usuário registrado com sucesso!");
    window.location.href = "/loginpage/login.html";

});
