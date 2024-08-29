import { Pokemon } from "./js/pokemon.js";

const apiUrl = "https://pokeapi.co/api/v2/";

let numberID = 1;

const mapPokemon = (data) => {
    return new Pokemon(
        data.name,
        data.sprites.front_default,
        data.types.map(type => type.type.name),
        (data.weight/10).toFixed(2) + 'kg',
        (data.height/10).toFixed(2) + 'm',
        data.abilities.map(ability => ability.ability.name),
        data.id   
    );
};

const getPokemonById = async (idPokemon) => {
    if (idPokemon) {
        try {
            const response = await fetch(`${apiUrl}pokemon/${idPokemon}`);
            const data = await response.json();
            const pokemon = mapPokemon(data);
            displayPokemonInfo(pokemon);
        } catch (error) {
            const errorElement = document.getElementById("namePokemon"); 
            errorElement.textContent = "Erreur, Mauvais nom ou mauvais id de Pokémon!";
            errorElement.classList.add("error"); 
            console.log(error);
        }
    }
};

function displayPokemonInfo(pokemon) {
    if (pokemon.error) {
        pokemonInfo.textContent = pokemon.error;
        imagePokemon.src = '';
        typePokemon.textContent = '';
        weightPokemon.textContent = '';
        heightPokemon.textContent = '';
        abilitiesPokemon.textContent = '';
        idPokemon.textContent = '';
    } else {
        namePokemon.textContent = `Nom: ${pokemon.name}`;
        imagePokemon.src = pokemon.image;
        typePokemon.textContent = `Types: ${pokemon.type}`;
        weightPokemon.textContent = `Poids: ${pokemon.weight}`;
        heightPokemon.textContent = `Taille: ${pokemon.height}`;
        abilitiesPokemon.textContent = `Capacités: ${pokemon.abilities}`;
        idPokemon.textContent = `Numéro de Pokedex : ${pokemon.numPokedex}`;
    }
}

const pokemonInput = document.getElementById("pokemonInput");
const searchBtn = document.getElementById("searchBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const pokemonInfo = document.getElementById("pokemonInfo");
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
    getPokemonByGeneration(generation);
});

const getFirst10Pokemons = async () => {
    const url = `${apiUrl}pokemon?limit=10`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        const pokemonList = data.results;
        await displayPokemons(pokemonList);
    } catch (error) {
        console.error("Erreur lors de la récupération des Pokémon:", error);
    }
};

const displayPokemons = async (pokemonList) => {
    const pokemonContainer = document.querySelector(".pokemonList20"); 
    pokemonContainer.innerHTML = "";

    for (const pokemon of pokemonList) {
        try {
            
            const pokemonResponse = await fetch(pokemon.url);
            const pokemonData = await pokemonResponse.json();

            const pokemonElmt = document.createElement("div");
            pokemonElmt.classList.add("pokemon");

            pokemonElmt.innerHTML = `
                <img src="${pokemonData.sprites.front_default}" alt="${pokemonData.name}">
                <h3 class="pokemonName">${pokemonData.name}</h3>
                <p class="pokemonNumber">#${pokemonData.id}</p>
            `;
            pokemonContainer.appendChild(pokemonElmt);

        } catch (error) {
            console.error(`Erreur de pokemon:  ${pokemon.name}:`, error);
        }
    }
};


document.addEventListener("DOMContentLoaded", () => {
    getFirst10Pokemons();
});

searchBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const input = pokemonInput.value.trim().toLowerCase();
    getPokemonById(input);
});

prevBtn.addEventListener("click", () => {
    numberID--;
    getPokemonById(numberID);
});

nextBtn.addEventListener("click", () => {
    numberID++;
    getPokemonById(numberID);
});

getPokemonById(numberID);
