import React from "react";
import { Container, Row, Col, Card, ListGroup } from "react-bootstrap";
import {
  FaShoppingCart,
  FaMoneyBillWave,
  FaUsers,
  FaExclamationTriangle,
  FaReceipt,
} from "react-icons/fa";

const Dashboard = () => {
  return (
    <Container fluid className="mt-4">
      {/* Row des statistiques principales */}
      <h1>Bienvenue {localStorage.getItem("userFirstName")} {localStorage.getItem("userLastName")} !</h1>
      <Row>
        <Col md={4} sm={6} xs={12} className="mb-4">
          <Card className="text-center shadow">
            <Card.Body>
              <FaShoppingCart size={40} className="text-primary mb-3" />
              <Card.Title>Nombre de ventes</Card.Title>
              <Card.Text>
                <h3>125</h3>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} sm={6} xs={12} className="mb-4">
          <Card className="text-center shadow">
            <Card.Body>
              <FaMoneyBillWave size={40} className="text-success mb-3" />
              <Card.Title>Total des revenus</Card.Title>
              <Card.Text>
                <h3>450,000 HTG</h3>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} sm={6} xs={12} className="mb-4">
          <Card className="text-center shadow">
            <Card.Body>
              <FaUsers size={40} className="text-info mb-3" />
              <Card.Title>Clients enregistrés</Card.Title>
              <Card.Text>
                <h3>89</h3>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Row des sections supplémentaires */}
      <Row>
        <Col md={6} sm={12} className="mb-4">
          <Card className="shadow">
            <Card.Header className="bg-primary text-white">
              <FaReceipt className="me-2" />
              Ventes récentes
            </Card.Header>
            <Card.Body>
              <ListGroup>
                <ListGroup.Item>Vente #123 - 12,000 HTG</ListGroup.Item>
                <ListGroup.Item>Vente #124 - 8,500 HTG</ListGroup.Item>
                <ListGroup.Item>Vente #125 - 15,000 HTG</ListGroup.Item>
                <ListGroup.Item>Vente #126 - 9,000 HTG</ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} sm={12} className="mb-4">
          <Card className="shadow">
            <Card.Header className="bg-danger text-white">
              <FaExclamationTriangle className="me-2" />
              Alertes de stock
            </Card.Header>
            <Card.Body>
              <ListGroup>
                <ListGroup.Item>Produit A - 5 unités restantes</ListGroup.Item>
                <ListGroup.Item>Produit B - 2 unités restantes</ListGroup.Item>
                <ListGroup.Item className="text-danger">
                  Produit C - Rupture de stock
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
