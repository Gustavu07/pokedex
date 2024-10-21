import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Card, Container, Navbar, Nav, Form, FormControl, Row, Col, Dropdown, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";

// Mapa de colores para cada tipo de Pokémon
const colorTipos = {
    Planta: "success",
    Fuego: "danger",
    Agua: "primary",
    Eléctrico: "warning",
    Volador: "info",
    Veneno: "purple",
    Normal: "secondary",
    // Agrega más tipos y colores aquí
};

const CatalogoPokemon = () => {
    const [listaPokemons, setListaPokemons] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filtroCriterio, setFiltroCriterio] = useState("nombre");

    useEffect(() => {
        getListaPokemons();
        document.title = "Catálogo de Pokémon";
    }, []);

    const getListaPokemons = () => {
        axios.get('http://localhost:3000/pokemons')
            .then(res => {
                setListaPokemons(res.data);
            }).catch(error => {
                console.log(error);
            });
    };

    // Función para filtrar y ordenar los Pokémon
    const filtrarPokemons = () => {
        let pokemonsFiltrados = listaPokemons.filter(pokemon => {
            if (filtroCriterio === "nombre") {
                return pokemon.nombre.toLowerCase().includes(searchTerm.toLowerCase());
            } else if (filtroCriterio === "numero") {
                return pokemon.nroPokedex.toString().includes(searchTerm);
            } else if (filtroCriterio === "tipo") {
                return pokemon.tipos && pokemon.tipos.some(tipo => 
                    tipo.nombre.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }
            return false;
        });

        // Ordenar Pokémon según el criterio seleccionado
        if (filtroCriterio === "nombre") {
            pokemonsFiltrados.sort((a, b) => a.nombre.localeCompare(b.nombre));
        } else if (filtroCriterio === "numero") {
            pokemonsFiltrados.sort((a, b) => a.nroPokedex - b.nroPokedex);
        }

        return pokemonsFiltrados;
    };

    // Función para manejar el cambio de criterio de filtrado
    const handleFiltroCriterioChange = (criterio) => {
        setFiltroCriterio(criterio);
    };

    return (
        <>
            <Navbar bg="danger" expand="lg" className="shadow">
                <Container>
                    <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
                        <img 
                            src="https://origamiami.com/wp-content/uploads/2021/06/display-pokebola.png" // Reemplaza con la URL de la imagen de la Pokébola
                            alt="Pokébola"
                            style={{ width: "60px", height: "60px", marginRight: "8px" }} 
                        />
                        Catálogo Pokémon
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to="/" className="text-light">Inicio</Nav.Link>
                            <Nav.Link as={Link} to="/pokemons" className="text-light">Administración</Nav.Link>
                        </Nav>
                        <Form className="d-flex">
                            <FormControl
                                type="search"
                                placeholder="Buscar Pokémon"
                                className="me-2"
                                aria-label="Search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Button variant="outline-light">Buscar</Button>
                        </Form>
                        <Dropdown onSelect={handleFiltroCriterioChange} className="ms-2">
                            <Dropdown.Toggle variant="dark" id="dropdown-basic">
                                {filtroCriterio === "nombre" ? "Nombre" : filtroCriterio === "numero" ? "Número Pokédex" : "Tipo"}
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item eventKey="nombre">Nombre</Dropdown.Item>
                                <Dropdown.Item eventKey="numero">Número Pokédex</Dropdown.Item>
                                <Dropdown.Item eventKey="tipo">Tipo</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Container className="mt-4 mb-4">
                <Row>
                    {filtrarPokemons().map(pokemon => (
                        <Col key={pokemon.id} md={4} className="mb-4">
                            <Card className="shadow-sm h-100" style={{ borderRadius: "15px", border: "1px solid rgba(0, 0, 0, 0.1)" }}>
                                <div className="text-center p-3">
                                    <img 
                                        src={`http://localhost:3000/pokemons/${pokemon.id}.jpg`} 
                                        alt={pokemon.nombre} 
                                        style={{ 
                                            width: "150px", 
                                            height: "150px", 
                                            objectFit: "cover", 
                                            borderRadius: "50%", 
                                            border: "3px solid rgba(0, 0, 0, 0.2)" 
                                        }} 
                                    />
                                </div>
                                <Card.Body className="text-center">
                                    <Card.Title className="fw-bold">{pokemon.nombre}</Card.Title>
                                    <Card.Text><strong>Nro Pokedex:</strong> {pokemon.nroPokedex}</Card.Text>
                                    {/* Mostrar los tipos de Pokémon con colores */}
                                    <Card.Text>
                                        <strong>Tipos:</strong>
                                        {pokemon.tipos.map(tipo => (
                                            <Badge 
                                                key={tipo.id} 
                                                bg={colorTipos[tipo.nombre] || "dark"} 
                                                className="me-1"
                                            >
                                                {tipo.nombre}
                                            </Badge>
                                        ))}
                                    </Card.Text>
                                    {/* Mostrar las habilidades de Pokémon */}
                                    <Link className="btn btn-primary mt-3" to={`/pokemons/${pokemon.id}`}>
                                        Ver Detalles
                                    </Link>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        </>
    );
};

export default CatalogoPokemon;
