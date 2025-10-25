const carouselTrack = document.querySelector('.carousel-track');
let pokemonData = [];
const NUM_CARDS_IN_DOM = 4;
const VISIBLE_CENTER_INDEX = 1;
// Novo: Define o máximo de IDs de Pokémon. Usando 1025 para abranger a maioria dos Pokémon existentes.
const MAX_POKEMON_ID = 500; 

// Variável global para armazenar o ID do intervalo do carrossel
let carouselIntervalId = null; 
const ROTATION_TIME = 3000; // 3 segundos entre cada rotação

// NOVA FUNÇÃO: Gera um ID de Pokémon aleatório entre 1 e MAX_POKEMON_ID
function getRandomPokemonId() {
    return Math.floor(Math.random() * MAX_POKEMON_ID) + 1;
}

// Função para buscar dados de um Pokémon
async function fetchPokemon(id) {
    // Não precisa de normalização modular.
    // O ID agora é garantido como um número válido (1 a 1025)
    
    // Garantia de limite caso o ID seja gerado fora por erro (apesar de getRandomPokemonId garantir isso)
    const normalizedId = Math.min(Math.max(id, 1), MAX_POKEMON_ID); 
    
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${normalizedId}`);
    
    // Tratamento de erro básico (embora ids aleatórios entre 1 e 1025 devam funcionar)
    if (!response.ok) {
        console.error(`Falha ao buscar Pokémon com ID ${normalizedId}`);
        // Tenta buscar um ID aleatório alternativo em caso de falha
        return fetchPokemon(getRandomPokemonId()); 
    }
    
    const pokemon = await response.json();
    return {
        name: pokemon.name.toUpperCase(),
        image: pokemon.sprites.other['official-artwork'].front_default,
        id: normalizedId
    };
}

// Função para criar o elemento card HTML (agora retorna a tag <a>)
function createCardElement(pokemon) {
    const link = document.createElement('a'); // <a> é o item principal
    link.href = `pokemon-details.html?id=${pokemon.id}`;
    
    const card = document.createElement('div'); // <div> é o conteúdo visual
    card.classList.add('card');
    card.dataset.pokemonId = pokemon.id;
    
    card.innerHTML = `
        <img src="${pokemon.image}" alt="${pokemon.name}">
        <h3>${pokemon.name}</h3>
    `;
    
    link.appendChild(card);
    return link;
}

// Função principal para carregar os 4 Pokémon iniciais
async function loadInitialPokemons() {
    // Usa 4 IDs aleatórios para a inicialização
    const initialIds = Array(NUM_CARDS_IN_DOM).fill(0).map(() => getRandomPokemonId());
    
    pokemonData = await Promise.all(initialIds.map(id => fetchPokemon(id)));

    pokemonData.forEach((pokemon, index) => {
        const linkElement = createCardElement(pokemon); 
        if (index === VISIBLE_CENTER_INDEX) {
             linkElement.classList.add('center'); // Aplica no <a>
        }
        carouselTrack.appendChild(linkElement);
    });

    carouselTrack.style.transform = 'translateX(0)';
}


// Função para rotacionar o carrossel
async function rotateCarousel() {
    const links = document.querySelectorAll('.carousel-track a');
    
    const firstLink = links[0];
    const centerLink = links[1]; 
    const nextCenterLink = links[2] || carouselTrack.lastElementChild; 
    
    const cardToMoveWidth = firstLink.offsetWidth + 20;

    
    // 1. ANTES da Transição: Define o novo centro e remove o status do antigo.
    centerLink.classList.remove('center'); 
    nextCenterLink.classList.add('center'); 
    
    // 2. INICIA A ROTAÇÃO VISÍVEL (com transição CSS)
    carouselTrack.style.transition = 'transform 0.5s ease-in-out';
    carouselTrack.style.transform = `translateX(-${cardToMoveWidth}px)`;

    // 3. Aguarda a animação visual
    await new Promise(resolve => setTimeout(resolve, 500)); 

    // 4. TELETRANSPORTE (Troca de Posição e Reciclagem)
    carouselTrack.style.transition = 'none';

    // Move o primeiro link (que saiu de vista) para o final
    carouselTrack.appendChild(firstLink);
    
    // Reseta a posição instantaneamente.
    carouselTrack.style.transform = 'translateX(0)';

    // 5. CARREGA NOVO POKÉMON (no link reciclado, fora de vista)
    // *** MUDANÇA AQUI: Usa um ID ALEATÓRIO em vez de nextPokemonId++ ***
    const newPokemon = await fetchPokemon(getRandomPokemonId());
    const lastLink = carouselTrack.lastElementChild;

    // Acessa os elementos dentro do link (o div.card) para atualizar
    lastLink.href = `pokemon-details.html?id=${newPokemon.id}`; // Atualiza o link
    lastLink.querySelector('img').src = newPokemon.image;
    lastLink.querySelector('img').alt = newPokemon.name;
    lastLink.querySelector('h3').textContent = newPokemon.name;
    lastLink.firstElementChild.dataset.pokemonId = newPokemon.id; // Atualiza o ID no dataset
    
    // Garante que o link reciclado não tenha a classe 'center'.
    lastLink.classList.remove('center'); 

    // Opcional: Garante que a transição volte a funcionar para o próximo ciclo
    setTimeout(() => {
        carouselTrack.style.transition = 'transform 0.5s ease-in-out';
    }, 50); 
}

// -----------------------------------------------------------------
// FUNÇÕES DE CONTROLE DE PAUSA/RETOMADA (inalteradas)
// -----------------------------------------------------------------

// Função 1: Inicia ou Retoma a rotação
function startCarousel() {
    if (carouselIntervalId === null) {
        carouselIntervalId = setInterval(rotateCarousel, ROTATION_TIME);
        console.log("Carrossel iniciado/retomado.");
    }
}

// Função 2: Pausa a rotação
function pauseCarousel() {
    clearInterval(carouselIntervalId);
    carouselIntervalId = null; 
    console.log("Carrossel pausado.");
}

// -----------------------------------------------------------------
// INICIA O CARROSSEL E ADICIONA LISTENERS DE PAUSA/RETOMADA (inalteradas)
// -----------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    loadInitialPokemons().then(() => {
        // 1. Inicia o carrossel automaticamente ao carregar
        startCarousel(); 
        
        // 2. Adiciona a lógica de pausa/retomada ao passar o mouse
        const container = document.querySelector('.carousel-container');
        
        // Pausa quando o cursor entra no container do carrossel
        container.addEventListener('mouseenter', pauseCarousel);
        
        // Retoma quando o cursor sai do container
        container.addEventListener('mouseleave', startCarousel);
    });
});