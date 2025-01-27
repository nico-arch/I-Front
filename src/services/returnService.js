import axios from "axios";

const API_ENDPOINT = `${API_URL_V1}/returns`;
const headers = {
  Authorization: `Bearer ${localStorage.getItem("token")}`,
};

// Créer un nouveau retour
export const addReturn = async (returnData) => {
  try {
    const response = await axios.post(`${API_ENDPOINT}/add`, returnData, {
      headers,
    });
    return response.data;
  } catch (err) {
    throw new Error(
      err.response?.data?.msg || "Erreur lors de la création du retour",
    );
  }
};

// Obtenir tous les retours
export const getReturns = async () => {
  try {
    const response = await axios.get(API_ENDPOINT, { headers });
    return response.data;
  } catch (err) {
    throw new Error(
      err.response?.data?.msg || "Erreur lors de la récupération des retours",
    );
  }
};

// Obtenir un retour par ID
export const getReturnById = async (id) => {
  try {
    const response = await axios.get(`${API_ENDPOINT}/${id}`, { headers });
    return response.data;
  } catch (err) {
    throw new Error(
      err.response?.data?.msg || "Erreur lors de la récupération du retour",
    );
  }
};

// Modifier un retour
export const editReturn = async (id, returnData) => {
  try {
    const response = await axios.put(`${API_ENDPOINT}/edit/${id}`, returnData, {
      headers,
    });
    return response.data;
  } catch (err) {
    throw new Error(
      err.response?.data?.msg || "Erreur lors de la modification du retour",
    );
  }
};

// Annuler un retour
export const cancelReturn = async (id) => {
  try {
    const response = await axios.delete(`${API_ENDPOINT}/cancel/${id}`, {
      headers,
    });
    return response.data;
  } catch (err) {
    throw new Error(
      err.response?.data?.msg || "Erreur lors de l'annulation du retour",
    );
  }
};
