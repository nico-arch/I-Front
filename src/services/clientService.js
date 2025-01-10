import axios from "axios";

const API_ENDPOINT = `${API_URL_V1}/clients`;

// Fonction utilitaire pour récupérer les headers avec le token
const getHeaders = () => {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

// Récupérer tous les clients
export const getClients = async () => {
  try {
    const response = await axios.get(API_ENDPOINT, { headers: getHeaders() });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Ajouter un nouveau client
export const addClient = async (clientData) => {
  try {
    const response = await axios.post(`${API_ENDPOINT}/add`, clientData, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Modifier un client existant
export const editClient = async (id, clientData) => {
  try {
    const response = await axios.put(`${API_ENDPOINT}/edit/${id}`, clientData, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Supprimer un client
export const deleteClient = async (id) => {
  try {
    const response = await axios.delete(`${API_ENDPOINT}/delete/${id}`, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Fonction pour gérer les erreurs
const handleError = (error) => {
  if (error.response) {
    // Erreur côté serveur avec une réponse
    throw new Error(error.response.data.msg || "Server error");
  } else if (error.request) {
    // Erreur liée à la requête (ex : pas de réponse du serveur)
    throw new Error("No response from server");
  } else {
    // Autres erreurs (erreurs de configuration, etc.)
    throw new Error(error.message || "Unexpected error");
  }
};
