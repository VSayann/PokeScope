const { Sequelize } = require("sequelize");
require("dotenv").config();


const net = require("net");

const testConnection = net.createConnection({ port: 5432, host: process.env.DB_HOST }, () => {
    console.log("✅ Connexion réseau à PostgreSQL réussie !");
    testConnection.end();
});

testConnection.on("error", (err) => {
    console.error("❌ Impossible de se connecter à PostgreSQL :", err.message);
});

const sequelize = new Sequelize(
    process.env.DB_NAME || "pokemon",
    process.env.DB_USER || "user",
    process.env.DB_PASSWORD || "password",
    {
        host: process.env.DB_HOST,
        dialect: "postgres",
        port: process.env.DB_PORT || 5432,
        logging: console.log,
    }
);

module.exports = sequelize;