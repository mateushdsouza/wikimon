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
        listaDiv.innerHTML += `
          <div class="pokemon-card">  
            <h2>${data.name.toUpperCase()}</h2>
            <img src="${data.sprites.front_default}" alt="${data.name}">

            <button class="details-btn" data-name="${data.name}">
              Detalhes
            </button>
          </div>
        `;
      });

      ativarDetalhes();
    });
}

window.onload = mostrarFavoritos;

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

