import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ListaPokemon from './pages/pokemons/ListaPokemon.jsx';
import FormPokemon from './pages/pokemons/FormPokemon.jsx';
import CatalogoPokemon from './pages/pokemons/catalogoPokemon.jsx';
import DetailPokemon from './pages/pokemons/detailpokemon.jsx';
import FotoPokemon from './pages/pokemons/FotoPokemon.jsx';
import AgregarTipo from './pages/tipos/FormTipos.jsx';
import AgregarHabilidad from './pages/habilidad/FormHabilidades.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';

const router = createBrowserRouter([
  {
    path: "/",
    element: <CatalogoPokemon />,
  },
  {
    path: "/pokemons",
    element: <ListaPokemon />,
  },
  {
    path: "/pokemons/create",
    element: <FormPokemon />, // Formulario para crear un nuevo Pokémon
  },
  {
    path: "/pokemons/:id/edit", // Ruta para editar un Pokémon existente
    element: <FormPokemon />,
  },
  {
    path: "/pokemons/:id", // Ruta para el detalle del Pokémon
    element: <DetailPokemon />,
  },
  {
    path: "/pokemons/:id/foto",
    element: <FotoPokemon />, // Ruta para subir la foto del Pokémon
  },
  {
    path: "/tipos/create", // Ruta para el formulario de agregar tipos
    element: <AgregarTipo />,
  },
  {
    path: "/habilidades/create", // Nueva ruta para agregar habilidades
    element: <AgregarHabilidad />,
},
  
  
]);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
