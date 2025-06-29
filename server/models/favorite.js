const { DataTypes } = require("sequelize");
const sequelize = require("../config/database")

const Favorite = sequelize.define("Favorite", {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    pokemon_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

module.exports = Favorite;
