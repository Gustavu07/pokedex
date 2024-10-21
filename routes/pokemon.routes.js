const express = require("express");
const router = express.Router();
const pokemonController = require("../controllers/pokemon.controller");

// Rutas para las operaciones de Pokémon
router.get("/", pokemonController.listPokemons);         
router.get("/:id", pokemonController.getPokemonById);     
router.post("/", pokemonController.createPokemon);         
router.put("/:id", pokemonController.updatePokemonPatch);
router.patch("/:id", pokemonController.updatePokemonPut);
router.delete("/:id", pokemonController.deletePokemon);
router.post('/:id/upload-picture', pokemonController.uploadPicturePokemons);
router.get('/:id/evolucion', pokemonController.getLineaEvolutiva);

module.exports = router;

