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
import { FaUserPlus, FaEdit, FaTrashAlt, FaSearch } from "react-icons/fa";
import {
  getUsers,
  addUser,
  editUser,
  deleteUser,
} from "../services/userService";
import { getRoles } from "../services/roleService";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    roles: [],
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // État pour les messages de succès
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersData = await getUsers();
        const rolesData = await getRoles();
        setUsers(usersData);
        setRoles(rolesData);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchData();
  }, []);

  const handleShowModal = (user = null) => {
    setCurrentUser(user);
    setFormData(
      user
        ? { ...user, password: "" }
        : { firstName: "", lastName: "", email: "", password: "", roles: [] },
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

  const handleRolesChange = (e) => {
    const selectedRoles = Array.from(
      e.target.selectedOptions,
      (option) => option.value,
    );
    setFormData({ ...formData, roles: selectedRoles });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newUser = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        roles: formData.roles,
      };

      if (formData.password) {
        newUser.password = formData.password;
      }

      if (currentUser) {
        await editUser(currentUser._id, newUser);
        setSuccess("Utilisateur modifié avec succès.");
      } else {
        await addUser(newUser);
        setSuccess("Utilisateur ajouté avec succès.");
      }
      setShowModal(false);
      //setTimeout(() => setSuccess(""), 3000); // Efface le message de succès après 3 secondes
      window.location.reload();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (
      window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")
    ) {
      try {
        await deleteUser(id);
        setSuccess("Utilisateur supprimé avec succès.");
        //setTimeout(() => setSuccess(""), 3000); // Efface le message de succès après 3 secondes
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

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const email = user.email.toLowerCase();
    const roleNames = user.roles
      .map((role) => role.name.toLowerCase())
      .join(", ");
    const searchLower = searchTerm.toLowerCase();
    return (
      fullName.includes(searchLower) ||
      email.includes(searchLower) ||
      roleNames.includes(searchLower)
    );
  });

  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Container fluid className="mt-4">
      <Row>
        <Col>
          <Card className="shadow p-4">
            <h2 className="text-center mb-4">Gestion des utilisateurs</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <div className="d-flex justify-content-between align-items-center mb-3">
              <Button variant="primary" onClick={() => handleShowModal()}>
                <FaUserPlus className="me-2" />
                Ajouter un utilisateur
              </Button>
              <div className="d-flex align-items-center">
                <FaSearch className="me-2" />
                <Form.Control
                  type="text"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={handleSearch}
                  style={{ width: "300px" }}
                />
              </div>
            </div>

            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Prénom</th>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Rôles</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => (
                  <tr key={user._id}>
                    <td>{user.firstName}</td>
                    <td>{user.lastName}</td>
                    <td>{user.email}</td>
                    <td>{user.roles.map((role) => role.name).join(", ")}</td>
                    <td>
                      <Button
                        variant="warning"
                        className="me-2"
                        onClick={() => handleShowModal(user)}
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleDelete(user._id)}
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
                length: Math.ceil(filteredUsers.length / itemsPerPage),
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
            {currentUser ? "Modifier" : "Ajouter"} un utilisateur
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="firstName">
              <Form.Label>Prénom</Form.Label>
              <Form.Control
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="lastName" className="mt-3">
              <Form.Label>Nom</Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                value={formData.lastName}
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
            <Form.Group controlId="password" className="mt-3">
              <Form.Label>Mot de passe</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Laissez vide pour ne pas changer"
              />
            </Form.Group>
            <Form.Group controlId="roles" className="mt-3">
              <Form.Label>Rôles</Form.Label>
              <Form.Control
                as="select"
                multiple
                name="roles"
                value={formData.roles}
                onChange={handleRolesChange}
              >
                {roles.map((role) => (
                  <option key={role._id} value={role._id}>
                    {role.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3 w-100">
              {currentUser ? "Modifier" : "Ajouter"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Users;
