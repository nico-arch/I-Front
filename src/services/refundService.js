import axios from "axios";

const API_ENDPOINT = `${API_URL_V1}/refunds`;
const headers = {
  Authorization: `Bearer ${localStorage.getItem("token")}`,
};

// Créer un nouveau remboursement
export const addRefund = async (refundData) => {
  try {
    const response = await axios.post(`${API_ENDPOINT}/add`, refundData, {
      headers,
    });
    return response.data;
  } catch (err) {
    throw new Error(
      err.response?.data?.msg || "Erreur lors de la création du remboursement.",
    );
  }
};

// Obtenir tous les remboursements
export const getRefunds = async () => {
  try {
    const response = await axios.get(API_ENDPOINT, { headers });
    return response.data;
  } catch (err) {
    throw new Error(
      err.response?.data?.msg ||
        "Erreur lors de la récupération des remboursements.",
    );
  }
};

// Obtenir un remboursement par ID
export const getRefundById = async (id) => {
  try {
    const response = await axios.get(`${API_ENDPOINT}/${id}`, { headers });
    return response.data;
  } catch (err) {
    throw new Error(
      err.response?.data?.msg ||
        "Erreur lors de la récupération du remboursement.",
    );
  }
};

// Modifier un remboursement
export const editRefund = async (id, refundData) => {
  try {
    const response = await axios.put(`${API_ENDPOINT}/edit/${id}`, refundData, {
      headers,
    });
    return response.data;
  } catch (err) {
    throw new Error(
      err.response?.data?.msg ||
        "Erreur lors de la modification du remboursement.",
    );
  }
};

// Annuler un remboursement
export const cancelRefund = async (id) => {
  try {
    const response = await axios.put(
      `${API_ENDPOINT}/cancel/${id}`,
      {},
      {
        headers,
      },
    );
    return response.data;
  } catch (err) {
    throw new Error(
      err.response?.data?.msg ||
        "Erreur lors de l'annulation du remboursement.",
    );
  }
};

// **Nouvelle fonction : Obtenir le refund par vente**
export const getRefundBySale = async (saleId) => {
  try {
    const response = await axios.get(`${API_ENDPOINT}/sale/${saleId}`, {
      headers,
    });
    return response.data;
  } catch (err) {
    throw new Error(
      err.response?.data?.msg ||
        "Erreur lors de la récupération du refund par vente",
    );
  }
};
