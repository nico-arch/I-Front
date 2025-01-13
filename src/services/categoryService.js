import axios from "axios";

const API_ENDPOINT = `${API_URL_V1}/categories`;
const headers = {
  Authorization: `Bearer ${localStorage.getItem("token")}`,
};

// Récupérer toutes les catégories
export const getCategories = async () => {
  try {
    const response = await axios.get(API_ENDPOINT, { headers });
    return response.data;
  } catch (err) {
    throw new Error(
      err.response?.data?.msg ||
        "Erreur lors de la récupération des catégories",
    );
  }
};

// Ajouter une catégorie
export const addCategory = async (categoryData) => {
  try {
    const response = await axios.post(`${API_ENDPOINT}/add`, categoryData, {
      headers,
    });
    return response.data;
  } catch (err) {
    throw new Error(
      err.response?.data?.msg || "Erreur lors de l'ajout de la catégorie",
    );
  }
};

// Modifier une catégorie
export const editCategory = async (id, categoryData) => {
  try {
    const response = await axios.put(
      `${API_ENDPOINT}/edit/${id}`,
      categoryData,
      {
        headers,
      },
    );
    return response.data;
  } catch (err) {
    throw new Error(
      err.response?.data?.msg ||
        "Erreur lors de la modification de la catégorie",
    );
  }
};

// Supprimer une catégorie
export const deleteCategory = async (id) => {
  try {
    const response = await axios.delete(`${API_ENDPOINT}/delete/${id}`, {
      headers,
    });
    return response.data;
  } catch (err) {
    throw new Error(
      err.response?.data?.msg ||
        "Erreur lors de la suppression de la catégorie",
    );
  }
};
