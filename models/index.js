const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD,
    {
        host: dbConfig.HOST,
        port: dbConfig.PORT,
        dialect: "mysql",
    }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.pokemon = require("./pokemon.model.js")(sequelize, Sequelize);
db.habilidad = require("./habilidad.model.js")(sequelize, Sequelize);
db.tipo = require("./tipo.model.js")(sequelize, Sequelize);
// Relaciones
// Un Pokemon puede tener 1 o 2 tipos
db.pokemon.belongsToMany(db.tipo, { through: "pokemon_tipo", as: "tipos", foreignKey: "pokemonId" });
db.tipo.belongsToMany(db.pokemon, { through: "pokemon_tipo", as: "pokemones", foreignKey: "tipoId" });

// Un Pokemon puede tener de 2 a 3 habilidades
db.pokemon.belongsToMany(db.habilidad, { through: "pokemon_habilidad", as: "habilidades", foreignKey: "pokemonId" });
db.habilidad.belongsToMany(db.pokemon, { through: "pokemon_habilidad", as: "pokemones", foreignKey: "habilidadId" });

// Relación 1 a 1 con la misma tabla (Evoluciones)
// Un Pokémon puede evolucionar de otro (idEvPrevio) y evolucionar a otro (idEvSiguiente)
db.pokemon.hasOne(db.pokemon, { as: "evolucionPrevia", foreignKey: "idEvPrevia" });
db.pokemon.hasOne(db.pokemon, { as: "evolucionSiguiente", foreignKey: "idEvSiguiente" });

module.exports = db;