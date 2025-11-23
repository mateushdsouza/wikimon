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
              <div class="pokemon-image">
                <img src="${staticImg}" alt="${data.name}" class="static">
                <img src="${animatedImg || staticImg}" alt="${data.name}" class="animated">
              </div>

              <h3>${data.name.toUpperCase()}</h3>

              <div class="btn-group">
                <button class="details-btn" data-name="${data.name}">Detalhes</button>

                <button class="favorite-btn" data-name="${data.name}">
                  ${favoritos.includes(data.id) ? "★" : "☆"}
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
      ativarDetalhes();
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
        botao.textContent = "☆"; // muda estrela
      } else {
        // adiciona
        loggedUser.favoritos.push(data.id);
        botao.textContent = "★"; // muda estrela
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

function ativarDetalhes() {
  document.querySelectorAll(".details-btn").forEach(btn => {
    btn.onclick = () => {
      const nome = btn.getAttribute("data-name");

      fetch(`https://pokeapi.co/api/v2/pokemon/${nome}`)
        .then(res => res.json())
        .then(data => {

          const tipos = data.types
            .map(t => t.type.name.toUpperCase())
            .join(", ");

          const habilidades = data.abilities
            .map(a => a.ability.name.toUpperCase())
            .join(", ");

          const stats = data.stats
            .map(s => `${s.stat.name.toUpperCase()}: ${s.base_stat}`)
            .join("<br>");

          document.getElementById("modalInfo").innerHTML = `
            <h2>${data.name.toUpperCase()}</h2>
            <img src="${data.sprites.other['official-artwork'].front_default}"
                 width="150">

            <p><b>Tipo(s):</b> ${tipos}</p>
            <p><b>Altura:</b> ${data.height / 10} m</p>
            <p><b>Peso:</b> ${data.weight / 10} kg</p>

            <p><b>Habilidades:</b><br>${habilidades}</p>

            <p><b>Stats:</b><br>${stats}</p>
          `;

          document.getElementById("modal").style.display = "flex";
        });
    };
  });

  document.getElementById("closeModal").onclick = () => {
    document.getElementById("modal").style.display = "none";
  };
}


// ---------------- LOAD MORE ---------------- //

document.getElementById('loadMoreBtn').addEventListener('click', function () {
  fim += 10;
  listar();
});


