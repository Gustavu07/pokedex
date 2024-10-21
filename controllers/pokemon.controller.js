const db = require("../models");
const { isRequestValid } = require("../utils/request.utils");

// Listar todos los Pokémon junto con sus tipos y habilidades
exports.listPokemons = async (req, res) => {
    try {
        const pokemons = await db.pokemon.findAll({
            include: [
                { model: db.tipo, as: 'tipos' },
                { model: db.habilidad, as: 'habilidades' }
            ]
        });
        res.json(pokemons);
    } catch (error) {
        sendError500(error, res);
    }
};

// Obtener un Pokémon por ID junto con sus tipos y habilidades
exports.getPokemonById = async (req, res) => {
    const id = req.params.id;
    try {
        const pokemon = await db.pokemon.findByPk(id, {
            include: [
                { model: db.tipo, as: 'tipos' },
                { model: db.habilidad, as: 'habilidades' }
            ]
        });

        if (!pokemon) {
            return res.status(404).json({ msg: 'Pokémon no encontrado' });
        }
        res.json(pokemon);
    } catch (error) {
        sendError500(error, res);
    }
};

// Crear un Pokémon, con la posibilidad de asociar tipos y habilidades
exports.createPokemon = async (req, res) => {
    const requiredFields = ['nombre', 'nroPokedex', 'descripcion', 'hp', 'attack', 'defense', 'spattack', 'spdefense', 'speed'];

    if (!isRequestValid(requiredFields, req.body, res)) {
        return;
    }

    console.log("Datos recibidos para crear el Pokémon:", req.body);

    try {
        const { nombre, nroPokedex, descripcion, hp, attack, defense, spattack, spdefense, speed, tipos, habilidades } = req.body;

        const nuevoPokemon = await db.pokemon.create({
            nombre,
            nroPokedex,
            descripcion,
            hp,
            attack,
            defense,
            spattack,
            spdefense,
            speed
        });

        console.log("Pokémon creado con éxito:", nuevoPokemon);

        // Si hay tipos y habilidades, asociarlos al Pokémon
        if (tipos) {
            await nuevoPokemon.setTipos(tipos);
        }
        if (habilidades) {
            await nuevoPokemon.setHabilidades(habilidades);
        }

        res.status(201).json({ id: nuevoPokemon.id, msg: 'Pokémon creado correctamente' });
    } catch (error) {
        console.error("Error al crear el Pokémon:", error);
        sendError500(error, res);
    }
};


// Actualizar completamente un Pokémon, con la posibilidad de actualizar sus tipos y habilidades
exports.updatePokemonPut = async (req, res) => {
    const id = req.params.id;
    const requiredFields = ['nombre', 'nroPokedex', 'descripcion', 'hp', 'attack', 'defense', 'spattack', 'spdefense', 'speed'];

    if (!isRequestValid(requiredFields, req.body, res)) {
        return;
    }

    try {
        const pokemon = await getPokemonOr404(id, res);
        if (!pokemon) {
            return;
        }

        pokemon.nombre = req.body.nombre;
        pokemon.nroPokedex = req.body.nroPokedex;
        pokemon.descripcion = req.body.descripcion;
        pokemon.hp = req.body.hp;
        pokemon.attack = req.body.attack;
        pokemon.defense = req.body.defense;
        pokemon.spattack = req.body.spattack;
        pokemon.spdefense = req.body.spdefense;
        pokemon.speed = req.body.speed;

        await pokemon.save();

        // Si se proporcionan tipos y habilidades, actualizarlos
        if (req.body.tipos) {
            await pokemon.setTipos(req.body.tipos);
        }
        if (req.body.habilidades) {
            await pokemon.setHabilidades(req.body.habilidades);
        }

        res.json({ msg: 'Pokémon actualizado correctamente' });
    } catch (error) {
        sendError500(error, res);
    }
};

