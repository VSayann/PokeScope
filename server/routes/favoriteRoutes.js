const express = require("express");
const { body, param } = require("express-validator");
const router = express.Router();
const favoriteController = require("../controllers/favoriteController");

router.post(
    "/",
    [
        body("user_id").isInt().withMessage("user_id doit être un nombre entier"),
        body("pokemon_id").isInt().withMessage("pokemon_id doit être un nombre entier"),
    ],
    favoriteController.addFavorite
);

router.get(
    "/:user_id",
    param("user_id").isInt().withMessage("user_id doit être un nombre entier"),
    favoriteController.getFavorites
);

router.delete(
    "/",
    [
        body("user_id").isInt().withMessage("user_id doit être un nombre entier"),
        body("pokemon_id").isInt().withMessage("pokemon_id doit être un nombre entier"),
    ],
    favoriteController.deleteFavorite
);

module.exports = router;