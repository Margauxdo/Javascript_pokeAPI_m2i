import { Pokemon } from "./js/pokemon.js";

const apiUrl = "https://pokeapi.co/api/v2/";

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
    1: "acier",
    2: "dragon",
    3: "electrik",
    4: "feu",
    5: "insecte",
    6: "plante",
    7: "psy",
    8: "sol",
    9: "ténèbre",
    10: "combat",
    11: "eau",
    12: "fée",
    13: "glace",
    14: "normal",
    15: "poison",
    16: "roche",
    17: "spectre",
    18: "vol",
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

const getPokemonById = async (idPokemon) => {
    if (idPokemon) {
        try {
            const response = await fetch(`${apiUrl}pokemon/${idPokemon}`);
            if (!response.ok) {
                throw new Error("Pokémon non trouvé");
            }
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
    getFirst10Pokemons(generation);
});

const getFirst10Pokemons = async (generation) => {
    const generationPokemon = orderGeneration[generation];
    if (!generationPokemon) {
        console.error(`Génération ${generation} inconnue`);
        return;
    }

    const pokemonContainer = document.querySelector(".pokemonList20");
    pokemonContainer.innerHTML = "";

    try {
        for (let i = generationPokemon.start; i < generationPokemon.start + 10; i++) {
            try {
                const response = await fetch(`${apiUrl}pokemon/${i}`);
                if (!response.ok) {
                    continue; 
                }
                const data = await response.json();
                const pokemon = mapPokemon(data);
                

                const pokemonElmt = document.createElement("div");
                pokemonElmt.classList.add("pokemon");

                pokemonElmt.innerHTML = `
                    <img src="${pokemon.image}" alt="${pokemon.name}">
                    <h3 class="pokemonName">${pokemon.name}</h3>
                    <p class="pokemonNumber">#${pokemon.numPokedex}</p>
                `;

                pokemonContainer.appendChild(pokemonElmt);
            } catch (error) {
                console.error(`Erreur de Pokemon${i}:`, error);
            }
        }
    } catch (error) {
        console.error("Erreur de Pokémon:", error);
    }
};

document.addEventListener("DOMContentLoaded", () => {
    getFirst10Pokemons(2); 
});

searchBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const input = pokemonInput.value.trim().toLowerCase();
    getPokemonById(input);
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

getPokemonById(numberID);

