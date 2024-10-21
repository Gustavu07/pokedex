import axios from "axios";
import { useState } from "react";
import { Button, Form, Container, Alert } from "react-bootstrap";

const AgregarHabilidad = () => {
    const [nombreHabilidad, setNombreHabilidad] = useState("");
    const [descripcionHabilidad, setDescripcionHabilidad] = useState(""); // Nuevo estado para descripción
    const [mensaje, setMensaje] = useState(null);
    const [error, setError] = useState(false);

    const handleAgregarHabilidad = (e) => {
        e.preventDefault();
        if (!nombreHabilidad.trim() || !descripcionHabilidad.trim()) {
            setError(true);
            setMensaje("El nombre y la descripción no pueden estar vacíos");
            return;
        }

        // Realizar la solicitud POST para agregar una nueva habilidad
        axios.post("http://localhost:3000/habilidades", {
            nombre: nombreHabilidad,
            descripcion: descripcionHabilidad, // Enviar también la descripción
        })
        .then(() => {
            setMensaje("Habilidad agregada con éxito");
            setError(false);
            setNombreHabilidad(""); // Limpiar el campo de entrada
            setDescripcionHabilidad(""); // Limpiar el campo de descripción
        })
        .catch(err => {
            setError(true);
            if (err.response) {
                // Si el servidor responde con un error
                setMensaje(err.response.data.message || "Error al agregar la habilidad");
            } else {
                // Si hay un error de conexión
                setMensaje("Error de conexión");
            }
            console.error(err);
        });
    };

    return (
        <Container className="mt-3">
            <h2>Agregar Habilidad de Pokémon</h2>
            {mensaje && (
                <Alert variant={error ? "danger" : "success"}>
                    {mensaje}
                </Alert>
            )}
            <Form onSubmit={handleAgregarHabilidad}>
                <Form.Group className="mb-3" controlId="formNombreHabilidad">
                    <Form.Label>Nombre de la Habilidad</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Ingrese el nombre de la habilidad"
                        value={nombreHabilidad}
                        onChange={(e) => setNombreHabilidad(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formDescripcionHabilidad">
                    <Form.Label>Descripción de la Habilidad</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Ingrese la descripción de la habilidad"
                        value={descripcionHabilidad}
                        onChange={(e) => setDescripcionHabilidad(e.target.value)}
                    />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Agregar Habilidad
                </Button>
            </Form>
        </Container>
    );
};

export default AgregarHabilidad;
