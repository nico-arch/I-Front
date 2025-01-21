import React, { useState, useEffect } from "react";
import {
  Form,
  Button,
  Alert,
  Card,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import { FaDollarSign, FaEdit } from "react-icons/fa";
import {
  getCurrentRate,
  updateExchangeRate,
} from "../services/exchangeRateService";

const ExchangeRate = () => {
  const [rate, setRate] = useState(0);
  const [newRate, setNewRate] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const { currentRate } = await getCurrentRate();
        setRate(currentRate);
      } catch (err) {
        setError("Impossible de récupérer le taux de change.");
      }
    };
    fetchRate();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!newRate || isNaN(newRate) || newRate <= 0) {
      setError("Veuillez entrer un taux valide.");
      return;
    }
    try {
      await updateExchangeRate(Number(newRate));
      setSuccess("Taux de change mis à jour avec succès.");
      setRate(newRate);
      setNewRate("");
    } catch (err) {
      setError("Erreur lors de la mise à jour du taux de change.");
    }
  };

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}
    >
      <Card className="shadow-lg" style={{ width: "400px" }}>
        <Card.Body>
          <h2 className="text-center mb-4">Gestion du taux de change</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="currentRate" className="mb-3">
              <Form.Label>
                <FaDollarSign className="me-2" />
                Taux actuel (USD → HTG)
              </Form.Label>
              <Form.Control
                type="text"
                value={rate}
                readOnly
                className="bg-light"
              />
            </Form.Group>
            <Form.Group controlId="newRate" className="mb-3">
              <Form.Label>
                <FaEdit className="me-2" />
                Nouveau taux
              </Form.Label>
              <Form.Control
                type="number"
                placeholder="Entrer le nouveau taux"
                value={newRate}
                onChange={(e) => setNewRate(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              Mettre à jour
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ExchangeRate;
