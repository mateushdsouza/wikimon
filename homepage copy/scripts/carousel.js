const carouselTrack = document.querySelector('.carousel-track');
let pokemonData = [];
const NUM_CARDS_IN_DOM = 4;
const VISIBLE_CENTER_INDEX = 1;
// Novo: Define o máximo de IDs de Pokémon. Usando 1025 para abranger a maioria dos Pokémon existentes.
const MAX_POKEMON_ID = 1025;

// Variável global para armazenar o ID do intervalo do carrossel
let carouselIntervalId = null;
const ROTATION_TIME = 5000; // 5 segundos entre cada rotação

// Gera um ID de Pokémon aleatório
function getRandomPokemonId() {
    return Math.floor(Math.random() * MAX_POKEMON_ID) + 1;
}

// NOVA FUNÇÃO: Valida se a imagem realmente existe e carrega
async function validateImage(url) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;

        // Timeout de 3 segundos
        setTimeout(() => resolve(false), 3000);
    });
}

// Função para buscar dados de um Pokémon com validação de imagem
async function fetchPokemon(id, retries = 5) {
    const normalizedId = Math.min(Math.max(id, 1), MAX_POKEMON_ID);

    console.log(`🔍 Tentando buscar Pokémon ID: ${normalizedId}`);

    try {
        const url = `https://pokeapi.co/api/v2/pokemon/${normalizedId}`;
        console.log(` Fazendo requisição para: ${url}`);

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const pokemon = await response.json();
        console.log(` Dados recebidos:`, pokemon.name);

        // Lista de URLs para tentar, em ordem de prioridade (APENAS IMAGENS GRANDES)
        const imageUrls = [];

        // 1. Official artwork (verifica se não é GitHub)
        if (pokemon.sprites.other?.['official-artwork']?.front_default) {
            const artwork = pokemon.sprites.other['official-artwork'].front_default;
            if (!artwork.includes('githubusercontent.com')) {
                imageUrls.push({ url: artwork, type: 'Official Artwork' });
            }
        }

        // 2. Home sprites (imagens grandes)
        if (pokemon.sprites.other?.home?.front_default) {
            imageUrls.push({ url: pokemon.sprites.other.home.front_default, type: 'Home' });
        }

        // 3. Dream World (imagens grandes)
        if (pokemon.sprites.other?.dream_world?.front_default) {
            imageUrls.push({ url: pokemon.sprites.other.dream_world.front_default, type: 'Dream World' });
        }

        // Testa cada URL até encontrar uma que funcione
        for (const imageData of imageUrls) {
            console.log(` Testando imagem: ${imageData.type}`);
            const isValid = await validateImage(imageData.url);

            if (isValid) {
                console.log(` Imagem válida encontrada: ${imageData.type}`);
                return {
                    name: pokemon.name.toUpperCase(), // Sempre em maiúsculas
                    image: imageData.url,
                    id: normalizedId
                };
            } else {
                console.log(` Imagem falhou: ${imageData.type}`);
            }
        }

        // Se nenhuma imagem funcionar, lança erro
        throw new Error('Nenhuma imagem válida encontrada');

    } catch (error) {
        console.error(` Erro ao buscar Pokémon ${normalizedId}:`, error.message);

        // Tenta outro Pokémon aleatório
        if (retries > 0) {
            console.log(` Tentando outro Pokémon... (${retries} tentativas restantes)`);
            await new Promise(resolve => setTimeout(resolve, 300));
            return fetchPokemon(getRandomPokemonId(), retries - 1);
        }

        // Fallback final - Pokémon populares que sempre têm imagem
        const fallbackIds = [1, 4, 7, 25, 133, 152, 155, 158]; // Bulbasaur, Charmander, Squirtle, Pikachu, etc.
        const fallbackId = fallbackIds[Math.floor(Math.random() * fallbackIds.length)];

        console.warn(` Usando Pokémon fallback (ID: ${fallbackId})`);
        return fetchPokemon(fallbackId, 0); // Sem retry no fallback
    }
}

// Função para criar o elemento card HTML
function createCardElement(pokemon) {
    const link = document.createElement('a');
    link.href = `pokemon-details.html?id=${pokemon.id}`;

    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.pokemonId = pokemon.id;

    card.innerHTML = `
        <img src="${pokemon.image}" 
             alt="${pokemon.name}"
             loading="eager"
             crossorigin="anonymous">
        <h3>${pokemon.name}</h3>
    `;

    card.addEventListener("click", (event) => {
        event.preventDefault();
        abrirModalPokemon(pokemon.id);
    });

    link.appendChild(card);
    return link;

}

