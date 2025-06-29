const Favorite = require("../models/favorite");

exports.addFavorite = async (req, res) => {
    const { user_id, pokemon_id } = req.body;
    try {
        const favorite = await Favorite.create({ user_id, pokemon_id });
        res.status(201).json(favorite);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de l'ajout du favori" });
    }
};

exports.getFavorites = async (req, res) => {
    const { user_id } = req.params;
    try {
        const favorites = await Favorite.findAll({ where: { user_id } });
        res.json(favorites);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la récupération des favoris" });
    }
};

exports.deleteFavorite = async (req, res) => {
    const { user_id, pokemon_id } = req.body;
    try {
        const deleted = await Favorite.destroy({ where: { user_id, pokemon_id } });
        if (deleted) {
            res.json({ message: "Favori supprimé avec succès" });
        } else {
            res.status(404).json({ error: "Favori non trouvé" });
        }
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la suppression du favori" });
    }
};
