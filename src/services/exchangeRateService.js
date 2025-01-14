import axios from "axios";

const API_ENDPOINT = `${API_URL_V1}/exchangeRates`;
const token = localStorage.getItem("token");
const headers = { Authorization: `Bearer ${token}` };

// Obtenir le taux de change actuel
export const getCurrentRate = async () => {
  const response = await axios.get(`${API_ENDPOINT}/current-rate`, { headers });
  return response.data;
};

// Mettre à jour le taux de change
export const updateExchangeRate = async (rate) => {
  const response = await axios.post(
    `${API_ENDPOINT}/update-rate`,
    { rate },
    { headers },
  );
  return response.data;
};
