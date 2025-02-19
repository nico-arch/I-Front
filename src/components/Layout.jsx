import React, { useState } from "react";
import { Container, Row, Col, Nav, Button, Offcanvas } from "react-bootstrap";
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
import "../pages/printStyles.css";

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  const handleLogout = () => {
    logout(); // Supprimer le token du localStorage
    navigate("/"); // Rediriger vers la page de connexion
  };

  const handleClose = () => setShowOffcanvas(false);
  const handleShow = () => setShowOffcanvas(true);

  const sidebarContent = (
    <>
      <h4 className="text-center mb-4 no-print">Lymoner</h4>
      <Nav className="flex-column">
        <NavLink
          to="/dashboard"
          className="nav-link text-light d-flex align-items-center mb-3"
          onClick={handleClose}
        >
          <FaHome className="me-2" /> Dashboard
        </NavLink>
        <NavLink
          to="/users"
          className="nav-link text-light d-flex align-items-center mb-3"
          onClick={handleClose}
        >
          <FaUsers className="me-2" /> Utilisateurs
        </NavLink>
        <NavLink
          to="/clients"
          className="nav-link text-light d-flex align-items-center mb-3"
          onClick={handleClose}
        >
          <FaClipboardList className="me-2" /> Clients
        </NavLink>
        <NavLink
          to="/categories"
          className="nav-link text-light d-flex align-items-center mb-3"
          onClick={handleClose}
        >
          <FaTags className="me-2" /> Catégories
        </NavLink>
        <NavLink
          to="/products"
          className="nav-link text-light d-flex align-items-center mb-3"
          onClick={handleClose}
        >
          <FaBox className="me-2" /> Produits
        </NavLink>
        <NavLink
          to="/exchange-rate"
          className="nav-link text-light d-flex align-items-center mb-3"
          onClick={handleClose}
        >
          <FaDollarSign className="me-2" /> Taux de change
        </NavLink>
        <NavLink
          to="/sales"
          className="nav-link text-light d-flex align-items-center mb-3"
          onClick={handleClose}
        >
          <FaChartBar className="me-2" /> Ventes
        </NavLink>
        {/*
          <NavLink
            to="/services"
            className="nav-link text-light d-flex align-items-center mb-3"
            onClick={handleClose}
          >
            <FaCogs className="me-2" /> Services
          </NavLink>
        */}
        <NavLink
          to="/suppliers"
          className="nav-link text-light d-flex align-items-center mb-3"
          onClick={handleClose}
        >
          <FaShoppingCart className="me-2" /> Fournisseurs
        </NavLink>
        <NavLink
          to="/orders"
          className="nav-link text-light d-flex align-items-center mb-3"
          onClick={handleClose}
        >
          <FaFileInvoice className="me-2" /> Commandes
        </NavLink>
        <Button
          variant="outline-danger"
          className="d-flex align-items-center mt-4 w-100"
          onClick={() => {
            handleLogout();
            handleClose();
          }}
        >
          <FaSignOutAlt className="me-2" /> Déconnexion
        </Button>
      </Nav>
    </>
  );

  return (
    <Container fluid className="p-0" style={{ height: "100vh" }}>
      <Row style={{ height: "100%" }}>
        {/* Sidebar pour les écrans moyens et grands */}
        <Col
          md={2}
          className="d-none d-md-block bg-dark text-light p-3"
          style={{
            height: "100%",
            overflowY: "auto",
            position: "fixed",
          }}
        >
          {sidebarContent}
        </Col>

        {/* Offcanvas pour les petits écrans */}
        <Offcanvas
          show={showOffcanvas}
          onHide={handleClose}
          className="bg-dark text-light"
          placement="start"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title className="no-print">Lymoner</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>{sidebarContent}</Offcanvas.Body>
        </Offcanvas>

        {/* Bouton de menu visible uniquement sur mobile */}
        <Col xs={12} className="d-md-none bg-dark text-light p-2">
          <Button variant="outline-light" onClick={handleShow}>
            Menu
          </Button>
        </Col>

        {/* Contenu principal */}
        <Col
          xs={12}
          md={{ span: 10, offset: 2 }}
          className="p-3"
          style={{
            backgroundColor: "#f8f9fa",
            height: "100vh",
            overflowY: "auto",
          }}
        >
          {children}
        </Col>
      </Row>
    </Container>
  );
};

export default Layout;
