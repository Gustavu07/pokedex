const express = require('express');
const router = express.Router();

const tipoController = require('../controllers/tipo.controller');

router.get('/', tipoController.listTipos);
router.get('/:id', tipoController.getTipoById);
// Crear un nuevo tipo
router.post('/', tipoController.createTipo);
router.put('/:id', tipoController.updateTipo);
// Eliminar un tipo por ID
router.delete('/:id', tipoController.deleteTipo);

module.exports = router