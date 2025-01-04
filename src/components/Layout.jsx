import React from "react";
import { Container, Row, Col, Nav } from "react-bootstrap";

const Layout = ({ children }) => (
  <Container fluid>
    <Row>
      <Col md={2} className="bg-light sidebar">
        <Nav className="flex-column">
          <Nav.Link href="/dashboard">Dashboard</Nav.Link>
          <Nav.Link href="/users">Utilisateurs</Nav.Link>
          <Nav.Link href="/clients">Clients</Nav.Link>
          <Nav.Link href="/products">Produits</Nav.Link>
          <Nav.Link href="/sales">Ventes</Nav.Link>
          <Nav.Link href="/services">Services</Nav.Link>
          <Nav.Link href="/orders">Commandes</Nav.Link>
          <Nav.Link href="/reports">Rapports</Nav.Link>
        </Nav>
      </Col>
      <Col md={10}>
        <div className="content p-4">{children}</div>
      </Col>
    </Row>
  </Container>
);

export default Layout;
