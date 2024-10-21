import axios from "axios";
import { useState } from "react";
import { Button, Form, Container, Alert } from "react-bootstrap";

const AgregarTipo = () => {
    const [nombreTipo, setNombreTipo] = useState("");
    const [mensaje, setMensaje] = useState(null);
    const [error, setError] = useState(false);

    const handleAgregarTipo = (e) => {
        e.preventDefault();
        if (!nombreTipo.trim()) {
            setError(true);
            setMensaje("El nombre del tipo no puede estar vacío");
            return;
        }

        // Realizar la solicitud POST para agregar un nuevo tipo
        axios.post("http://localhost:3000/tipos", { nombre: nombreTipo })
            .then(() => {
                setMensaje("Tipo agregado con éxito");
                setError(false);
                setNombreTipo(""); // Limpiar el campo de entrada
            })
            .catch(err => {
                setError(true);
                setMensaje("Error al agregar el tipo");
                console.error(err);
            });
    };

    return (
        <Container className="mt-3">
            <h2>Agregar Tipo de Pokémon</h2>
            {mensaje && (
                <Alert variant={error ? "danger" : "success"}>
                    {mensaje}
                </Alert>
            )}
            <Form onSubmit={handleAgregarTipo}>
                <Form.Group className="mb-3" controlId="formNombreTipo">
                    <Form.Label>Nombre del Tipo</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Ingrese el nombre del tipo"
                        value={nombreTipo}
                        onChange={(e) => setNombreTipo(e.target.value)}
                    />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Agregar Tipo
                </Button>
            </Form>
        </Container>
    );
};

export default AgregarTipo;
