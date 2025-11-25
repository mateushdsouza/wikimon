document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("pokemonDetail");

  const params = new URLSearchParams(window.location.search);
  const idParam = params.get("id");
  const nameParam = params.get("name");

  if (!idParam && !nameParam) {
    container.innerHTML = "<p>Selecione um Pokémon para ver os detalhes.</p>";
    return;
  }

  const endpoint = `https://pokeapi.co/api/v2/pokemon/${idParam || nameParam}`;

  fetch(endpoint)
    .then((res) => {
      if (!res.ok) throw new Error("Pokémon não encontrado");
      return res.json();
    })
    .then((data) => {
      const artwork =
        data.sprites?.other?.["official-artwork"]?.front_default ||
        data.sprites?.front_default || "";

      const tipos = (data.types || [])
        .map((t) => t.type.name.toUpperCase())
        .join(", ");

      const habilidades = (data.abilities || [])
        .map((a) => a.ability.name.toUpperCase())
        .join(", ");

      const stats = (data.stats || [])
        .map((s) => `${s.stat.name.toUpperCase()}: ${s.base_stat}`)
        .join("<br>");

      container.innerHTML = `
        <div class="detail-wrapper">
          <div class="pokemon-card pokemon-detail-card">
            <div class="pokemon-image">
              ${artwork ? `<img src="${artwork}" alt="${data.name}">` : ""}
            </div>

            <h2>${data.name.toUpperCase()} #${data.id}</h2>

            <p><b>Tipo(s):</b> ${tipos}</p>
            <p><b>Altura:</b> ${(data.height ?? 0) / 10} m</p>
            <p><b>Peso:</b> ${(data.weight ?? 0) / 10} kg</p>
            <p><b>Habilidades:</b> ${habilidades}</p>

            <p class="stats-title">Stats</p>
            <p class="stats">${stats}</p>
          </div>
        </div>
      `;
    })
    .catch((err) => {
      container.innerHTML = `<p style="color:red;">${err.message}</p>`;
    });
});
