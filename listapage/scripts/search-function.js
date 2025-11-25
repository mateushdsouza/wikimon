let inicio = 1;
let fim = 16;

// Pega favoritos do usuário logado
let loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
let favoritos = loggedUser?.favoritos || [];


function listar() {
  const listaDiv = document.getElementById('pokemonList');
  listaDiv.innerHTML = '';

  const promises = [];

  for (let i = inicio; i <= fim; i++) {
    const url = `https://pokeapi.co/api/v2/pokemon/${i}`;

    promises.push(
      fetch(url)
        .then(res => {
          if (!res.ok) throw new Error('Pokemon não encontrado');
          return res.json();
        })
        .then(data => {
          const staticImg = data.sprites.front_default;
          const animatedImg = data.sprites.versions["generation-v"]["black-white"].animated.front_default;

          return `
            <div class="pokemon-card">
              <a class="pokemon-card-link" href="../detailPage/detailPage.html?id=${data.id}">
                <div class="pokemon-image">
                  <img src="${staticImg}" alt="${data.name}" class="static">
                  <img src="${animatedImg || staticImg}" alt="${data.name}" class="animated">
                </div>
                <h3>${data.name.toUpperCase()}</h3>
              </a>

              <div class="btn-group">
                <button class="favorite-btn" data-name="${data.name}">
                  <span class="star">${favoritos.includes(data.id) ? "★" : "☆"}</span>
                  <span class="fav-label">${favoritos.includes(data.id) ? "FAVORITO" : "FAVORITAR"}</span>
                </button>
              </div>
            </div>
          `;
        })
    );
  }

  Promise.all(promises)
    .then(cards => {
      listaDiv.innerHTML = cards.join("");
      ativarFavoritar();
    })
    .catch(err => console.error(err));
}

window.onload = listar;

function favoritar(nome, botao) {
  const url = `https://pokeapi.co/api/v2/pokemon/${nome}/`;

  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error("Pokémon não encontrado!");
      return res.json();
    })
    .then(data => {

      let loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
      let users = JSON.parse(localStorage.getItem("users")) || [];

      // Se usuário não tem array de favoritos, cria
      if (!Array.isArray(loggedUser.favoritos)) {
        loggedUser.favoritos = [];
      }

      // Verifica se já está favoritado
      const jaFav = loggedUser.favoritos.includes(data.id);

      if (jaFav) {
        // remove
        loggedUser.favoritos = loggedUser.favoritos.filter(id => id !== data.id);
        const starSpan = botao.querySelector('.star');
        const labelSpan = botao.querySelector('.fav-label');
        if (starSpan) starSpan.textContent = "☆"; else botao.textContent = "☆ FAVORITAR";
        if (labelSpan) labelSpan.textContent = "FAVORITAR";
      } else {
        // adiciona
        loggedUser.favoritos.push(data.id);
        const starSpan = botao.querySelector('.star');
        const labelSpan = botao.querySelector('.fav-label');
        if (starSpan) starSpan.textContent = "★"; else botao.textContent = "★ FAVORITO";
        if (labelSpan) labelSpan.textContent = "FAVORITO";
      }

      // Atualiza lista geral de usuários
      users = users.map(u =>
        u.username === loggedUser.username ? loggedUser : u
      );

      // Salva tudo
      localStorage.setItem("loggedUser", JSON.stringify(loggedUser));
      localStorage.setItem("users", JSON.stringify(users));

      // Mensagem
      document.getElementById("mensagem").innerText =
        `${data.name.toUpperCase()} ${jaFav ? "removido" : "adicionado"} dos favoritos!`;
    })
    .catch(err => {
      console.error(err);
      document.getElementById("mensagem").innerText = "Erro ao favoritar.";
    });
}
function ativarFavoritar() {
  document.querySelectorAll(".favorite-btn").forEach(btn => {
    btn.onclick = () => {
      const nome = btn.getAttribute("data-name");
      favoritar(nome, btn);
    };
  });
}



// ---------------- DETALHES ---------------- //

// Detalhes via modal removidos — navegação acontece pelo link do card


// ---------------- LOAD MORE ---------------- //

document.getElementById('loadMoreBtn').addEventListener('click', function () {
  fim += 10;
  listar();
});


