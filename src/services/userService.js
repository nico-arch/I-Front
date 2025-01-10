import axios from "axios";

const API_ENDPOINT = `${API_URL_V1}/users`;
//const token = localStorage.getItem("token");

//const headers = { Authorization: `Bearer ${token}` };

// Fonction utilitaire pour configurer les en-têtes avec le token
const getHeaders = () => {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

// Fonction utilitaire pour gérer les erreurs
const handleError = (error) => {
  if (error.response) {
    // Erreurs renvoyées par le serveur
    throw new Error(error.response.data.msg || "Une erreur s'est produite"+`${error}`);
  } else if (error.request) {
    // Erreur réseau ou absence de réponse
    throw new Error("Erreur réseau : impossible de contacter le serveur");
  } else {
    // Autres erreurs
    throw new Error(error.message || "Erreur inconnue");
  }
};

// Récupérer tous les utilisateurs
export const getUsers = async () => {
  try {
    const response = await axios.get(API_ENDPOINT, { headers: getHeaders() });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Rechercher un utilisateur par ID
export const getUserById = async (id) => {
  try {
    const response = await axios.get(`${API_ENDPOINT}/${id}`, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Rechercher un utilisateur par email
export const getUserByEmail = async (email) => {
  try {
    const response = await axios.get(`${API_ENDPOINT}/email/${email}`, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Ajouter un nouvel utilisateur
export const addUser = async (userData) => {
  try {
    const response = await axios.post(`${API_ENDPOINT}/add`, userData, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Modifier un utilisateur existant
export const editUser = async (id, userData) => {
  try {
    const response = await axios.put(`${API_ENDPOINT}/edit/${id}`, userData, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Supprimer un utilisateur
export const deleteUser = async (id) => {
  try {
    const response = await axios.delete(`${API_ENDPOINT}/delete/${id}`, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Ajouter un ou plusieurs rôles à un utilisateur
export const assignRoles = async (userId, roles) => {
  try {
    const response = await axios.put(
      `${API_ENDPOINT}/assign-roles/${userId}`,
      { roles },
      { headers: getHeaders() },
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Retirer un ou plusieurs rôles d’un utilisateur
export const removeRoles = async (userId, roles) => {
  try {
    const response = await axios.put(
      `${API_ENDPOINT}/remove-roles/${userId}`,
      { roles },
      { headers: getHeaders() },
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