// Função principal para carregar os 4 Pokémon iniciais
async function loadInitialPokemons() {
    console.log(' ===== INICIANDO CARROSSEL =====');
    console.log(` Carregando ${NUM_CARDS_IN_DOM} Pokémon iniciais...`);

    try {
        pokemonData = [];

        for (let i = 0; i < NUM_CARDS_IN_DOM; i++) {
            const id = getRandomPokemonId();
            console.log(`\n--- Card ${i + 1}/${NUM_CARDS_IN_DOM} ---`);
            console.log(` ID aleatório gerado: ${id}`);

            const pokemon = await fetchPokemon(id);
            pokemonData.push(pokemon);

            console.log(` Pokémon ${i + 1} adicionado:`, pokemon.name);

            const linkElement = createCardElement(pokemon);
            if (i === VISIBLE_CENTER_INDEX) {
                linkElement.classList.add('center');
                console.log(` Card ${i + 1} marcado como CENTER`);
            }
            carouselTrack.appendChild(linkElement);

            // Delay menor entre requisições
            if (i < NUM_CARDS_IN_DOM - 1) {
                console.log(` Aguardando 300ms antes do próximo Pokémon...`);
                await new Promise(resolve => setTimeout(resolve, 300));
            }
        }

        carouselTrack.style.transform = 'translateX(0)';
        console.log('\n ===== CARROSSEL INICIALIZADO COM SUCESSO =====');
        console.log(' Pokémon carregados:', pokemonData.map(p => `${p.name} (ID: ${p.id})`));

    } catch (error) {
        console.error(' Erro fatal ao inicializar carrossel:', error);
    }
}

// Função para rotacionar o carrossel
async function rotateCarousel() {
    const links = document.querySelectorAll('.carousel-track a');

    if (links.length < 3) {
        console.error(' Número insuficiente de cards no carrossel');
        return;
    }

    const firstLink = links[0];
    const centerLink = links[1];
    const nextCenterLink = links[2];

    const cardToMoveWidth = firstLink.offsetWidth + 20;

    centerLink.classList.remove('center');
    nextCenterLink.classList.add('center');

    carouselTrack.style.transition = 'transform 0.5s ease-in-out';
    carouselTrack.style.transform = `translateX(-${cardToMoveWidth}px)`;

    await new Promise(resolve => setTimeout(resolve, 500));

    carouselTrack.style.transition = 'none';
    carouselTrack.appendChild(firstLink);
    carouselTrack.style.transform = 'translateX(0)';

    try {
        console.log('\n Carregando novo Pokémon para rotação...');
        const newPokemon = await fetchPokemon(getRandomPokemonId());
        const lastLink = carouselTrack.lastElementChild;

        lastLink.href = `pokemon-details.html?id=${newPokemon.id}`;

        const img = lastLink.querySelector('img');
        const h3 = lastLink.querySelector('h3');

        img.src = newPokemon.image;
        img.alt = newPokemon.name;
        h3.textContent = newPokemon.name;
        lastLink.firstElementChild.dataset.pokemonId = newPokemon.id;
        lastLink.classList.remove('center');

        // 🔥 Correção: garantir que o card abra o modal SEMPRE
        lastLink.firstElementChild.onclick = () => {
            abrirModalPokemon(newPokemon.id);
        };




        console.log(` Novo Pokémon carregado na rotação: ${newPokemon.name}`);
    } catch (error) {
        console.error(' Erro ao carregar novo Pokémon na rotação:', error);
    }

    setTimeout(() => {
        carouselTrack.style.transition = 'transform 0.5s ease-in-out';
    }, 50);
}

function startCarousel() {
    if (carouselIntervalId === null) {
        carouselIntervalId = setInterval(rotateCarousel, ROTATION_TIME);
        console.log("▶ Carrossel iniciado/retomado.");
    }
}

function pauseCarousel() {
    clearInterval(carouselIntervalId);
    carouselIntervalId = null;
    console.log("⏸ Carrossel pausado.");
}

document.addEventListener('DOMContentLoaded', () => {
    console.log(' DOM carregado!');

    const container = document.querySelector('.carousel-container');

    if (!container) {
        console.error(' Elemento .carousel-container não encontrado!');
        return;
    }

    if (!carouselTrack) {
        console.error(' Elemento .carousel-track não encontrado!');
        return;
    }

    console.log(' Elementos encontrados, iniciando carregamento...');

    loadInitialPokemons().then(() => {
        startCarousel();

        container.addEventListener('mouseenter', pauseCarousel);
        container.addEventListener('mouseleave', startCarousel);
    });
});

function abrirModalPokemon(id) {

    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
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

    document.getElementById("closeModal").onclick = function () {
        document.getElementById("modal").style.display = "none";
    };

    window.onclick = function (event) {
        if (event.target === document.getElementById("modal")) {
            document.getElementById("modal").style.display = "none";
        }
    };
}

document.getElementById("closeModal").onclick = function () {
    document.getElementById("modal").style.display = "none";
};

window.onclick = function (event) {
    if (event.target === document.getElementById("modal")) {
        document.getElementById("modal").style.display = "none";
    }
};
