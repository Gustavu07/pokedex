const express = require('express');
const router = express.Router();
const habilidadController = require('../controllers/habilidad.controller');



router.get('/', habilidadController.listHabilidades);

// Obtener una habilidad por ID
router.get('/:id', habilidadController.getHabilidadById);

// Crear una nueva habilidad
router.post('/', habilidadController.createHabilidad);

// Actualizar una habilidad por ID (PUT - reemplazo completo)
router.put('/:id', habilidadController.updateHabilidad);

// Eliminar una habilidad por ID
router.delete('/:id', habilidadController.deleteHabilidad);

module.exports = router;