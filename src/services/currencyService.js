import axios from "axios";

const API_ENDPOINT = `${API_URL_V1}/currencies`;
const token = localStorage.getItem("token");
const headers = { Authorization: `Bearer ${token}` };

// Récupérer toutes les devises avec gestion d'erreur
export const getCurrencies = async () => {
  try {
    const response = await axios.get(API_ENDPOINT, { headers });
   //console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des devises :", error);
    // Vous pouvez également choisir de renvoyer une valeur par défaut ou de relancer l'erreur
    throw error;
  }
};
