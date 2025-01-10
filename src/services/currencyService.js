import axios from "axios";

const API_ENDPOINT = `${API_URL_V1}/currencies`;
const token = localStorage.getItem("token");
const headers = { Authorization: `Bearer ${token}` };

// Récupérer toutes les devises
export const getCurrencies = async () => {
  const response = await axios.get(API_ENDPOINT, { headers });
  return response.data;
};
