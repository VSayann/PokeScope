const urlParams = new URLSearchParams(window.location.search);
const pokemonId: string | null = urlParams.get("id");

document.addEventListener("DOMContentLoaded", async () => {

    if (!pokemonId) {
        const detailsContainer = document.querySelector(".details-container") as HTMLElement;
        detailsContainer.innerHTML = "<p>Pokémon introuvable.</p>";
        return;
    }

    const API_URL = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`;

    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Problème lors du chargement des données.");
        
        const data: any = await response.json();

        const pokemonName = document.getElementById("pokemon-name") as HTMLElement;
        const pokemonImage = document.getElementById("pokemon-image") as HTMLImageElement;
        
        pokemonName.textContent = data.name.toUpperCase();
        pokemonImage.src = data.sprites.front_default;
        pokemonImage.alt = data.name;

        const typesContainer = document.getElementById("pokemon-types") as HTMLElement;
        typesContainer.innerHTML = data.types
            .map((type: { type: { name: string } }) => 
                `<img src="https://raw.githubusercontent.com/msikma/pokesprite/master/misc/types/gen8/${type.type.name}.png" alt="${type.type.name}">`
            )
            .join("");

const statIcons: { [key: string]: string } = {
    hp: "❤️",
    attack: "⚔️",
    defense: "🛡️",
    "special-attack": "🔥",
    "special-defense": "✨",
    speed: "⚡"
};

const statsContainer = document.getElementById("pokemon-stats") as HTMLElement;
statsContainer.innerHTML = data.stats
    .map((stat: { stat: { name: string }, base_stat: number }) => {
        const icon = statIcons[stat.stat.name] || "❓";
        return `<p><strong>${icon}</strong> ${stat.base_stat}</p>`;
    })
    .join("");


        const favoriteBtn = document.getElementById("favorite-btn") as HTMLButtonElement;
        let favorites: Pokemon[] = JSON.parse(localStorage.getItem("favorites") || "[]");

        let isFavorite = favorites.some((fav: Pokemon) => fav.id === data.id);

        favoriteBtn.textContent = isFavorite ? "⭐ Retirer des favoris" : "☆ Ajouter aux favoris";

        favoriteBtn.addEventListener("click", () => {
            if (isFavorite) {
                favorites = favorites.filter((fav: Pokemon) => fav.id !== data.id);
                favoriteBtn.textContent = "☆ Ajouter aux favoris";
            } else {
                favorites.push({
                    id: data.id,
                    name: data.name,
                    sprite: data.sprites.front_default,
                    types: data.types.map((t: { type: { name: string; }; }) => t.type.name),
                    sprites: ""
                });
                favoriteBtn.textContent = "⭐ Retirer des favoris";
            }

            localStorage.setItem("favorites", JSON.stringify(favorites));
            isFavorite = !isFavorite;
        });

    } catch (error) {
        console.error("Erreur lors du chargement du Pokémon :", error);
    }
});

async function fetchEvolutionChain(pokemonId: number) {
    try {
        const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}/`);
        const speciesData = await speciesResponse.json();
        const evolutionUrl = speciesData.evolution_chain.url;

        const evolutionResponse = await fetch(evolutionUrl);
        const evolutionData = await evolutionResponse.json();

        const evolutionList: { name: string; id: number; sprite: string }[] = [];
        let evolutionStage = evolutionData.chain;

        while (evolutionStage) {
            const evoName = evolutionStage.species.name;
            const evoId = getPokemonIdFromUrl(evolutionStage.species.url);
            const evoSprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evoId}.png`;

            evolutionList.push({ name: evoName, id: evoId, sprite: evoSprite });

            evolutionStage = evolutionStage.evolves_to.length ? evolutionStage.evolves_to[0] : null;
        }

        displayEvolutions(evolutionList, pokemonId);
    } catch (error) {
        console.error("Erreur lors de la récupération des évolutions :", error);
    }
}

function getPokemonIdFromUrl(url: string): number {
    const parts = url.split("/");
    return parseInt(parts[parts.length - 2], 10);
}

function displayEvolutions(evolutions: { name: string; id: number; sprite: string }[], currentId: number) {
    const evolutionContainer = document.getElementById("pokemon-evolutions") as HTMLElement;
    evolutionContainer.innerHTML = "";

    if (evolutions.length <= 1) {
        evolutionContainer.innerHTML = `<p>Aucune évolution disponible.</p>`;
        return;
    }

    const evoHtml = evolutions.map((evo, index) => `
        <div class="evolution-card ${evo.id === currentId ? "selected" : ""}" data-id="${evo.id}">
            <img src="${evo.sprite}" alt="${evo.name}">
            <p>${evo.name}</p>
        </div>
        ${index < evolutions.length - 1 ? `<span class="evolution-arrow">➡️</span>` : ""}
    `).join("");

    evolutionContainer.innerHTML = `<h3>Évolutions</h3><div class="evolution-list">${evoHtml}</div>`;

    document.querySelectorAll(".evolution-card").forEach(card => {
        card.addEventListener("click", (event) => {
            const clickedId = (event.currentTarget as HTMLElement).getAttribute("data-id");
            if (clickedId) {
                window.location.href = `details.html?id=${clickedId}`;
            }
        });
    });
}

const pokemonIdNum = Number(pokemonId);
fetchEvolutionChain(pokemonIdNum);

document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const pokemonId: string | null = urlParams.get("id");

    if (!pokemonId) {
        const detailsContainer = document.querySelector(".details-container") as HTMLElement;
        detailsContainer.innerHTML = "<p>Pokémon introuvable.</p>";
        return;
    }

    const API_URL = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`;

    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Problème lors du chargement des données.");

        const data: any = await response.json();

        const pokemonName = document.getElementById("pokemon-name") as HTMLElement;
        const pokemonImage = document.getElementById("pokemon-image") as HTMLImageElement;

        pokemonName.textContent = data.name.toUpperCase();
        pokemonImage.src = data.sprites.front_default;

        const typesContainer = document.getElementById("pokemon-types") as HTMLElement;
        const pokemonTypes: string[] = data.types.map((t: any) => t.type.name);

        typesContainer.innerHTML = pokemonTypes
            .map((type: string) =>
                `<img src="https://raw.githubusercontent.com/msikma/pokesprite/master/misc/types/gen8/${type}.png" alt="${type}">`
            )
            .join("");

        displayStrengthsAndWeaknesses(pokemonTypes);

    } catch (error) {
        console.error("Erreur lors du chargement du Pokémon :", error);
    }
});

