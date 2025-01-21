/*import axios from "axios";

const API_ENDPOINT = `${API_URL_V1}/orders`;
const token = localStorage.getItem("token");
const headers = { Authorization: `Bearer ${token}` };

// Fonction utilitaire pour gérer les erreurs
const handleRequestError = (error) => {
  if (error.response) {
    throw new Error(error.response.data.msg || "Une erreur s'est produite");
  } else if (error.request) {
    throw new Error("Aucune réponse du serveur");
  } else {
    throw new Error("Erreur lors de la requête");
  }
};

// Récupérer toutes les commandes
export const getOrders = async () => {
  try {
    const response = await axios.get(API_ENDPOINT, { headers });
    return response.data;
  } catch (error) {
    handleRequestError(error);
  }
};

// Ajouter une nouvelle commande
export const addOrder = async (orderData) => {
  try {
    const response = await axios.post(`${API_ENDPOINT}/add`, orderData, {
      headers,
    });
    return response.data;
  } catch (error) {
    handleRequestError(error);
  }
};

// Modifier une commande existante
export const editOrder = async (id, orderData) => {
  try {
    const response = await axios.put(`${API_ENDPOINT}/edit/${id}`, orderData, {
      headers,
    });
    return response.data;
  } catch (error) {
    handleRequestError(error);
  }
};

// Compléter une commande
export const completeOrder = async (id, updatePrices) => {
  try {
    const response = await axios.put(
      `${API_ENDPOINT}/complete/${id}`,
      { updatePrices },
      { headers },
    );
    return response.data;
  } catch (error) {
    handleRequestError(error);
  }
};

// Annuler une commande
export const cancelOrder = async (id) => {
  try {
    const response = await axios.put(
      `${API_ENDPOINT}/cancel/${id}`,
      {},
      { headers },
    );
    return response.data;
  } catch (error) {
    handleRequestError(error);
  }
};

// Supprimer une commande
export const deleteOrder = async (id) => {
  try {
    const response = await axios.delete(`${API_ENDPOINT}/delete/${id}`, {
      headers,
    });
    return response.data;
  } catch (error) {
    handleRequestError(error);
  }
};

// Récupérer une commande par ID
export const getOrderById = async (id) => {
  try {
    const response = await axios.get(`${API_ENDPOINT}/${id}`, { headers });
    return response.data;
  } catch (error) {
    handleRequestError(error);
  }
};*/
import axios from "axios";

const API_ENDPOINT = `${API_URL_V1}/orders`;
const token = localStorage.getItem("token");
const headers = { Authorization: `Bearer ${token}` };

// Fonction utilitaire pour gérer les erreurs
const handleRequestError = (error) => {
  if (error.response) {
    throw new Error(error.response.data.msg || "Une erreur s'est produite");
  } else if (error.request) {
    throw new Error("Aucune réponse du serveur");
  } else {
    throw new Error("Erreur lors de la requête");
  }
};

// Récupérer toutes les commandes
export const getOrders = async () => {
  try {
    const response = await axios.get(API_ENDPOINT, { headers });
    return response.data;
  } catch (error) {
    handleRequestError(error);
  }
};

// Ajouter une nouvelle commande
export const addOrder = async (orderData) => {
  try {
    const response = await axios.post(`${API_ENDPOINT}/add`, orderData, {
      headers,
    });
    return response.data;
  } catch (error) {
    handleRequestError(error);
  }
};

// Modifier une commande existante
export const editOrder = async (id, orderData) => {
  try {
    const response = await axios.put(`${API_ENDPOINT}/edit/${id}`, orderData, {
      headers,
    });
    return response.data;
  } catch (error) {
    handleRequestError(error);
  }
};

// Compléter une commande
export const completeOrder = async (id, updatePrices = null) => {
  try {
    const response = await axios.put(
      `${API_ENDPOINT}/complete/${id}`,
      { updatePrices }, // Envoyer les prix mis à jour si spécifié
      { headers },
    );
    return response.data;
  } catch (error) {
    handleRequestError(error);
  }
};

// Annuler une commande
export const cancelOrder = async (id) => {
  try {
    const response = await axios.put(
      `${API_ENDPOINT}/cancel/${id}`,
      {},
      { headers },
    );
    return response.data;
  } catch (error) {
    handleRequestError(error);
  }
};

// Supprimer une commande
export const deleteOrder = async (id) => {
  try {
    const response = await axios.delete(`${API_ENDPOINT}/delete/${id}`, {
      headers,
    });
    return response.data;
  } catch (error) {
    handleRequestError(error);
  }
};

// Récupérer une commande par ID
export const getOrderById = async (id) => {
  try {
    const response = await axios.get(`${API_ENDPOINT}/${id}`, { headers });
    return response.data;
  } catch (error) {
    handleRequestError(error);
  }
};
