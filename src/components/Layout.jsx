import React from "react";
import { Container, Row, Col, Nav, Button } from "react-bootstrap";
import { useNavigate } from "react-router";
import { NavLink } from "react-router-dom";


import { logout } from "../services/authService";

const Layout = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Supprimer le token du localStorage
    navigate("/"); // Rediriger vers la page de connexion
  };

  return (
    <Container fluid>
      <Row>
        <Col md={2} className="bg-light sidebar">
          <Nav className="flex-column">
            <NavLink to="/dashboard" className="nav-link">
              Dashboard
            </NavLink>
            <NavLink to="/users" className="nav-link">
              Utilisateurs
            </NavLink>
            <NavLink to="/clients" className="nav-link">
              Clients
            </NavLink>
            <NavLink to="/products" className="nav-link">
              Produits
            </NavLink>
            <NavLink to="/sales" className="nav-link">
              Ventes
            </NavLink>
            <NavLink to="/services" className="nav-link">
              Services
            </NavLink>
            <NavLink to="/orders" className="nav-link">
              Commandes
            </NavLink>
            <NavLink to="/reports" className="nav-link">
              Rapports
            </NavLink>
            <Button
              variant="outline-danger"
              className="mt-3"
              onClick={handleLogout}
            >
              Déconnexion
            </Button>
          </Nav>
        </Col>
        <Col md={10}>
          <div className="content p-4">{children}</div>
        </Col>
      </Row>
    </Container>
  );
};

export default Layout;
