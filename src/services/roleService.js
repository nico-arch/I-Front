import axios from "axios";

const API_ENDPOINT = `${API_URL_V1}/roles`;

export const getRoles = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(API_ENDPOINT, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
