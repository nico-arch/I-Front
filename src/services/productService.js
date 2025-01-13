import axios from "axios";

const API_ENDPOINT = `${API_URL_V1}/products`;
const headers = {
  Authorization: `Bearer ${localStorage.getItem("token")}`,
};

// Récupérer tous les produits
export const getProducts = async () => {
  try {
    const response = await axios.get(API_ENDPOINT, { headers });
    return response.data;
  } catch (err) {
    throw new Error(
      err.response?.data?.msg || "Erreur lors de la récupération des produits",
    );
  }
};

// Ajouter un produit
export const addProduct = async (productData) => {
  try {
    const response = await axios.post(`${API_ENDPOINT}/create`, productData, {
      headers,
    });
    return response.data;
  } catch (err) {
    throw new Error(
      err.response?.data?.msg || "Erreur lors de l'ajout du produit",
    );
  }
};

// Modifier un produit
export const editProduct = async (id, productData) => {
  try {
    const response = await axios.put(
      `${API_ENDPOINT}/update/${id}`,
      productData,
      {
        headers,
      },
    );
    return response.data;
  } catch (err) {
    throw new Error(
      err.response?.data?.msg || "Erreur lors de la modification du produit",
    );
  }
};

// Supprimer un produit
export const deleteProduct = async (id) => {
  try {
    const response = await axios.delete(`${API_ENDPOINT}/delete/${id}`, {
      headers,
    });
    return response.data;
  } catch (err) {
    throw new Error(
      err.response?.data?.msg || "Erreur lors de la suppression du produit",
    );
  }
};
