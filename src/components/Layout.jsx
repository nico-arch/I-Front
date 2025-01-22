import React from "react";
import { Container, Row, Col, Nav, Button } from "react-bootstrap";
import { useNavigate } from "react-router";
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaTags,
  FaBox,
  FaDollarSign,
  FaChartBar,
  FaCogs,
  FaSignOutAlt,
  FaClipboardList,
  FaShoppingCart,
  FaFileInvoice,
} from "react-icons/fa";

import { logout } from "../services/authService";

const Layout = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Supprimer le token du localStorage
    navigate("/"); // Rediriger vers la page de connexion
  };

  return (
    <Container fluid className="p-0" style={{ height: "100vh" }}>
      <Row style={{ height: "100%" }}>
        {/* Sidebar */}
        <Col
          xs={12}
          md={2}
          className="bg-dark text-light p-3"
          style={{
            height: "100%",
            overflowY: "auto", // Barre latérale scrollable
            position: "fixed",
          }}
        >
          <h4 className="text-center mb-4">Lymoner</h4>
          <Nav className="flex-column">
            <NavLink
              to="/dashboard"
              className="nav-link text-light d-flex align-items-center mb-3"
            >
              <FaHome className="me-2" /> Dashboard
            </NavLink>
            <NavLink
              to="/users"
              className="nav-link text-light d-flex align-items-center mb-3"
            >
              <FaUsers className="me-2" /> Utilisateurs
            </NavLink>
            <NavLink
              to="/clients"
              className="nav-link text-light d-flex align-items-center mb-3"
            >
              <FaClipboardList className="me-2" /> Clients
            </NavLink>
            <NavLink
              to="/categories"
              className="nav-link text-light d-flex align-items-center mb-3"
            >
              <FaTags className="me-2" /> Catégories
            </NavLink>
            <NavLink
              to="/products"
              className="nav-link text-light d-flex align-items-center mb-3"
            >
              <FaBox className="me-2" /> Produits
            </NavLink>
            <NavLink
              to="/exchange-rate"
              className="nav-link text-light d-flex align-items-center mb-3"
            >
              <FaDollarSign className="me-2" /> Taux de change
            </NavLink>
            <NavLink
              to="/sales"
              className="nav-link text-light d-flex align-items-center mb-3"
            >
              <FaChartBar className="me-2" /> Ventes
            </NavLink>
            <NavLink
              to="/services"
              className="nav-link text-light d-flex align-items-center mb-3"
            >
              <FaCogs className="me-2" /> Services
            </NavLink>
            <NavLink
              to="/suppliers"
              className="nav-link text-light d-flex align-items-center mb-3"
            >
              <FaShoppingCart className="me-2" /> Fournisseurs
            </NavLink>
            <NavLink
              to="/orders"
              className="nav-link text-light d-flex align-items-center mb-3"
            >
              <FaFileInvoice className="me-2" /> Commandes
            </NavLink>
            <Button
              variant="outline-danger"
              className="d-flex align-items-center mt-4 w-100"
              onClick={handleLogout}
            >
              <FaSignOutAlt className="me-2" /> Déconnexion
            </Button>
          </Nav>
        </Col>

        {/* Main Content */}
        <Col
          xs={12}
          md={{ span: 10, offset: 2 }}
          className="p-3"
          style={{
            backgroundColor: "#f8f9fa",
            height: "100vh",
            overflowY: "auto", // Contenu principal scrollable
          }}
        >
          {children}
        </Col>
      </Row>
    </Container>
  );
};

export default Layout;
