/**
 * Função utilitária para gerar um <span> HTML estilizado para um tipo de Pokémon.
 * Usa um objeto 'cores' interno para mapear o tipo (string) para a sua cor hexadecimal.
 * @param {string} tipo - O nome do tipo de Pokémon (ex: 'fire', 'water').
 * @returns {string} - O HTML do <span> estilizado.
 */
function identificarTipo(tipo) {
  // Objeto de mapeamento que associa cada tipo de Pokémon a uma cor específica.
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

  // Obtém a cor correspondente ao 'tipo'. Se o tipo não for encontrado, usa "#777" (cinzento padrão).
  const cor = cores[tipo] || "#777";

  // Retorna a string HTML com estilos embutidos para exibição do tipo.
  return `<span class="type" style="background-color:${cor}; color:white; padding:3px 8px; border-radius:12px; font-weight:600; text-transform:capitalize; font-family: Montserrat, sans-serif;">${tipo}</span>`;
}

/**
 * O bloco principal de execução, executado assim que a página HTML for totalmente carregada.
 */
document.addEventListener("DOMContentLoaded", () => {
  // 1. Obter Termo de Pesquisa
  
  // Cria um objeto para analisar os parâmetros de consulta (query parameters) da URL.
  const params = new URLSearchParams(window.location.search);
  // Obtém o valor do parâmetro 'q', remove espaços e converte para minúsculas.
  const q = (params.get("q") || "").trim().toLowerCase();
  // Obtém o elemento HTML onde os resultados da pesquisa serão exibidos.
  const container = document.getElementById("searchResults");

  // Se não houver termo de pesquisa, exibe uma mensagem e para a execução.
  if (!q) {
    container.innerHTML = `<p>Digite um nome para pesquisar.</p>`;
    return;
  }

  // 2. Busca Inicial de Nomes de Pokémon
  
  // URL da API para obter a lista completa de Pokémon (limitada a 2000).
  const listUrl = "https://pokeapi.co/api/v2/pokemon?limit=2000";
  
  // Inicia a busca da lista completa.
  fetch(listUrl)
    .then(res => res.json()) // Converte a resposta para JSON.
    .then(all => {
      // Filtra a lista para obter apenas Pokémon cujos nomes começam com o termo de pesquisa 'q'.
      const results = (all.results || []).filter(p => p.name.startsWith(q));

      // Se nenhum resultado for encontrado, exibe uma mensagem de erro e para.
      if (results.length === 0) {
        container.innerHTML = `<p style="color:red;">Pokémon não existe.</p>`;
        return;
      }

      // 3. Otimização da Ordem dos Resultados
      
      // Verifica se existe uma correspondência exata na lista filtrada.
      const exactIndex = results.findIndex(p => p.name === q);
      
      // Se uma correspondência exata for encontrada, mas não for o primeiro resultado (index > 0):
      if (exactIndex > 0) {
        // Remove a correspondência exata da sua posição original.
        const [exact] = results.splice(exactIndex, 1);
        // Adiciona a correspondência exata ao início da lista (prioridade).
        results.unshift(exact);
      }

      // Limita o número de resultados a serem processados para 20.
      const limited = results.slice(0, 20);
      
      // 4. Busca dos Detalhes de Cada Pokémon
      
      // Cria um array de Promises para buscar os detalhes de cada um dos 20 Pokémon.
      const promises = limited.map(r => fetch(r.url).then(t => t.json()));

      // Espera que todas as Promises (buscas de detalhes) sejam resolvidas.
      Promise.all(promises).then(datas => {
        
        // 5. Geração dos Cartões (Cards)
        
        // Mapeia os dados de detalhes para strings HTML de cartões.
        const cards = datas.map(data => {
          // Obtém a URL da imagem de arte oficial, ou uma alternativa, ou uma string vazia.
          const staticImg = data.sprites?.other?.["official-artwork"]?.front_default || data.sprites?.front_default || "";
          
          // Extrai os nomes dos tipos do objeto de detalhes do Pokémon.
          const tipos = (data.types || []).map(t => t.type.name);
          
          // Converte os nomes dos tipos em strings HTML estilizadas usando identificarTipo().
          const tiposHtml = tipos.map(identificarTipo).join(" ");
          
          // Verifica o estado de favorito e define o caractere da estrela.
          const favStar = isFavorito(data.id) ? '★' : '☆';
          // Define o texto do rótulo do botão de favorito.
          const favLabel = isFavorito(data.id) ? 'FAVORITO' : 'FAVORITAR';
          
          // Retorna a string HTML completa para o cartão do Pokémon.
          return `
            <div class="pokemon-card">
              <a class="pokemon-card-link" href="../detailPage/detailPage.html?name=${data.name}" style="display:flex; flex-direction:column; align-items:center; height:100%;">
                <div class="pokemon-image" style="width:160px; height:160px;">
                  ${staticImg ? `<img src="${staticImg}" alt="${data.name}" style="width:100%; height:100%; object-fit:contain;">` : ""}
                </div>
                <h3 style="margin-top:8px;">${data.name.toUpperCase()}</h3>
                <div class="types" style="display:flex; gap:6px; flex-wrap:wrap; justify-content:center; margin-top:auto;">${tiposHtml}</div>
                <button class="favorite-btn" data-id="${data.id}" aria-label="Favoritar ${data.name}" style="margin-top:8px;">
                  <span class="star">${favStar}</span>
                  <span class="fav-label">${favLabel}</span>
                </button>
              </a>
            </div>
          `;
        }).join(""); // Junta todas as strings HTML dos cartões numa única string.
        
        // Insere o HTML dos cartões no container da página.
        container.innerHTML = cards;
        
        // Atribui o evento de clique aos novos botões de favorito.
        bindFavoriteButtons(container);
      }).catch(() => {
        // Captura erros na busca dos detalhes.
        container.innerHTML = `<p style="color:red;">Erro ao carregar resultados.</p>`;
      });
    })
    .catch(() => {
      // Captura erros na busca da lista inicial.
      container.innerHTML = `<p style=\"color:red;\">Erro ao buscar Pokémon.</p>`;
    });
});

