import axios from "axios";

// Assurez-vous que la variable globale API_URL_V1 est bien définie dans votre projet
const API_ENDPOINT = `${API_URL_V1}/sales`;
const headers = {
  Authorization: `Bearer ${localStorage.getItem("token")}`,
};

// Récupérer toutes les ventes
export const getSales = async () => {
  try {
    const response = await axios.get(API_ENDPOINT, { headers });
    return response.data;
  } catch (err) {
    throw new Error(
      err.response?.data?.msg ||
        "Erreur lors de la récupération des ventes " + err,
    );
  }
};

// Récupérer une vente par ID
export const getSaleById = async (id) => {
  try {
    const response = await axios.get(`${API_ENDPOINT}/${id}`, { headers });
    return response.data;
  } catch (err) {
    throw new Error(
      err.response?.data?.msg ||
        "Erreur lors de la récupération de la vente " + err,
    );
  }
};

// Créer une nouvelle vente
export const addSale = async (saleData) => {
  try {
    const response = await axios.post(`${API_ENDPOINT}/add`, saleData, {
      headers,
    });
    console.log("Sale response data", response.data);
    return response.data;
  } catch (err) {
    throw new Error(
      err.response?.data?.msg ||
        "Erreur lors de la création de la vente, error: " + err,
    );
  }
};

// Modifier une vente
export const editSale = async (id, saleData) => {
  try {
    const response = await axios.put(`${API_ENDPOINT}/edit/${id}`, saleData, {
      headers,
    });
    return response.data;
  } catch (err) {
    throw new Error(
      err.response?.data?.msg ||
        "Erreur lors de la modification de la vente " + err,
    );
  }
};

// Annuler une vente
export const cancelSale = async (id) => {
  try {
    const response = await axios.delete(`${API_ENDPOINT}/cancel/${id}`, {
      headers,
    });
    return response.data;
  } catch (err) {
    throw new Error(
      err.response?.data?.msg ||
        "Erreur lors de l'annulation de la vente " + err,
    );
  }
};

// Supprimer une vente annulée
export const deleteSale = async (id) => {
  try {
    const response = await axios.delete(`${API_ENDPOINT}/delete/${id}`, {
      headers,
    });
    return response.data;
  } catch (err) {
    //console.log(err);
    throw new Error(
      err.response?.data?.msg ||
        "Erreur lors de la suppression de la vente " + err,
    );
  }
};
