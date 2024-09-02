import { Pokemon } from "./js/pokemon.js";

const apiUrl = "https://pokeapi.co/api/v2/";

const pokemonInput = document.getElementById("pokemonInput");
const searchBtn = document.getElementById("searchBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const namePokemon = document.getElementById("namePokemon");
const imagePokemon = document.getElementById("imagePokemon");
const typePokemon = document.getElementById("typePokemon");
const weightPokemon = document.getElementById("weightPokemon");
const heightPokemon = document.getElementById("heightPokemon");
const abilitiesPokemon = document.getElementById("abilitiesPokemon");
const idPokemon = document.getElementById("numPokedex");

const filterButton = document.querySelector(".filterButton");
const filterModal = document.querySelector(".filterModal");
const filterOverlay = document.querySelector(".filterOverlay");
const submitFilterButton = document.querySelector(".submitFilter");
const closeFilterButton = document.querySelector(".closeFilter");
const generationSelect = document.getElementById("generation");
const capacitySelect = document.getElementById("capacity");

const addToPokedexBtn = document.querySelector(".pokedex button");

let numberID = 1;

const orderGeneration = {
    1: { start: 1, end: 151 },
    2: { start: 152, end: 251 },
    3: { start: 252, end: 386 },
    4: { start: 387, end: 493 },
    5: { start: 494, end: 649 },
    6: { start: 650, end: 721 },
    7: { start: 722, end: 807 },
    8: { start: 810, end: 898 },
    9: { start: 899, end: 1025 },
};

const typeOfCapacity = {
    1: "normal",
    2: "fire",
    3: "water",
    4: "electric",
    5: "grass",
    6: "ice",
    7: "fighting",
    8: "poison",
    9: "ground",
    10: "flying",
    11: "psychic",
    12: "bug",
    13: "rock",
    14: "ghost",
    15: "dragon",
    16: "dark",
    17: "steel",
    18: "fairy",
};

const mapPokemon = (data) => {
    return new Pokemon(
        data.name,
        data.sprites.other["official-artwork"].front_default,
        data.types.map(type => type.type.name),
        (data.weight / 10).toFixed(1) + 'kg',
        (data.height / 10).toFixed(1) + 'm',
        data.abilities.map(ability => ability.ability.name),
        data.id
    );
};

const displayPokemonInfo = (pokemon) => {
    namePokemon.textContent = `Nom: ${pokemon.name}`;
    imagePokemon.src = pokemon.image;
    typePokemon.textContent = `Types: ${pokemon.type.join(', ')}`;
    weightPokemon.textContent = `Poids: ${pokemon.weight}`;
    heightPokemon.textContent = `Taille: ${pokemon.height}`;
    abilitiesPokemon.textContent = `Capacités: ${pokemon.abilities.join(', ')}`;
    idPokemon.textContent = `Numéro de Pokedex : ${pokemon.numPokedex}`;
};

const getPokemonById = async (idPokemon) => {
    if (idPokemon) {
        try {
            const response = await fetch(`${apiUrl}pokemon/${idPokemon}`);
            if (!response.ok) {
               alert("Pokémon non trouvé");
            }
            const data = await response.json();
            const pokemon = mapPokemon(data);
            displayPokemonInfo(pokemon);
            return pokemon;
        } catch (error) {
            namePokemon.textContent = "Erreur, Mauvais nom ou mauvais id de Pokémon!";
            namePokemon.classList.add("error");
            console.log(error);
        }
    }
};

const getFirst10Pokemons = async (generation = 1, capacity = null) => {
    const generationPokemon = orderGeneration[generation];
    const pokemonContainer = document.querySelector(".pokemonList20");
    pokemonContainer.innerHTML = "";

    let count = 0;
    const maxPokemons = 10;

    try {
        for (let i = generationPokemon.start; i <= generationPokemon.end; i++) {
            if (count >= maxPokemons) break;

            const response = await fetch(`${apiUrl}pokemon/${i}`);
            if (!response.ok) continue;

            const data = await response.json();
            const pokemon = mapPokemon(data);

            const matchesCapacity = !capacity || pokemon.type.includes(typeOfCapacity[capacity]);

            if (matchesCapacity) {
                const pokemonElmt = document.createElement("div");
                pokemonElmt.classList.add("pokemon");

                pokemonElmt.innerHTML = `
                    <img src="${pokemon.image}" alt="${pokemon.name}">
                    <h3 class="pokemonName">${pokemon.name}</h3>
                    <p class="pokemonNumber">#${pokemon.numPokedex}</p>
                    
                `;

                pokemonContainer.appendChild(pokemonElmt);
                count++;
            }
        }
    } catch (error) {
        console.error("Erreur ", error);
    }
};

const addToPokedex = (pokemon) => {
    let pokedex = JSON.parse(localStorage.getItem('pokedex')) || [];
    if (!pokedex.find(p => p.numPokedex === pokemon.numPokedex)) {
        pokedex.push(pokemon);
        localStorage.setItem('pokedex', JSON.stringify(pokedex));
        displayPokedex();
    }
};

const displayPokedex = () => {
    const pokedexList = document.getElementById('pokedexList');
    let pokedex = JSON.parse(localStorage.getItem('pokedex')) || [];
    pokedexList.innerHTML = '';

    pokedex.forEach(pokemon => {
        const pokemonElmt = document.createElement("div");
        pokemonElmt.classList.add("pokemon");

        pokemonElmt.innerHTML = `
            <img src="${pokemon.image}" alt="${pokemon.name}">
            <h3 class="pokemonName">${pokemon.name}</h3>
            <p class="pokemonNumber">#${pokemon.numPokedex}</p>
        `;

        pokedexList.appendChild(pokemonElmt);
    });
};

document.addEventListener("DOMContentLoaded", () => {
    getPokemonById(1); 
    getFirst10Pokemons();
    displayPokedex(); 
});

searchBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const input = pokemonInput.value.trim().toLowerCase();
    await getPokemonById(input);
});

prevBtn.addEventListener("click", () => {
    if (numberID > 1) {
        numberID--;
        getPokemonById(numberID);
    }
});

nextBtn.addEventListener("click", () => {
    numberID++;
    getPokemonById(numberID);
});

filterButton.addEventListener("click", () => {
    filterModal.style.display = "block";
    filterOverlay.style.display = "block";
});

closeFilterButton.addEventListener("click", () => {
    filterModal.style.display = "none";
    filterOverlay.style.display = "none";
});

submitFilterButton.addEventListener("click", () => {
    filterModal.style.display = "none";
    filterOverlay.style.display = "none";
    const generation = generationSelect.value;
    const capacity = capacitySelect.value;
    getFirst10Pokemons(generation, capacity);
});

document.addEventListener("click", async (e) => {
    if (e.target && e.target.classList.contains("captureButton")) {
        const pokemonId = e.target.dataset.id;
        const pokemon = await getPokemonById(pokemonId);
        if (pokemon) {
            addToPokedex(pokemon);
        }
    }
});

addToPokedexBtn.addEventListener("click", async () => {
    const pokemon = await getPokemonById(numberID);
    if (pokemon) {
        addToPokedex(pokemon);
    }
});

