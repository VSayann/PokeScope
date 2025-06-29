document.addEventListener("DOMContentLoaded", async () => {
    const pokemonListContainer = document.getElementById("pokemon-list") as HTMLElement;
    const teamContainer = document.getElementById("team") as HTMLElement;
    const suggestionsContainer = document.getElementById("team-suggestions") as HTMLElement;

    let team: Pokemon[] = JSON.parse(localStorage.getItem("team") || "[]");

    async function fetchPokemonList() {
        for (let i = 1; i <= 250; i++) {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
            const data = await response.json();

            const pokemonElement = document.createElement("div");
            pokemonElement.classList.add("pokemon-item");
            pokemonElement.innerHTML = `
                <img src="${data.sprites.front_default}" alt="${data.name}">
                <p>${data.name}</p>
            `;
            pokemonElement.addEventListener("click", () => addPokemonToTeam(data));
            pokemonListContainer.appendChild(pokemonElement);
        }
    }

    async function addPokemonToTeam(data: any) {
        if (team.length >= 6) {
            alert("Vous ne pouvez avoir que 6 Pokémon dans votre équipe !");
            return;
        }
    
        const newPokemon: Pokemon = {
            id: data.id,
            name: data.name,
            sprite: data.sprites.front_default,
            types: data.types.map((t: { type: { name: string } }) => t.type.name),
            stats: data.stats.map((s: { base_stat: number }) => s.base_stat),
        };
    
        team.push(newPokemon);
        localStorage.setItem("team", JSON.stringify(team));
        renderTeam();
        updateTeamSuggestions();
    }

    function renderTeam() {
        teamContainer.innerHTML = "";

        if (team.length === 0) {
            teamContainer.innerHTML = "<p>Aucun Pokémon sélectionné.</p>";
            return;
        }

        team.forEach((pokemon, index) => {
            const teamMember = document.createElement("div");
            teamMember.classList.add("team-member", "fade-in");
            teamMember.innerHTML = `
                <img src="${pokemon.sprite}" alt="${pokemon.name}">
                <p>${pokemon.name}</p>
                <div class="pokemon-stats">
                    <p>❤️ HP: ${pokemon.stats[0]}</p>
                    <p>⚔️ ATK: ${pokemon.stats[1]}</p>
                    <p>🛡️ DEF: ${pokemon.stats[2]}</p>
                </div>
                <button class="remove-btn" data-index="${index}">✕</button>
            `;
            teamContainer.appendChild(teamMember);
        });

        document.querySelectorAll(".remove-btn").forEach(button => {
            button.addEventListener("click", (event) => {
                const index = parseInt((event.target as HTMLElement).getAttribute("data-index") || "0", 10);
                team.splice(index, 1);
                localStorage.setItem("team", JSON.stringify(team));
                renderTeam();
                updateTeamSuggestions();
            });
        });
    }

    function updateTeamSuggestions() {
        suggestionsContainer.innerHTML = "<h3>Suggestions d’équipe</h3>";
        if (team.length === 0) {
            suggestionsContainer.innerHTML += "<p>Aucune suggestion pour l’instant.</p>";
            return;
        }

        let typeCounts: { [key: string]: number } = {};
        team.forEach(pokemon => {
            pokemon.types.forEach(type => {
                typeCounts[type] = (typeCounts[type] || 0) + 1;
            });
        });

        let dominantType = Object.keys(typeCounts).reduce((a, b) => (typeCounts[a] > typeCounts[b] ? a : b), "");

        if (dominantType) {
            suggestionsContainer.innerHTML += `<p>Votre équipe est principalement de type <strong>${dominantType}</strong>.</p>`;
            suggestionsContainer.innerHTML += "<p>Ajoutez un Pokémon défensif contre ses faiblesses !</p>";
        }
    }

    await fetchPokemonList();
    renderTeam();
    updateTeamSuggestions();
});
interface Pokemon {
    id: number;
    name: string;
    sprites: string;
    types: string[];
    stats: number[];
}


interface Pokemon {
	id: number;
	name: string;
	sprites: string;
	types: string[];
	stats: number[];
}

