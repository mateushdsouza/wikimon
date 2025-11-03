let inicio = 1;
let fim = 10;

function listar() {
  const listaDiv = document.getElementById('pokemonList');
  listaDiv.innerHTML = ''; // limpa antes de adicionar novos

  const promises = []; // declara o array de promessas

  for (let i = inicio; i <= fim; i++) {
    const url = `https://pokeapi.co/api/v2/pokemon/${i}`;

    promises.push(
      fetch(url)
        .then(res => {
          if (!res.ok) throw new Error('Pokemon não encontrado');
          return res.json(); // precisa retornar o JSON!
        })
        .then(data => {
          let sprite = data.sprites.other["official-artwork"].front_default;
          if (data.sprites.versions["generation-v"]["black-white"].animated.front_default) {
            sprite = data.sprites.versions["generation-v"]["black-white"].animated.front_default;
          }

          return `
            <div class="pokemon-card">
              <img src="${sprite}" alt="${data.name}" />
              <h3>${data.name.toUpperCase()}</h3>
              <button class="favorite-btn" data-name="${data.name}">&#9733;</button>
            </div>
          `;
        })
    );
  }

  // Espera todas as promessas e insere no HTML
  Promise.all(promises)
    .then(results => {
      listaDiv.innerHTML = results.join('');
    })
    .catch(error => console.error(error));
}

window.onload = function () {
  listar();
};

document.getElementById('loadMoreBtn').addEventListener('click', function () {
  fim += 10;
  listar();
});
