interface Pokemon {
    id: number;
    name: string;
    sprite: {
        front_default: string;
    };
    types: string[];
}

let allPokemons: Pokemon[] = [];

const pokedexContainer = document.getElementById("pokedex") as HTMLElement;
const API_URL = "https://pokeapi.co/api/v2/pokemon?limit=500";
const languageSelect = document.getElementById("languageSelect") as HTMLSelectElement;
const storedLanguage = localStorage.getItem("selectedLanguage") || "fr";
languageSelect.value = storedLanguage;
const typeFilter = document.getElementById("typeFilter") as HTMLSelectElement;
const searchBar = document.getElementById("searchBar") as HTMLInputElement;

searchBar.addEventListener("input", () => {
    const searchText = searchBar.value.toLowerCase();
    const filteredPokemons = allPokemons.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(searchText) ||
        pokemon.id.toString().includes(searchText)
    );
    displayPokemons(filteredPokemons);
});

typeFilter.addEventListener("change", () => {
    const selectedType = typeFilter.value;
    const filteredPokemons = selectedType === "all"
        ? allPokemons
        : allPokemons.filter((pokemon) => pokemon.types.includes(selectedType));
    displayPokemons(filteredPokemons);
});

async function initPokemons() {
    allPokemons = await fetchPokemons(storedLanguage);
    displayPokemons(allPokemons);
}

initPokemons();

languageSelect.addEventListener("change", async () => {
    const selectedLanguage = languageSelect.value;
    localStorage.setItem("selectedLanguage", selectedLanguage);
    allPokemons = await fetchPokemons(selectedLanguage);
    displayPokemons(allPokemons);
});

async function fetchPokemonName(pokemonId: number, lang: string): Promise<string> {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}/`);
    const data = await response.json();
    const nameEntry = data.names.find((entry: any) => entry.language.name === lang);
    return nameEntry ? nameEntry.name : data.name;
}

async function fetchPokemons(lang: string = "fr"): Promise<Pokemon[]> {
    const response = await fetch(API_URL);
    const data = await response.json();

    const pokemonList: Pokemon[] = await Promise.all(
        data.results.map(async (pokemon: { name: string; url: string }, index: number) => {
            const res = await fetch(pokemon.url);
            const pokeData = await res.json();
            const translatedName = await fetchPokemonName(index + 1, lang);

            return {
                id: pokeData.id,
                name: translatedName,
                sprite: pokeData.sprites.front_default,
                types: pokeData.types.map((t: any) => t.type.name),
            };
        })
    );

    return pokemonList;
}

function displayPokemons(pokemonList: Pokemon[]) {
    pokedexContainer.innerHTML = "";
    const favorites: Pokemon[] = JSON.parse(localStorage.getItem("favorites") || "[]");

    pokemonList.forEach((pokemon) => {
        const card = document.createElement("div");
        card.classList.add("pokemon-card");

        const isFavorite = favorites.some((fav) => fav.id === pokemon.id);
        const starIcon = isFavorite ? "⭐" : "☆";

        const typesHtml = Array.isArray(pokemon.types)
            ? pokemon.types.map((type) => {
                const typeElement = document.createElement("img");
                typeElement.classList.add("type-icon");
                typeElement.src = `https://raw.githubusercontent.com/msikma/pokesprite/master/misc/types/gen8/${type}.png`;
                typeElement.alt = type;
                typeElement.style.width = "30px";
                typeElement.style.height = "30px";
                typeElement.style.margin = "2px";
                return typeElement.outerHTML;
            }).join("")
            : "<p>Type inconnu</p>";

        card.innerHTML = `
            <img src="${pokemon.sprite}" alt="${pokemon.name}">
            <h2>${pokemon.name}</h2>
            <div class="pokemon-types">${typesHtml}</div>
            <button class="favorite-btn" data-id="${pokemon.id}">${starIcon}</button>
        `;

        const favoriteButton = card.querySelector(".favorite-btn") as HTMLButtonElement;
        favoriteButton.addEventListener("click", (event) => {
            event.stopPropagation();
            toggleFavorite(pokemon, favoriteButton);
        });

        card.addEventListener("click", () => {
            window.location.href = `details.html?id=${pokemon.id}`;
        });

        pokedexContainer.appendChild(card);
    });
}

function toggleFavorite(pokemon: Pokemon, button: HTMLButtonElement) {
    let favorites: Pokemon[] = JSON.parse(localStorage.getItem("favorites") || "[]");

    const existingIndex = favorites.findIndex((fav) => fav.id === pokemon.id);

    if (existingIndex !== -1) {
        favorites.splice(existingIndex, 1);
        button.textContent = "☆";
    } else {
        favorites.push(pokemon);
        button.textContent = "⭐";
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
}

