import axios from "axios";

const API_ENDPOINT = `${API_URL_V1}/payments`;
const headers = {
  Authorization: `Bearer ${localStorage.getItem("token")}`,
};

export const addPayment = async (paymentData) => {
  try {
    const response = await axios.post(`${API_ENDPOINT}/add`, paymentData, {
      headers,
    });
    return response.data;
  } catch (err) {
    throw new Error(
      err.response?.data?.msg || "Erreur lors de la création du paiement",
    );
  }
};

export const getPayments = async () => {
  try {
    const response = await axios.get(API_ENDPOINT, { headers });
    return response.data;
  } catch (err) {
    throw new Error(
      err.response?.data?.msg || "Erreur lors de la récupération des paiements",
    );
  }
};

export const getPaymentsBySale = async (saleId) => {
  try {
    const response = await axios.get(`${API_ENDPOINT}/sale/${saleId}`, {
      headers,
    });
    return response.data;
  } catch (err) {
    throw new Error(
      err.response?.data?.msg ||
        "Erreur lors de la récupération des paiements de la vente",
    );
  }
};

export const editPayment = async (paymentId, paymentData) => {
  try {
    const response = await axios.put(
      `${API_ENDPOINT}/edit/${paymentId}`,
      paymentData,
      { headers },
    );
    return response.data;
  } catch (err) {
    throw new Error(
      err.response?.data?.msg || "Erreur lors de la modification du paiement",
    );
  }
};

export const cancelPayment = async (paymentId) => {
  try {
    const response = await axios.put(
      `${API_ENDPOINT}/cancel/${paymentId}`,
      {},
      { headers },
    );
    return response.data;
  } catch (err) {
    throw new Error(
      err.response?.data?.msg || "Erreur lors de l'annulation du paiement",
    );
  }
};

export const deletePayment = async (paymentId) => {
  try {
    const response = await axios.delete(`${API_ENDPOINT}/delete/${paymentId}`, {
      headers,
    });
    return response.data;
  } catch (err) {
    throw new Error(
      err.response?.data?.msg || "Erreur lors de la suppression du paiement",
    );
  }
};
