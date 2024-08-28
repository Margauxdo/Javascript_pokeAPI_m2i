import { Pokemon } from "./pokemon.js";

const apiUrl = "https://pokeapi.co/api/v2/";

let numberID = 1;

const mapPokemon = (data) => {
    
        return new Pokemon(
        data.name,
        data.sprites.front_default,
        data.types.map(type => type.type.name),
         data.weight.toFixed(2) + 'kg',
         data.height.toFixed(2) + 'm',
         data.abilities.map(ability => ability.ability.name),
         data.id   
        );
    };



const getPokemonById = async (idPokemon) => {
    if(idPokemon){
        try{
            const response = await fetch(`${apiUrl}pokemon/${idPokemon}`);
            
            const data = await response.json();
            console.log(data);
            const pokemon = mapPokemon(data);
            displayPokemonInfo(pokemon);
            
        }
        catch(error){
            displayPokemonInfo({error: "erreur lors de la récupération du Pokemon par son numéro de Pokedex international!"});
        console.log(error);
        }
    }
   
}
function displayPokemonInfo(pokemon){
    if(pokemon.error){
        pokemonInfo.textContent = pokemon.error;
        imagePokemon.src = '';
        typePokemon.textContent = '';
        weightPokemon.textContent = '';
        heightPokemon.textContent = '';
        abilitiesPokemon.textContent = '';
        idPokemon.textContent = '';
    }
    else{
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

searchBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const input = pokemonInput.value.trim().toLowerCase();
  getPokemonById(input);
  
}
);






prevBtn.addEventListener("click", () => {
   
    numberID--;
    getPokemonById(numberID);
   
});

nextBtn.addEventListener("click", () => {
    numberID++;
    getPokemonById(numberID);
});

getPokemonById(numberID); 