/**
 * Obtém os dados do utilizador atualmente logado do LocalStorage.
 * @returns {object|null} - Objeto do utilizador logado ou null.
 */
function getLoggedUser() {
  // Tenta analisar (parse) a string 'loggedUser' do LocalStorage.
  const userString = localStorage.getItem('loggedUser');
  return userString ? JSON.parse(userString) : null;
}

/**
 * Verifica se um Pokémon (pelo ID) está na lista de favoritos do utilizador logado.
 * @param {number} id - O ID do Pokémon.
 * @returns {boolean} - true se for favorito, false caso contrário.
 */
function isFavorito(id) {
  const user = getLoggedUser();
  // Obtém a lista de favoritos do utilizador. Se não existir, usa um array vazio.
  const favs = user?.favoritos || [];
  // Verifica se o ID do Pokémon está incluído no array de favoritos.
  return favs.includes(id);
}

/**
 * Alterna o estado de favorito de um Pokémon (adiciona/remove).
 * Atualiza o LocalStorage para 'loggedUser' e 'users'.
 * @param {number} id - O ID do Pokémon a favoritar/desfavoritar.
 * @param {HTMLElement} button - O botão que foi clicado, para atualizar o seu texto.
 */
function toggleFavorito(id, button) {
  // Obtém todos os utilizadores (necessário para persistir a alteração).
  const users = JSON.parse(localStorage.getItem('users')) || [];
  
  // Obtém o utilizador logado. Se não houver, para a função.
  let user = getLoggedUser();
  if (!user) return;
  
  // Garante que 'favoritos' é um array.
  if (!Array.isArray(user.favoritos)) user.favoritos = [];
  
  // Verifica o estado atual.
  const jaFav = user.favoritos.includes(id);

  // Lógica de Alternância
  if (jaFav) {
    // Se já for favorito, remove-o da lista.
    user.favoritos = user.favoritos.filter(f => f !== id);
  } else {
    // Se não for favorito, adiciona-o à lista.
    user.favoritos.push(id);
  }
  
  // Atualização Visual do Botão
  const star = button.querySelector('.star');
  const label = button.querySelector('.fav-label');
  // Altera a estrela e o rótulo com base no novo estado.
  if (star) star.textContent = jaFav ? '☆' : '★';
  if (label) label.textContent = jaFav ? 'FAVORITAR' : 'FAVORITO';

  // Persistência no LocalStorage
  // 1. Atualiza o objeto 'user' na lista geral de utilizadores ('users').
  const updatedUsers = users.map(u => u.username === user.username ? user : u);
  
  // 2. Atualiza o utilizador logado ('loggedUser').
  localStorage.setItem('loggedUser', JSON.stringify(user));
  
  // 3. Salva a lista geral de utilizadores atualizada.
  localStorage.setItem('users', JSON.stringify(updatedUsers));
}

/**
 * Atribui a função de alternar favorito (toggleFavorito) a todos os botões de favorito encontrados.
 * @param {HTMLElement} scope - O elemento dentro do qual procurar os botões (por padrão, todo o documento).
 */
function bindFavoriteButtons(scope = document) {
  // Itera sobre todos os botões com a classe 'favorite-btn'.
  scope.querySelectorAll('.favorite-btn').forEach(btn => {
    btn.onclick = (e) => {
      // Previne o comportamento padrão (se o botão estiver dentro de um link) e a propagação do evento.
      e.preventDefault();
      e.stopPropagation();
      
      // Obtém o ID do Pokémon do atributo 'data-id' e converte para número.
      const id = Number(btn.getAttribute('data-id'));
      
      // Chama a função de alternar o favorito.
      toggleFavorito(id, btn);
    };
  });
}