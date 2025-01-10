import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Alert, Pagination } from "react-bootstrap";
import {
  getClients,
  addClient,
  editClient,
  deleteClient,
} from "../services/clientService";
import { getCurrencies } from "../services/currencyService";

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentClient, setCurrentClient] = useState(null);
  const [formData, setFormData] = useState({
    clientType: "company", // Type de client toujours "Entreprise"
    companyName: "",
    address: "",
    email: "",
    website: "",
    governmentId: "",
  });
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Charger les clients et les devises au montage du composant
  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientsData = await getClients();
        const currenciesData = await getCurrencies();
        setClients(clientsData);
        setCurrencies(currenciesData);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchData();
  }, []);

  // Gérer l'ouverture du modal pour ajouter/modifier
  const handleShowModal = (client = null) => {
    setCurrentClient(client);
    setFormData(
      client
        ? { ...client }
        : {
            clientType: "company",
            companyName: "",
            address: "",
            email: "",
            website: "",
            governmentId: "",
          },
    );
    setShowModal(true);
    setError("");
  };

  // Gérer la fermeture du modal
  const handleCloseModal = () => setShowModal(false);

  // Gérer les changements de formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Soumettre le formulaire (ajout ou modification)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentClient) {
        await editClient(currentClient._id, formData);
      } else {
        await addClient(formData);
      }
      setShowModal(false);
      window.location.reload();
    } catch (err) {
      setError(err.message);
    }
  };

  // Supprimer un client
  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce client ?")) {
      try {
        await deleteClient(id);
        window.location.reload();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  // Gérer la recherche
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Filtrer les clients en fonction du terme de recherche
  const filteredClients = clients.filter((client) => {
    const companyName = client.companyName?.toLowerCase() || "";
    const email = client.email?.toLowerCase() || "";
    const address = client.address?.toLowerCase() || "";
    const searchLower = searchTerm.toLowerCase();
    return (
      companyName.includes(searchLower) ||
      email.includes(searchLower) ||
      address.includes(searchLower)
    );
  });

  // Pagination : Calculer les clients à afficher pour la page courante
  const indexOfLastClient = currentPage * itemsPerPage;
  const indexOfFirstClient = indexOfLastClient - itemsPerPage;
  const currentClients = filteredClients.slice(
    indexOfFirstClient,
    indexOfLastClient,
  );

  // Gérer le changement de page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <h2>Gestion des clients</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      <div className="d-flex justify-content-between mb-3">
        <Button variant="primary" onClick={() => handleShowModal()}>
          Ajouter un client
        </Button>
        <Form.Control
          type="text"
          placeholder="Rechercher un client..."
          value={searchTerm}
          onChange={handleSearch}
          style={{ width: "300px" }}
        />
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nom complet / Nom de l'entreprise</th>
            <th>Email</th>
            <th>Adresse</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentClients.map((client) => (
            <tr key={client._id}>
              <td>{client.companyName}</td>
              <td>{client.email}</td>
              <td>{client.address}</td>
              <td>
                <Button
                  variant="warning"
                  onClick={() => handleShowModal(client)}
                >
                  Modifier
                </Button>{" "}
                <Button
                  variant="danger"
                  onClick={() => handleDelete(client._id)}
                >
                  Supprimer
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Pagination */}
      <Pagination className="mt-3">
        {Array.from({
          length: Math.ceil(filteredClients.length / itemsPerPage),
        }).map((_, index) => (
          <Pagination.Item
            key={index + 1}
            active={index + 1 === currentPage}
            onClick={() => paginate(index + 1)}
          >
            {index + 1}
          </Pagination.Item>
        ))}
      </Pagination>

      {/* Modal pour ajouter/modifier un client */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {currentClient ? "Modifier" : "Ajouter"} un client
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="companyName">
              <Form.Label>Nom complet / Nom de l'entreprise</Form.Label>
              <Form.Control
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="address">
              <Form.Label>Adresse</Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="website">
              <Form.Label>Site Web</Form.Label>
              <Form.Control
                type="text"
                name="website"
                value={formData.website}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="governmentId">
              <Form.Label>ID Gouvernemental</Form.Label>
              <Form.Control
                type="text"
                name="governmentId"
                value={formData.governmentId}
                onChange={handleChange}
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="mt-3">
              {currentClient ? "Modifier" : "Ajouter"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Clients;