// Actualizar parcialmente un Pokémon
exports.updatePokemonPatch = async (req, res) => {
    const id = req.params.id;
    try {
        const pokemon = await getPokemonOr404(id, res);
        if (!pokemon) {
            return;
        }

        // Actualizar solo los campos proporcionados
        pokemon.nombre = req.body.nombre || pokemon.nombre;
        pokemon.nroPokedex = req.body.nroPokedex || pokemon.nroPokedex;
        pokemon.descripcion = req.body.descripcion || pokemon.descripcion;
        pokemon.hp = req.body.hp || pokemon.hp;
        pokemon.attack = req.body.attack || pokemon.attack;
        pokemon.defense = req.body.defense || pokemon.defense;
        pokemon.spattack = req.body.spattack || pokemon.spattack;
        pokemon.spdefense = req.body.spdefense || pokemon.spdefense;
        pokemon.speed = req.body.speed || pokemon.speed;

        await pokemon.save();

        // Si se proporcionan tipos y habilidades, actualizarlos
        if (req.body.tipos) {
            await pokemon.setTipos(req.body.tipos);
        }
        if (req.body.habilidades) {
            await pokemon.setHabilidades(req.body.habilidades);
        }

        res.json({ msg: 'Pokémon actualizado parcialmente' });
    } catch (error) {
        sendError500(error, res);
    }
};

exports.deletePokemon = async (req, res) => {
    const id = req.params.id;
    try {
        const pokemon = await getPokemonOr404(id, res);
        if (!pokemon) {
            return;
        }

        await pokemon.destroy();
        res.json({ msg: 'Pokémon eliminado correctamente' });
    } catch (error) {
        sendError500(error, res);
    }
};

exports.uploadPicturePokemons = async (req, res) => {
    const id = req.params.id;

    try {
        // Buscar el Pokémon por ID
        const pokemon = await db.pokemon.findByPk(id);
        if (!pokemon) {
            return res.status(404).json({ msg: 'Pokémon no encontrado' });
        }

        // Verificar si se ha subido un archivo
        if (!req.files || !req.files.fotoPokemon) {
            return res.status(400).json({ msg: 'No se ha subido ninguna imagen' });
        }

        const file = req.files.fotoPokemon;
        const fileName = `${pokemon.id}.jpg`;
        const uploadPath = `public/pokemons/${fileName}`;

        // Mover el archivo a la carpeta destino
        file.mv(uploadPath, async (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error al mover el archivo', details: err.message });
            }

            // Actualizar la base de datos con el nombre del archivo
            pokemon.imagenUrl = `/pokemons/${fileName}`;
            await pokemon.save();

            res.json({ msg: 'Imagen subida exitosamente', pokemon });
        });
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor', details: error.message });
    }
};


exports.getLineaEvolutiva = async (req, res) => {
    const idPokemonActual = req.params.id;
    console.log(idPokemonActual);
    
    try {
        // Fetch the current Pokémon details
        let objPokemon = await db.pokemon.findByPk(idPokemonActual);

        if (!objPokemon) {
            return res.status(404).json({ msg: 'Pokémon no encontrado' });
        }

        const lineaEvolutiva = [];

        // Caso 2: Si el Pokémon final es el actual, buscamos hacia atrás
        while (objPokemon.idEvPrevia !== null) {
            lineaEvolutiva.unshift(objPokemon.idEvPrevia);  // Add to the start of the array
            objPokemon = await db.pokemon.findByPk(objPokemon.idEvPrevia);
        }

        // Reset objPokemon to the initial one for further traversal
        objPokemon = await db.pokemon.findByPk(idPokemonActual);

        // Add the current Pokémon to the array
        lineaEvolutiva.push(objPokemon.id);

        // Caso 1 y 3: Si tiene evoluciones siguientes, buscamos hacia adelante
        while (objPokemon.idEvSiguiente !== null) {
            objPokemon = await db.pokemon.findByPk(objPokemon.idEvSiguiente);
            lineaEvolutiva.push(objPokemon.id);  // Add to the end of the array
        }

        // Return the evolutionary line as a list of Pokémon IDs
        res.json(lineaEvolutiva);
    } catch (error) {
        sendError500(error, res);
    }
};



async function getPokemonOr404(id, res) {
    const pokemon = await db.pokemon.findByPk(id);
    if (!pokemon) {
        res.status(404).json({ msg: 'Pokémon no encontrado' });
        return null;
    }
    return pokemon;
}

function sendError500(error, res) {
    if (error.name === 'SequelizeValidationError') {
        const validationErrors = error.errors.map(err => err.message);
        return res.status(400).json({ error: 'Validation error', details: validationErrors });
    }
    res.status(500).json({ error: error.message });
}

