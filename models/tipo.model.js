module.exports = (sequelize, Sequelize) => {
    const Tipo = sequelize.define("tipo", {
        nombre: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        }
    });

    return Tipo;
};
