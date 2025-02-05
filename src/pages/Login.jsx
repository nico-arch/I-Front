import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Card,
  Alert,
} from "react-bootstrap";
import { login } from "../services/authService";
import { FaUserAlt, FaLock } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    navigate("/dashboard");
    e.preventDefault();
    try {
      await login(email, password);
      window.location.reload();
      // Rediriger vers le tableau de bord après connexion
    } catch (err) {
      setError("Identifiants invalides : " + err);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
      }}
    >
      <Card style={{ width: "400px", padding: "20px" }} className="shadow-sm">
        <Card.Body>
          <h2 className="text-center mb-4">Connexion</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label>
                <FaUserAlt className="me-2" />
                Email
              </Form.Label>
              <Form.Control
                type="email"
                placeholder="Entrer votre email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formPassword" className="mb-3">
              <Form.Label>
                <FaLock className="me-2" />
                Mot de passe
              </Form.Label>
              <Form.Control
                type="password"
                placeholder="Entrer votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              Connexion
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Login;
