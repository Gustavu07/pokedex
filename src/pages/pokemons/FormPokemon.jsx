import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

const FormPokemon = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    // Estados para los campos del formulario
    const [nombre, setNombre] = useState('');
    const [nroPokedex, setNroPokedex] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [hp, setHp] = useState('');
    const [attack, setAttack] = useState('');
    const [defense, setDefense] = useState('');
    const [spAttack, setSpAttack] = useState('');
    const [spDefense, setSpDefense] = useState('');
    const [speed, setSpeed] = useState('');
    const [nivelEvolucion, setNivelEvolucion] = useState('');
    const [idEvPrevia, setIdEvPrevia] = useState('');
    const [idEvSiguiente, setIdEvSiguiente] = useState('');
    const [validated, setValidated] = useState(false);

    // Estados para tipos y habilidades
    const [tipos, setTipos] = useState([]);
    const [habilidades, setHabilidades] = useState([]);
    const [selectedTipos, setSelectedTipos] = useState([]);
    const [selectedHabilidades, setSelectedHabilidades] = useState([]);

    // Obtener Pokémon por ID si estamos editando
    useEffect(() => {
        if (id) {
            getPokemonById();
        }
    }, [id]);

    const getPokemonById = () => {
        axios.get(`http://localhost:3000/pokemons/${id}`)
            .then(res => {
                const pokemon = res.data;
                setNombre(pokemon.nombre);
                setNroPokedex(pokemon.nroPokedex);
                setDescripcion(pokemon.descripcion);
                setHp(pokemon.hp);
                setAttack(pokemon.attack);
                setDefense(pokemon.defense);
                setSpAttack(pokemon.spattack);
                setSpDefense(pokemon.spdefense);
                setSpeed(pokemon.speed);
                setNivelEvolucion(pokemon.nivelEvolucion);
                setIdEvPrevia(pokemon.evolucionPrevia ? pokemon.evolucionPrevia.id : '');
                setIdEvSiguiente(pokemon.evolucionSiguiente ? pokemon.evolucionSiguiente.id : '');
                setSelectedTipos(pokemon.tipos.map(tipo => tipo.id));
                setSelectedHabilidades(pokemon.habilidades.map(habilidad => habilidad.id));
            })
            .catch(error => {
                console.error("Error fetching Pokémon:", error);
            });
    };

    // Obtener la lista de tipos y habilidades
    useEffect(() => {
        axios.get('http://localhost:3000/tipos')
            .then(res => setTipos(res.data))
            .catch(error => console.error("Error fetching tipos:", error));

        axios.get('http://localhost:3000/habilidades')
            .then(res => setHabilidades(res.data))
            .catch(error => console.error("Error fetching habilidades:", error));
    }, []);

    const onGuardarClick = (e) => {
        const form = e.currentTarget;
        e.preventDefault();
        e.stopPropagation();
        setValidated(true);
    
        if (form.checkValidity() === false) {
            return;
        }
    
        // Construir objeto de Pokémon con los campos necesarios
        const pokemon = {
            nombre,
            nroPokedex,
            descripcion,
            hp,
            attack,
            defense,
            spattack: spAttack,
            spdefense: spDefense,
            speed,
            nivelEvolucion,
            // Convertir a número si se proporciona, o enviar null si está vacío
            evolucionPrevia: idEvPrevia ? parseInt(idEvPrevia, 10) : null,
            evolucionSiguiente: idEvSiguiente ? parseInt(idEvSiguiente, 10) : null,
            tipos: selectedTipos,
            habilidades: selectedHabilidades
        };
    
        if (id) {
            editPokemon(pokemon);
        } else {
            insertPokemon(pokemon);
        }
    };
    

    const editPokemon = (pokemon) => {
        axios.put(`http://localhost:3000/pokemons/${id}`, pokemon)
            .then(res => {
                console.log("Pokémon actualizado:", res.data);
                navigate('/pokemons');
            })
            .catch(error => {
                console.error("Error updating Pokémon:", error);
            });
    };

    const insertPokemon = (pokemon) => {
        axios.post('http://localhost:3000/pokemons', pokemon)
            .then(res => {
                console.log("Pokémon creado:", res.data);
                navigate('/pokemons');
            })
            .catch(error => {
                console.error("Error inserting Pokémon:", error);
            });
    };

    return (
        <Container>
            <Row className="mt-3 mb-3">
                <Col md={6}>
                    <Card>
                        <Card.Body>
                            <Card.Title>
                                <h2>Formulario Pokémon</h2>
                            </Card.Title>
                            <Form noValidate validated={validated} onSubmit={onGuardarClick}>
                                <Form.Group>
                                    <Form.Label>Nombre:</Form.Label>
                                    <Form.Control type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label>Número de Pokédex:</Form.Label>
                                    <Form.Control type="number" value={nroPokedex} onChange={(e) => setNroPokedex(e.target.value)} required />
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label>Descripción:</Form.Label>
                                    <Form.Control as="textarea" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required />
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label>HP:</Form.Label>
                                    <Form.Control type="number" value={hp} onChange={(e) => setHp(e.target.value)} required />
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label>Ataque:</Form.Label>
                                    <Form.Control type="number" value={attack} onChange={(e) => setAttack(e.target.value)} required />
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label>Defensa:</Form.Label>
                                    <Form.Control type="number" value={defense} onChange={(e) => setDefense(e.target.value)} required />
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label>Ataque Especial:</Form.Label>
                                    <Form.Control type="number" value={spAttack} onChange={(e) => setSpAttack(e.target.value)} required />
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label>Defensa Especial:</Form.Label>
                                    <Form.Control type="number" value={spDefense} onChange={(e) => setSpDefense(e.target.value)} required />
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label>Velocidad:</Form.Label>
                                    <Form.Control type="number" value={speed} onChange={(e) => setSpeed(e.target.value)} required />
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label>Evolución Previa (ID):</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        value={idEvPrevia} 
                                        onChange={(e) => setIdEvPrevia(e.target.value)} 
                                    />
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label>Evolución Siguiente (ID):</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        value={idEvSiguiente} 
                                        onChange={(e) => setIdEvSiguiente(e.target.value)} 
                                    />
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label>Tipos:</Form.Label>
                                    <Form.Control as="select" multiple value={selectedTipos} onChange={(e) => setSelectedTipos([...e.target.selectedOptions].map(option => option.value))}>
                                        {tipos.map(tipo => (
                                            <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label>Habilidades:</Form.Label>
                                    <Form.Control as="select" multiple value={selectedHabilidades} onChange={(e) => setSelectedHabilidades([...e.target.selectedOptions].map(option => option.value))}>
                                        {habilidades.map(habilidad => (
                                            <option key={habilidad.id} value={habilidad.id}>{habilidad.nombre}</option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>

                                <Button variant="primary" type="submit">Guardar</Button>
                                <Button variant="secondary" onClick={() => navigate('/pokemons')}>Cancelar</Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default FormPokemon;
