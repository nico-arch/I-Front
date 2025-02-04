import axios from "axios";

const API_ENDPOINT = `${API_URL_V1}/exchangeRates`;
const token = localStorage.getItem("token");
const headers = { Authorization: `Bearer ${token}` };

// Obtenir le taux de change actuel avec gestion d'erreur
export const getCurrentRate = async () => {
  try {
    const response = await axios.get(`${API_ENDPOINT}/current-rate`, {
      headers,
    });
    //console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération du taux de change actuel :",
      error,
    );
    throw error;
  }
};

// Mettre à jour le taux de change avec gestion d'erreur
export const updateExchangeRate = async (rate) => {
  try {
    const response = await axios.post(
      `${API_ENDPOINT}/update-rate`,
      { rate },
      { headers },
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du taux de change :", error);
    throw error;
  }
};
