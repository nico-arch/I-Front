import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Alert,
  Pagination,
  Card,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import { FaUserEdit, FaTrashAlt, FaUserPlus, FaSearch } from "react-icons/fa";
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
    clientType: "company",
    companyName: "",
    address: "",
    email: "",
    website: "",
    governmentId: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // État pour les messages de succès
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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
    setSuccess("");
  };

  const handleCloseModal = () => setShowModal(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentClient) {
        await editClient(currentClient._id, formData);
        setSuccess("Client modifié avec succès.");
      } else {
        await addClient(formData);
        setSuccess("Client ajouté avec succès.");
      }
      setShowModal(false);
      //setTimeout(() => setSuccess(""), 3000);
      window.location.reload();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce client ?")) {
      try {
        await deleteClient(id);
        setSuccess("Client supprimé avec succès.");
        //setTimeout(() => setSuccess(""), 3000);
        window.location.reload();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

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

  const indexOfLastClient = currentPage * itemsPerPage;
  const indexOfFirstClient = indexOfLastClient - itemsPerPage;
  const currentClients = filteredClients.slice(
    indexOfFirstClient,
    indexOfLastClient,
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Container fluid className="mt-4">
      <Row>
        <Col>
          <Card className="shadow p-4">
            <h2 className="text-center mb-4">Gestion des clients</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <div className="d-flex justify-content-between align-items-center mb-3">
              <Button variant="primary" onClick={() => handleShowModal()}>
                <FaUserPlus className="me-2" />
                Ajouter un client
              </Button>
              <div className="d-flex align-items-center">
                <FaSearch className="me-2" />
                <Form.Control
                  type="text"
                  placeholder="Rechercher un client..."
                  value={searchTerm}
                  onChange={handleSearch}
                  style={{ width: "300px" }}
                />
              </div>
            </div>

            <Table striped bordered hover responsive>
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
                        className="me-2"
                        onClick={() => handleShowModal(client)}
                      >
                        <FaUserEdit />
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleDelete(client._id)}
                      >
                        <FaTrashAlt />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <Pagination className="mt-3 justify-content-center">
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
          </Card>
        </Col>
      </Row>

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
            <Form.Group controlId="email" className="mt-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="address" className="mt-3">
              <Form.Label>Adresse</Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="website" className="mt-3">
              <Form.Label>Site Web</Form.Label>
              <Form.Control
                type="text"
                name="website"
                value={formData.website}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="governmentId" className="mt-3">
              <Form.Label>ID Gouvernemental</Form.Label>
              <Form.Control
                type="text"
                name="governmentId"
                value={formData.governmentId}
                onChange={handleChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3 w-100">
              {currentClient ? "Modifier" : "Ajouter"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Clients;
