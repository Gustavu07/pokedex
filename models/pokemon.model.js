module.exports = (sequelize, Sequelize) => {
    const Pokemon = sequelize.define("pokemon", {
        nombre: {
            type: Sequelize.STRING,
            allowNull: false
        },
        nroPokedex: {
            type: Sequelize.INTEGER,
            allowNull: false,
            unique: true
        },
        descripcion: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        hp: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        attack: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        defense: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        spattack: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        spdefense: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        speed: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        nivelEvolucion: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        idEvPrevia: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        idEvSiguiente: {
            type: Sequelize.INTEGER,
            allowNull: true
        }
    });

    return Pokemon;
};
