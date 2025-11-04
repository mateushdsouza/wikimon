let inicio = 1;
let fim = 16;

function listar() {
  const listaDiv = document.getElementById('pokemonList');
  listaDiv.innerHTML = ''; // limpa antes de adicionar novos

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
          // imagem estática (oficial)
          const staticImg = data.sprites.front_default;

          // sprite animado (se existir)
          const animatedImg = data.sprites.versions["generation-v"]["black-white"].animated.front_default;

          return `
            <div class="pokemon-card">
              <div class="pokemon-image">
                <img src="${staticImg}" alt="${data.name}" class="static">
                <img src="${animatedImg || staticImg}" alt="${data.name}" class="animated">
              </div>
              <h3>${data.name.toUpperCase()}</h3>
              <div class="btn-group">
                <button class="details-btn">Detalhes</button>
                <button class="favorite-btn">&#9733;</button>
              </div>
            </div>
          `;
        })
    );
  }

  Promise.all(promises)
    .then(results => {
      listaDiv.innerHTML = results.join('');
    })
    .catch(error => console.error(error));
}

window.onload = listar;

document.getElementById('loadMoreBtn').addEventListener('click', function () {
  fim += 10;
  listar();
});
