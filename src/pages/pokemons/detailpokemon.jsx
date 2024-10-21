import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom"; // Importa Link de react-router-dom
import { Card, Container, Row, Col, Table, ProgressBar, Navbar, Nav } from "react-bootstrap";

// Funciones para calcular los stats máximos y mínimos al nivel 100
const calcularHP = (baseStat, iv, ev) => {
    return Math.floor(((2 * baseStat + iv + Math.floor(ev / 4)) * 100) / 100) + 100 + 10;
};

const calcularStat = (baseStat, iv, ev, naturaleza) => {
    return Math.floor((Math.floor(((2 * baseStat + iv + Math.floor(ev / 4)) * 100) / 100) + 5) * naturaleza);
};

const DetailPokemon = () => {
    const { id } = useParams();
    const [pokemon, setPokemon] = useState(null);
    const [statsCalculados, setStatsCalculados] = useState(null);
    const [lineaEvolutiva, setLineaEvolutiva] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:3000/pokemons/${id}`)
            .then(res => {
                setPokemon(res.data);
                calcularValoresStats(res.data);
                return axios.get(`http://localhost:3000/pokemons/${id}/evolucion`);
            })
            .then(res => {
                setLineaEvolutiva(res.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, [id]);

    const calcularValoresStats = (pokeData) => {
        const ivMin = 0;
        const ivMax = 31;
        const evMin = 0;
        const evMax = 252;
        const naturalezaNeutral = 1.0;
        const naturalezaAumentada = 1.1;
        const naturalezaReducida = 0.9;

        const hpMin = calcularHP(pokeData.hp, ivMin, evMin);
        const hpMax = calcularHP(pokeData.hp, ivMax, evMax);

        const calcularRango = (statBase) => ({
            minMenos: calcularStat(statBase, ivMin, evMin, naturalezaReducida),
            min: calcularStat(statBase, ivMax, evMin, naturalezaNeutral),
            max: calcularStat(statBase, ivMax, evMax, naturalezaNeutral),
            maxMas: calcularStat(statBase, ivMax, evMax, naturalezaAumentada)
        });

        setStatsCalculados({
            hp: { min: hpMin, max: hpMax },
            attack: calcularRango(pokeData.attack),
            defense: calcularRango(pokeData.defense),
            spAttack: calcularRango(pokeData.spattack),
            spDefense: calcularRango(pokeData.spdefense),
            speed: calcularRango(pokeData.speed)
        });
    };

    if (!pokemon || !statsCalculados) {
        return <p>Cargando...</p>;
    }

    return (
        <>
            <Navbar bg="danger" expand="lg" className="shadow">
                <Container>
                    <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
                        <img 
                            src="https://origamiami.com/wp-content/uploads/2021/06/display-pokebola.png" // Reemplaza con la URL de la imagen de la Pokébola
                            alt="Pokébola"
                            style={{ width: "50px", height: "50px", marginRight: "8px" }} 
                        />
                        Catálogo Pokémon
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to="/" className="text-light">Inicio</Nav.Link>
                            <Nav.Link as={Link} to="/pokemons" className="text-light">Administración</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Container className="mt-5">
                <Card className="shadow border-0 rounded">
                    <Card.Header className="text-center text-uppercase bg-warning text-white">
                        <h2>{pokemon.nombre}</h2>
                    </Card.Header>
                    <Card.Body>
                        <Row className="align-items-center">
                            <Col md={4} className="text-center">
                                <img 
                                    src={`http://localhost:3000/pokemons/${pokemon.id}.jpg`} 
                                    alt={pokemon.nombre} 
                                    className="img-fluid rounded-circle mb-3" 
                                    style={{ width: "150px", height: "150px", objectFit: "cover" }} 
                                />
                                <div>
                                    <strong>ID:</strong> {pokemon.id}
                                </div>
                                <div>
                                    <strong>Número en Pokédex:</strong> {pokemon.nroPokedex}
                                </div>
                                <div>
                                    <strong>Descripción:</strong> {pokemon.descripcion}
                                </div>
                            </Col>
                            <Col md={8}>
                                <Table striped bordered hover responsive>
                                    <thead>
                                        <tr className="table-warning">
                                            <th>Stat</th>
                                            <th>Barra de Progreso</th>
                                            <th>min-</th>
                                            <th>min</th>
                                            <th>max</th>
                                            <th>max+</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>HP</td>
                                            <td>
                                                <ProgressBar now={pokemon.hp} max={255} label={`${pokemon.hp}`} variant="success" />
                                            </td>
                                            <td>-</td>
                                            <td>{statsCalculados.hp.min}</td>
                                            <td>{statsCalculados.hp.max}</td>
                                            <td>-</td>
                                        </tr>
                                        <tr>
                                            <td>Attack</td>
                                            <td>
                                                <ProgressBar now={pokemon.attack} max={255} label={`${pokemon.attack}`} variant="info" />
                                            </td>
                                            <td>{statsCalculados.attack.minMenos}</td>
                                            <td>{statsCalculados.attack.min}</td>
                                            <td>{statsCalculados.attack.max}</td>
                                            <td>{statsCalculados.attack.maxMas}</td>
                                        </tr>
                                        <tr>
                                            <td>Defense</td>
                                            <td>
                                                <ProgressBar now={pokemon.defense} max={255} label={`${pokemon.defense}`} variant="warning" />
                                            </td>
                                            <td>{statsCalculados.defense.minMenos}</td>
                                            <td>{statsCalculados.defense.min}</td>
                                            <td>{statsCalculados.defense.max}</td>
                                            <td>{statsCalculados.defense.maxMas}</td>
                                        </tr>
                                        <tr>
                                            <td>Sp. Attack</td>
                                            <td>
                                                <ProgressBar now={pokemon.spattack} max={255} label={`${pokemon.spattack}`} variant="danger" />
                                            </td>
                                            <td>{statsCalculados.spAttack.minMenos}</td>
                                            <td>{statsCalculados.spAttack.min}</td>
                                            <td>{statsCalculados.spAttack.max}</td>
                                            <td>{statsCalculados.spAttack.maxMas}</td>
                                        </tr>
                                        <tr>
                                            <td>Sp. Defense</td>
                                            <td>
                                                <ProgressBar now={pokemon.spdefense} max={255} label={`${pokemon.spdefense}`} variant="secondary" />
                                            </td>
                                            <td>{statsCalculados.spDefense.minMenos}</td>
                                            <td>{statsCalculados.spDefense.min}</td>
                                            <td>{statsCalculados.spDefense.max}</td>
                                            <td>{statsCalculados.spDefense.maxMas}</td>
                                        </tr>
                                        <tr>
                                            <td>Speed</td>
                                            <td>
                                                <ProgressBar now={pokemon.speed} max={255} label={`${pokemon.speed}`} variant="dark" />
                                            </td>
                                            <td>{statsCalculados.speed.minMenos}</td>
                                            <td>{statsCalculados.speed.min}</td>
                                            <td>{statsCalculados.speed.max}</td>
                                            <td>{statsCalculados.speed.maxMas}</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>

                        {/* Sección de la línea evolutiva */}
                        <Row className="mt-4">
                            <Col>
                                <h4 className="text-center">Línea Evolutiva</h4>
                                <div className="d-flex justify-content-center">
                                    {lineaEvolutiva.map((evolucionId, index) => (
                                        <div key={index} className="text-center mx-2">
                                            <Link to={`/pokemons/${evolucionId}`}>
                                                <img
                                                    src={`http://localhost:3000/pokemons/${evolucionId}.jpg`}
                                                    alt={`Evolución ${evolucionId}`}
                                                    className="img-fluid rounded mb-2"
                                                    style={{ width: "100px", height: "100px", objectFit: "cover" }}
                                                />
                                            </Link>
                                            <p>Pokémon {evolucionId}</p>
                                        </div>
                                    ))}
                                </div>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
};

export default DetailPokemon;
