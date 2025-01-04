import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";

const Dashboard = () => {
  return (
    <Container fluid className="mt-4">
      <Row>
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Nombre de ventes</Card.Title>
              <Card.Text>
                <h3>125</h3>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Total des revenus</Card.Title>
              <Card.Text>
                <h3>450,000 HTG</h3>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Clients enregistrés</Card.Title>
              <Card.Text>
                <h3>89</h3>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md={6}>
          <Card>
            <Card.Header>Ventes récentes</Card.Header>
            <Card.Body>
              <ul>
                <li>Vente #123 - 12,000 HTG</li>
                <li>Vente #124 - 8,500 HTG</li>
                <li>Vente #125 - 15,000 HTG</li>
                <li>Vente #126 - 9,000 HTG</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Header>Alertes de stock</Card.Header>
            <Card.Body>
              <ul>
                <li>Produit A - 5 unités restantes</li>
                <li>Produit B - 2 unités restantes</li>
                <li>Produit C - Rupture de stock</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
