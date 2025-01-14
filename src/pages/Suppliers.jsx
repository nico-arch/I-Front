import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Alert, Pagination } from "react-bootstrap";
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

  // Gérer l'ouverture du modal pour ajouter/modifier un fournisseur
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
      if (currentSupplier) {
        await editSupplier(currentSupplier._id, formData);
      } else {
        await addSupplier(formData);
      }
      setShowModal(false);
      window.location.reload();
    } catch (err) {
      setError(err.message);
    }
  };

  // Supprimer un fournisseur
  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce fournisseur ?")) {
      try {
        await deleteSupplier(id);
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

  // Filtrer les fournisseurs en fonction du terme de recherche
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

  // Pagination : Calculer les fournisseurs à afficher pour la page courante
  const indexOfLastSupplier = currentPage * itemsPerPage;
  const indexOfFirstSupplier = indexOfLastSupplier - itemsPerPage;
  const currentSuppliers = filteredSuppliers.slice(
    indexOfFirstSupplier,
    indexOfLastSupplier,
  );

  // Gérer le changement de page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <h2>Gestion des fournisseurs</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      <div className="d-flex justify-content-between mb-3">
        <Button variant="primary" onClick={() => handleShowModal()}>
          Ajouter un fournisseur
        </Button>
        <Form.Control
          type="text"
          placeholder="Rechercher un fournisseur..."
          value={searchTerm}
          onChange={handleSearch}
          style={{ width: "300px" }}
        />
      </div>

      <Table striped bordered hover>
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
                  onClick={() => handleShowModal(supplier)}
                >
                  Modifier
                </Button>{" "}
                <Button
                  variant="danger"
                  onClick={() => handleDelete(supplier._id)}
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

      {/* Modal pour ajouter/modifier un fournisseur */}
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

            <Form.Group controlId="emails">
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

            <Form.Group controlId="addresses">
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

            <Form.Group controlId="website">
              <Form.Label>Site Web</Form.Label>
              <Form.Control
                type="text"
                name="website"
                value={formData.website}
                onChange={handleChange}
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="mt-3">
              {currentSupplier ? "Modifier" : "Ajouter"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Suppliers;
