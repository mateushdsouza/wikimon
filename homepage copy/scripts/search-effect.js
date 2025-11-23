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

  // ==============================
  // 🔍 ATIVA A BUSCA COM ENTER
  // ==============================
  searchInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      buscarPokemonGenerico("searchInput", "resultadoId");
    }
  });
});

// ==============================
// FUNÇÃO DE BUSCA
// ==============================
function buscarPokemonGenerico(searchInput, resultadoId) {
  const nome = document.getElementById(searchInput).value.toLowerCase();
  const url = `https://pokeapi.co/api/v2/pokemon/${nome}/`;

  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error("Pokémon não encontrado!");
      return res.json();
    })
    .then(data => {
      document.getElementById(resultadoId).innerHTML = `
        <div class="pokemon-comp">
          <h2>${data.name.toUpperCase()}</h2> 
          <img src="${data.sprites.other['official-artwork'].front_default}" alt="${data.name}">
          <p><b>Altura:</b> ${data.height}</p>
          <p><b>Peso:</b> ${data.weight}</p>
          <p><b>Habilidades:</b> ${data.abilities.map(a => a.ability.name).join(", ")}</p>
        </div>
      `;
    })
    .catch(err => {
      document.getElementById(resultadoId).innerHTML = `<p style="color:red;">${err.message}</p>`;
    });
}
