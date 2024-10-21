const db = require("../models");

// Listar todos los tipos
exports.listTipos = async (req, res) => {
    try {
        const tipos = await db.tipo.findAll();
        res.json(tipos);
    } catch (error) {
        sendError500(error, res);
    }
};

// Obtener un tipo por ID
exports.getTipoById = async (req, res) => {
    const id = req.params.id;
    try {
        const tipo = await db.tipo.findByPk(id);
        if (!tipo) {
            return res.status(404).json({ msg: 'Tipo no encontrado' });
        }
        res.json(tipo);
    } catch (error) {
        sendError500(error, res);
    }
};

// Crear un nuevo tipo
exports.createTipo = async (req, res) => {
    const { nombre } = req.body;
    if (!nombre) {
        return res.status(400).json({ msg: 'El nombre del tipo es requerido' });
    }

    try {
        const nuevoTipo = await db.tipo.create({ nombre });
        res.status(201).json({ id: nuevoTipo.id, msg: 'Tipo creado correctamente' });
    } catch (error) {
        sendError500(error, res);
    }
};

// Actualizar un tipo por ID
exports.updateTipo = async (req, res) => {
    const id = req.params.id;
    const { nombre } = req.body;

    try {
        const tipo = await getTipoOr404(id, res);
        if (!tipo) {
            return;
        }

        tipo.nombre = nombre || tipo.nombre;
        await tipo.save();
        res.json({ msg: 'Tipo actualizado correctamente' });
    } catch (error) {
        sendError500(error, res);
    }
};

// Eliminar un tipo por ID
exports.deleteTipo = async (req, res) => {
    const id = req.params.id;
    try {
        const tipo = await getTipoOr404(id, res);
        if (!tipo) {
            return;
        }

        await tipo.destroy();
        res.json({ msg: 'Tipo eliminado correctamente' });
    } catch (error) {
        sendError500(error, res);
    }
};

// Funciones auxiliares
async function getTipoOr404(id, res) {
    const tipo = await db.tipo.findByPk(id);
    if (!tipo) {
        res.status(404).json({ msg: 'Tipo no encontrado' });
        return null;
    }
    return tipo;
}

function sendError500(error, res) {
    res.status(500).json({ error: error.message });
}
