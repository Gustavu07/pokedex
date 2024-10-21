import axios from "axios";
import { useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

const FotoPokemon = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Obtener el ID del Pokémon de la URL
    const [fotoPokemon, setFotoPokemon] = useState(null);
    const [validated, setValidated] = useState(false);

    // Manejar el cambio del archivo
    const onChangeFoto = (e) => {
        setFotoPokemon(e.target.files[0]);
    }

    // Manejar el envío del formulario
    const onGuardarClick = (e) => {
        const form = e.currentTarget;
        e.preventDefault();
        e.stopPropagation();

        setValidated(true);

        if (form.checkValidity() === false) {
            return;
        }

        const formData = new FormData();
        formData.append('fotoPokemon', fotoPokemon); // Nombre del campo del archivo

        // Realizar la petición POST para subir la imagen
        axios.post(`http://localhost:3000/pokemons/${id}/upload-picture`, formData)
            .then(res => {
                console.log(res.data);
                navigate(`/pokemons`); 
            }).catch(error => {
                console.log(error);
            });
    }

    return (
        <>
            
            <Container>
                <Row className="mt-3 mb-3">
                    <Col md={6}>
                        <Card>
                            <Card.Body>
                                <Card.Title>
                                    <h2>Subir Imagen de Pokémon</h2>
                                </Card.Title>
                                <Form noValidate validated={validated} onSubmit={onGuardarClick}>
                                    <Form.Group>
                                        <Form.Label>Seleccione una imagen:</Form.Label>
                                        <Form.Control 
                                            required 
                                            type="file" 
                                            onChange={onChangeFoto} 
                                            accept="image/*" // Limitar a archivos de imagen
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Por favor seleccione un archivo.
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group className="mt-3">
                                        <Button type="submit">Guardar Imagen</Button>
                                    </Form.Group>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default FotoPokemon;
