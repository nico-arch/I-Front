import axios from "axios";

const API_ENDPOINT = `${API_URL_V1}/suppliers`;
const token = localStorage.getItem("token");
const headers = { Authorization: `Bearer ${token}` };

// Récupérer tous les fournisseurs
export const getSuppliers = async () => {
  try {
    const response = await axios.get(API_ENDPOINT, { headers });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.msg ||
        "Erreur lors de la récupération des fournisseurs",
    );
  }
};

// Ajouter un nouveau fournisseur
export const addSupplier = async (supplierData) => {
  try {
    const response = await axios.post(`${API_ENDPOINT}/add`, supplierData, {
      headers,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.msg || "Erreur lors de l'ajout du fournisseur",
    );
  }
};

// Modifier un fournisseur existant
export const editSupplier = async (id, supplierData) => {
  try {
    const response = await axios.put(
      `${API_ENDPOINT}/edit/${id}`,
      supplierData,
      { headers },
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.msg ||
        "Erreur lors de la modification du fournisseur",
    );
  }
};

// Supprimer un fournisseur
export const deleteSupplier = async (id) => {
  try {
    const response = await axios.delete(`${API_ENDPOINT}/delete/${id}`, {
      headers,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.msg ||
        "Erreur lors de la suppression du fournisseur",
    );
  }
};
