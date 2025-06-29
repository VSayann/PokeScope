interface Pokemon {
    id: number;
    name: string;
    types: string[];
    sprite: {
        front_default: string;
    };
}

const favoritesContainer = document.getElementById("favoritesContainer") as HTMLElement;

async function loadFavorites() { 
    const favorisContainer = document.getElementById("favoris-container") as HTMLElement;
    const favorites: Pokemon[] = JSON.parse(localStorage.getItem("favorites") || "[]");

    if (!favorites || favorites.length === 0) {
        favorisContainer.innerHTML = "<p>Aucun favori ajouté.</p>";
        return;
    }

    favorisContainer.innerHTML = "";
    favorites.forEach((pokemon) => {
        if (!pokemon.types || !Array.isArray(pokemon.types)) {
            console.error(`Erreur : Le Pokémon ${pokemon.name} n'a pas de types définis.`);
            return;
        }

        const card = document.createElement("div");
        card.classList.add("pokemon-card");

        const typesHtml = pokemon.types
            .map((typeName) => {
                const typeElement = document.createElement("img");
                typeElement.classList.add("type-icon");
                typeElement.src = `https://raw.githubusercontent.com/msikma/pokesprite/master/misc/types/gen8/${typeName}.png`;
                typeElement.alt = typeName;
                typeElement.style.width = "30px";
                typeElement.style.height = "30px";
                typeElement.style.margin = "2px";
                return typeElement.outerHTML;
            })
            .join("");

        card.innerHTML = `
            <img src="${pokemon.sprite}" alt="${pokemon.name}">
            <h2>${pokemon.name}</h2>
            <div class="pokemon-types">${typesHtml}</div>
        `;

        favorisContainer.appendChild(card);
    });
}

loadFavorites();


function removeFavorite(event: Event, pokemonId: number, card: HTMLElement) {
    event.stopPropagation();

    const favorisContainer = document.getElementById("favoris-container") as HTMLElement;
    let favorites: Pokemon[] = JSON.parse(localStorage.getItem("favorites") || "[]");

    favorites = favorites.filter((pokemon) => pokemon.id !== pokemonId);
    localStorage.setItem("favorites", JSON.stringify(favorites));

    card.remove();

    if (favorites.length === 0) {
        favorisContainer.innerHTML = "<p>Aucun Pokémon en favori pour l'instant !</p>";
    }
}

document.addEventListener("DOMContentLoaded", loadFavorites);



loadFavorites();
