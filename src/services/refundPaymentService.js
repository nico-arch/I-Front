import axios from "axios";

const API_ENDPOINT = `${API_URL_V1}/refundPayment`;
const headers = {
  Authorization: `Bearer ${localStorage.getItem("token")}`,
};

// Ajouter un paiement de remboursement
export const addRefundPayment = async (paymentData) => {
  try {
    const response = await axios.post(`${API_ENDPOINT}/add`, paymentData, {
      headers,
    });
    return response.data;
  } catch (err) {
    throw new Error(
      err.response?.data?.msg ||
        "Erreur lors de l'ajout du paiement de remboursement.",
    );
  }
};

// Obtenir les paiements d'un remboursement
export const getRefundPayments = async (refundId) => {
  try {
    const response = await axios.get(`${API_ENDPOINT}/${refundId}`, {
      headers,
    });
    return response.data;
  } catch (err) {
    throw new Error(
      err.response?.data?.msg ||
        "Erreur lors de la récupération des paiements de remboursement. Error:" + err,
    );
  }
};

// Annuler un paiement de remboursement
export const cancelRefundPayment = async (id) => {
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
        "Erreur lors de l'annulation du paiement de remboursement.",
    );
  }
};

// Supprimer un paiement de remboursement (ajouté)
export const deleteRefundPayment = async (paymentId) => {
  try {
    const response = await axios.delete(`${API_ENDPOINT}/delete/${paymentId}`, {
      headers,
    });
    return response.data;
  } catch (err) {
    throw new Error(
      err.response?.data?.msg ||
        "Erreur lors de la suppression du paiement de remboursement.",
    );
  }
};
