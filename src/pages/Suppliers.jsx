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
import { FaPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import {
  getSuppliers,
  addSupplier,
  editSupplier,
  deleteSupplier,
} from "../services/supplierService";

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState(null);
  const [formData, setFormData] = useState({
    companyName: "",
    contacts: [],
    emails: [],
    addresses: [],
    cities: [],
    countries: [],
    website: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Charger les fournisseurs au montage du composant
  useEffect(() => {
    const fetchData = async () => {
      try {
        const suppliersData = await getSuppliers();
        setSuppliers(suppliersData);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchData();
  }, []);

  const handleShowModal = (supplier = null) => {
    setCurrentSupplier(supplier);
    setFormData(
      supplier
        ? { ...supplier }
        : {
            companyName: "",
            contacts: [],
            emails: [],
            addresses: [],
            cities: [],
            countries: [],
            website: "",
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
      if (currentSupplier) {
        await editSupplier(currentSupplier._id, formData);
        setSuccess("Fournisseur modifié avec succès.");
      } else {
        await addSupplier(formData);
        setSuccess("Fournisseur ajouté avec succès.");
      }
      setShowModal(false);
      setTimeout(() => setSuccess(""), 3000);
      window.location.reload();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce fournisseur ?")) {
      try {
        await deleteSupplier(id);
        setSuccess("Fournisseur supprimé avec succès.");
        setTimeout(() => setSuccess(""), 3000);
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

  const filteredSuppliers = suppliers.filter((supplier) => {
    const companyName = supplier.companyName?.toLowerCase() || "";
    const email = supplier.emails.join(", ").toLowerCase();
    const address = supplier.addresses.join(", ").toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    return (
      companyName.includes(searchLower) ||
      email.includes(searchLower) ||
      address.includes(searchLower)
    );
  });

  const indexOfLastSupplier = currentPage * itemsPerPage;
  const indexOfFirstSupplier = indexOfLastSupplier - itemsPerPage;
  const currentSuppliers = filteredSuppliers.slice(
    indexOfFirstSupplier,
    indexOfLastSupplier,
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Container fluid className="mt-4">
      <Row>
        <Col>
          <Card className="shadow p-4">
            <h2 className="text-center mb-4">Gestion des fournisseurs</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <div className="d-flex justify-content-between align-items-center mb-3">
              <Button variant="primary" onClick={() => handleShowModal()}>
                <FaPlus className="me-2" />
                Ajouter un fournisseur
              </Button>
              <div className="d-flex align-items-center">
                <FaSearch className="me-2" />
                <Form.Control
                  type="text"
                  placeholder="Rechercher un fournisseur..."
                  value={searchTerm}
                  onChange={handleSearch}
                  style={{ width: "300px" }}
                />
              </div>
            </div>

            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Nom de l'entreprise</th>
                  <th>Emails</th>
                  <th>Adresses</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentSuppliers.map((supplier) => (
                  <tr key={supplier._id}>
                    <td>{supplier.companyName}</td>
                    <td>{supplier.emails.join(", ")}</td>
                    <td>{supplier.addresses.join(", ")}</td>
                    <td>
                      <Button
                        variant="warning"
                        className="me-2"
                        onClick={() => handleShowModal(supplier)}
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleDelete(supplier._id)}
                      >
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <Pagination className="mt-3 justify-content-center">
              {Array.from({
                length: Math.ceil(filteredSuppliers.length / itemsPerPage),
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
            {currentSupplier ? "Modifier" : "Ajouter"} un fournisseur
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="companyName">
              <Form.Label>Nom de l'entreprise</Form.Label>
              <Form.Control
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="emails" className="mt-3">
              <Form.Label>Emails</Form.Label>
              <Form.Control
                type="text"
                name="emails"
                value={formData.emails.join(", ")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    emails: e.target.value
                      .split(",")
                      .map((email) => email.trim()),
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="addresses" className="mt-3">
              <Form.Label>Adresses</Form.Label>
              <Form.Control
                type="text"
                name="addresses"
                value={formData.addresses.join(", ")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    addresses: e.target.value
                      .split(",")
                      .map((address) => address.trim()),
                  })
                }
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
            <Button variant="primary" type="submit" className="mt-4 w-100">
              {currentSupplier ? "Modifier" : "Ajouter"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Suppliers;
