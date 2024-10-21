module.exports = app => {
    app.use('/pokemons', require('./pokemon.routes'))
    app.use('/tipos', require('./tipo.routes'))
    app.use('/habilidades', require('./habilidad.routes'))
};
