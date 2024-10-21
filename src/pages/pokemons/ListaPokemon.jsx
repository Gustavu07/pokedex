import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row, Table, Navbar, Nav, Form, FormControl } from "react-bootstrap";
import { Link } from "react-router-dom";

const ListaPokemon = () => {
    const [listaPokemons, setListaPokemons] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        getListaPokemons();
        document.title = "Catálogo de Pokémon Administración";
    }, []);

    const getListaPokemons = () => {
        axios.get('http://localhost:3000/pokemons')
            .then(res => {
                setListaPokemons(res.data);
            }).catch(error => {
                console.log(error);
            });
    };

    const eliminar = (id) => {
        const confirm = window.confirm("¿Está seguro de eliminar el registro?");
        if (!confirm) {
            return;
        }
        axios.delete(`http://localhost:3000/pokemons/${id}`)
            .then(res => {
                getListaPokemons(res.data);
            }).catch(error => {
                console.log(error);
            });
    };

    // Función para filtrar los Pokémon según el término de búsqueda
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <>
            <Navbar bg="light" expand="lg" className="shadow-sm mb-4">
                <Container>
                    <Navbar.Brand as={Link} to="/">Catálogo Pokémon</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to="/">Inicio</Nav.Link>
                            <Nav.Link as={Link} to="/pokemons">Administración</Nav.Link>
                            <Nav.Link as={Link} to="/pokemons/create">Crear Pokemon</Nav.Link>
                            <Nav.Link as={Link} to="/tipos/create">Agregar Tipo</Nav.Link>
                            <Nav.Link as={Link} to="/habilidades/create">Agregar Habilidad</Nav.Link>
                        </Nav>
                        <Form className="d-flex">
                            <FormControl
                                type="search"
                                placeholder="Buscar Pokémon"
                                className="me-2"
                                aria-label="Search"
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                            <Button variant="outline-success">Buscar</Button>
                        </Form>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Container className="mt-3 mb-3">
                <Row>
                    <Col>
                        <Card className="shadow-sm">
                            <Card.Body>
                                <Card.Title className="text-center">
                                    <h2>Catálogo de Pokémon</h2>
                                </Card.Title>
                                <Table striped bordered hover responsive className="mt-3">
                                    <thead className="table-dark">
                                        <tr>
                                            <th>Imagen</th>
                                            <th>ID</th>
                                            <th>Nombre</th>
                                            <th>Tipo</th>
                                            <th>HP</th>
                                            <th>Habilidades</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {listaPokemons
                                            .filter(pokemon =>
                                                pokemon.nombre.toLowerCase().includes(searchTerm.toLowerCase())
                                            )
                                            .map(pokemon => (
                                                <tr key={pokemon.id}>
                                                    <td>
                                                        <img 
                                                            src={`http://localhost:3000/pokemons/${pokemon.id}.jpg`} 
                                                            alt={pokemon.nombre} 
                                                            className="img-fluid rounded-circle" 
                                                            style={{ width: "80px", height: "80px", objectFit: "cover" }} 
                                                        />
                                                    </td>
                                                    <td>{pokemon.id}</td>
                                                    <td>{pokemon.nombre}</td>
                                                    <td>
                                                        {pokemon.tipos && pokemon.tipos.length > 0
                                                            ? pokemon.tipos.map(tipo => tipo.nombre).join(', ')
                                                            : 'Sin tipo'}
                                                    </td>
                                                    <td>{pokemon.hp}</td>
                                                    <td>
                                                        {pokemon.habilidades && pokemon.habilidades.length > 0
                                                            ? pokemon.habilidades.map(habilidad => habilidad.nombre).join(', ')
                                                            : 'Sin habilidades'}
                                                    </td>
                                                    <td>
                                                        <div className="d-flex justify-content-around">
                                                            <Link className="btn btn-primary btn-sm" to={`/pokemons/${pokemon.id}/edit`}>Editar</Link>
                                                            <Button variant="danger" size="sm" onClick={() => eliminar(pokemon.id)}>Eliminar</Button>
                                                            <Link className="btn btn-success btn-sm" to={`/pokemons/${pokemon.id}/foto`}>Subir Imagen</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default ListaPokemon;
