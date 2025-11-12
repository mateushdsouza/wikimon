document.getElementById("compareButton").addEventListener("click", function () {
  const nome1 = document.getElementById("pokemon1").value.toLowerCase();
  const nome2 = document.getElementById("pokemon2").value.toLowerCase();

  compararPokemon(nome1, "comp1");
  compararPokemon(nome2, "comp2");
});

function compararPokemon(nome, resultadoId) {
  const url = `https://pokeapi.co/api/v2/pokemon/${nome}/`;

  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error("Pokémon não encontrado!");
      return res.json();
    })
    .then(data => {

      // acessa os stats (na ordem da API)
      const stats = data.stats.map(s => s.base_stat);
      const total = stats.reduce((a, b) => a + b, 0);

      document.getElementById(resultadoId).innerHTML = `
  <div class="pokemon-comp">
    <img src="${data.sprites.other['official-artwork'].front_default}" alt="${data.name}">
    
    <div class="pokemon-header">
      <h2 class="type-name">${data.name.toUpperCase()}</h2>
      <p class="pokemon-type">
        ${data.types.map(t => identificarTipo(t.type.name)).join(" ")}
      </p>
    </div>

    <div class="pokemon-stats">
      <p><b>HP:</b> ${stats[0]}</p>
      <p><b>Ataque:</b> ${stats[1]}</p>
      <p><b>Defesa:</b> ${stats[2]}</p>
      <p><b>Esp. Ataque:</b> ${stats[3]}</p>
      <p><b>Esp. Defesa:</b> ${stats[4]}</p>
      <p><b>Velocidade:</b> ${stats[5]}</p>
      <p class="total"><b>Total:</b> ${total}</p>
    </div>
  </div>
`;

    })

    .catch(err => {
      document.getElementById(resultadoId).innerHTML = `<p style="color:red;">${err.message}</p>`;
    });
}


function identificarTipo(tipo) {
  const cores = {
    normal: "#A8A77A",
    fire: "#EE8130",
    water: "#6390F0",
    electric: "#F7D02C",
    grass: "#7AC74C",
    ice: "#96D9D6",
    fighting: "#C22E28",
    poison: "#A33EA1",
    ground: "#E2BF65",
    flying: "#A98FF3",
    psychic: "#F95587",
    bug: "#A6B91A",
    rock: "#B6A136",
    ghost: "#735797",
    dragon: "#6F35FC",
    dark: "#705746",
    steel: "#B7B7CE",
    fairy: "#D685AD"
  };

  const cor = cores[tipo] || "#777";
  return `<span class="type" style="background-color:${cor}; color:white; padding:3px 8px; border-radius:12px; font-weight:600; text-transform:capitalize;">${tipo}</span>`;
}