async function displayStrengthsAndWeaknesses(types: string[]) {
    const strengths = new Set<string>();
    const weaknesses = new Set<string>();

    for (const type of types) {
        const response = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
        const data = await response.json();

        data.damage_relations.double_damage_to.forEach((t: any) => strengths.add(t.name));
        data.damage_relations.double_damage_from.forEach((t: any) => weaknesses.add(t.name));
    }

    const strengthsContainer = document.getElementById("pokemon-strengths") as HTMLElement;
    const weaknessesContainer = document.getElementById("pokemon-weaknesses") as HTMLElement;

    strengthsContainer.innerHTML = Array.from(strengths)
        .map((type) => `<img src="https://raw.githubusercontent.com/msikma/pokesprite/master/misc/types/gen8/${type}.png" alt="${type}">`)
        .join("");

    weaknessesContainer.innerHTML = Array.from(weaknesses)
        .map((type) => `<img src="https://raw.githubusercontent.com/msikma/pokesprite/master/misc/types/gen8/${type}.png" alt="${type}">`)
        .join("");
}
document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const pokemonId: string | null = urlParams.get("id");

    if (!pokemonId) {
        document.querySelector(".details-container")!.innerHTML = "<p>Pokémon introuvable.</p>";
        return;
    }

    try {
        const API_URL = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`;
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Problème lors du chargement des données.");
        
        const data: any = await response.json();
        const translatedName = await fetchPokemonTranslation(data.name);

        const pokemonName = document.getElementById("pokemon-name") as HTMLElement;
        pokemonName.textContent = translatedName.toUpperCase();
    } catch (error) {
        console.error("Erreur lors du chargement du Pokémon :", error);
    }
});

async function fetchPokemonTranslation(pokemonName: string): Promise<string> {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`);
        const data = await response.json();
        const frenchEntry = data.names.find((entry: { language: { name: string } }) => entry.language.name === "fr");
        return frenchEntry ? frenchEntry.name : pokemonName;
    } catch (error) {
        console.error("Erreur lors de la traduction :", error);
        return pokemonName;
    }
}


interface Pokemon {
    id: number;
    name: string;
    sprites: string;
    types: string[];
}
