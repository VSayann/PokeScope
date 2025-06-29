require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const sequelize = require("./config/database");
const cors = require("cors");
const favoriteRoutes = require("./routes/favoriteRoutes");

const app = express();
const axios = require("axios");

app.get("/api/pokemons", async (req, res) => {
    try {
        const response = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=151");
        const pokemons = response.data.results;

        const detailedPokemons = await Promise.all(
            pokemons.map(async (pokemon, index) => {
                const pokeDetails = await axios.get(pokemon.url);
                return {
                    id: index + 1,
                    name: pokeDetails.data.name,
                    sprite: pokeDetails.data.sprites.front_default,
                    types: pokeDetails.data.types.map((t) => t.type.name),
                };
            })
        );

        res.json(detailedPokemons);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des Pokémon." });
    }
});

app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

app.use("/favorites", favoriteRoutes);

const errorHandler = require("./middlewares/errorHandler");
app.use(errorHandler);

sequelize.sync().then(() => {
    app.listen(3000, () => console.log("🚀 Serveur démarré sur http://localhost:3000"));
});
