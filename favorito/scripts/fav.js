function mostrarFavoritos() {
  const listaDiv = document.getElementById("lista");
  listaDiv.innerHTML = "";

  let loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
  let favoritos = loggedUser?.favoritos || [];

  if (favoritos.length === 0) {
    listaDiv.innerHTML = "<p>Você ainda não tem favoritos.</p>";
    return;
  }

  const promises = favoritos.map(id => {
    return fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
      .then(res => res.json());
  });

  Promise.all(promises)
    .then(pokemons => {
      pokemons.forEach(data => {
        const favStar = isFavorito(data.id) ? '★' : '☆';
        const favLabel = isFavorito(data.id) ? 'FAVORITO' : 'FAVORITAR';
        listaDiv.innerHTML += `
          <div class="pokemon-card">  
            <a class="pokemon-card-link" href="../detailPage/detailPage.html?id=${data.id}">
              <h2>${data.name.toUpperCase()}</h2>
              <img src="${data.sprites.front_default}" alt="${data.name}">
            </a>

            <button class="favorite-btn" data-id="${data.id}" aria-label="Favoritar ${data.name}">
              <span class="star">${favStar}</span>
              <span class="fav-label">${favLabel}</span>
            </button>
          </div>
        `;
      });
      ativarFavoritar();
    });
}

window.onload = mostrarFavoritos;

// Favoritos helpers
function getLoggedUser() {
  return JSON.parse(localStorage.getItem('loggedUser'));
}
function isFavorito(id) {
  const user = getLoggedUser();
  const favs = user?.favoritos || [];
  return favs.includes(id);
}
function toggleFavorito(id, button) {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  let user = getLoggedUser();
  if (!user) return;
  if (!Array.isArray(user.favoritos)) user.favoritos = [];
  const jaFav = user.favoritos.includes(id);
  if (jaFav) {
    user.favoritos = user.favoritos.filter(f => f !== id);
  } else {
    user.favoritos.push(id);
  }
  const star = button.querySelector('.star');
  const label = button.querySelector('.fav-label');
  if (star) star.textContent = jaFav ? '☆' : '★';
  if (label) label.textContent = jaFav ? 'FAVORITAR' : 'FAVORITO';
  const updatedUsers = users.map(u => u.username === user.username ? user : u);
  localStorage.setItem('loggedUser', JSON.stringify(user));
  localStorage.setItem('users', JSON.stringify(updatedUsers));
  // Atualiza a listagem para refletir remoção
  mostrarFavoritos();
}

function ativarFavoritar() {
  document.querySelectorAll('.favorite-btn').forEach(btn => {
    btn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const id = Number(btn.getAttribute('data-id'));
      toggleFavorito(id, btn);
    };
  });
}

