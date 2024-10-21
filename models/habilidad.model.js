module.exports = (sequelize, Sequelize) => {
    const Habilidad = sequelize.define("habilidad", {
        nombre: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        }
    });

    return Habilidad;
};
