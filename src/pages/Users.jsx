import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Alert, Pagination } from "react-bootstrap";
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
  const [searchTerm, setSearchTerm] = useState(""); // État pour la recherche
  const [currentPage, setCurrentPage] = useState(1); // État pour la pagination
  const itemsPerPage = 5; // Nombre d'utilisateurs par page

  // Charger les utilisateurs et les rôles au montage du composant
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

  // Gérer l'ouverture du modal pour ajouter/modifier
  const handleShowModal = (user = null) => {
    setCurrentUser(user);
    setFormData(
      user
        ? { ...user, password: "" }
        : { firstName: "", lastName: "", email: "", password: "", roles: [] },
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

  // Gérer la sélection des rôles
  const handleRolesChange = (e) => {
    const selectedRoles = Array.from(
      e.target.selectedOptions,
      (option) => option.value,
    );
    setFormData({ ...formData, roles: selectedRoles });
  };

  // Soumettre le formulaire (ajout ou modification)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newUser = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        roles: formData.roles,
      };

      // Ajouter le mot de passe uniquement s'il est renseigné
      if (formData.password) {
        newUser.password = formData.password;
      }

      if (currentUser) {
        await editUser(currentUser._id, newUser);
      } else {
        await addUser(newUser);
      }
      setShowModal(false);
      window.location.reload();
    } catch (err) {
      setError(err.message);
    }
  };

  // Supprimer un utilisateur
  const handleDelete = async (id) => {
    if (
      window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")
    ) {
      try {
        await deleteUser(id);
        window.location.reload();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  // Gérer la recherche
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Réinitialiser à la première page lors d'une recherche
  };

  // Filtrer les utilisateurs en fonction du terme de recherche
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

  // Pagination : Calculer les utilisateurs à afficher pour la page courante
  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Gérer le changement de page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <h2>Gestion des utilisateurs</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      <div className="d-flex justify-content-between mb-3">
        <Button variant="primary" onClick={() => handleShowModal()}>
          Ajouter un utilisateur
        </Button>
        <Form.Control
          type="text"
          placeholder="Rechercher un utilisateur..."
          value={searchTerm}
          onChange={handleSearch}
          style={{ width: "300px" }}
        />
      </div>

      <Table striped bordered hover>
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
                <Button variant="warning" onClick={() => handleShowModal(user)}>
                  Modifier
                </Button>{" "}
                <Button variant="danger" onClick={() => handleDelete(user._id)}>
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

      {/* Modal pour ajouter/modifier un utilisateur */}
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

            <Form.Group controlId="lastName">
              <Form.Label>Nom</Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                value={formData.lastName}
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

            <Form.Group controlId="password">
              <Form.Label>Mot de passe</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Laissez vide pour ne pas changer"
              />
            </Form.Group>

            <Form.Group controlId="roles">
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

            <Button variant="primary" type="submit" className="mt-3">
              {currentUser ? "Modifier" : "Ajouter"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Users;
