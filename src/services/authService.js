import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_ENDPOINT = `${API_URL_V1}/auth`;

/*export const login = async (email, password) => {
  try {
    console.log("Api endpoint: " + `${API_ENDPOINT}`);
    const response = await axios.post(`${API_ENDPOINT}/login`, {
      email,
      password,
    });
    const { token } = response.data;
    //console.log("token :" + token);
    console.log("login responses: " + { response });

    // Stocker le token dans le localStorage
    localStorage.setItem("token", token);

    return token;
  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
    throw error;
  }
};*/
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_ENDPOINT}/login`, {
      email,
      password,
    });
    const { token } = response.data;

    // Stocker le token dans le localStorage
    localStorage.setItem("token", token);

    // Décoder le JWT pour obtenir l'ID utilisateur
    const decoded = jwtDecode(token);
    localStorage.setItem("userId", decoded.user.id); // Stocker l'ID utilisateur séparément

    return token;
  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
    throw error;
  }
};

export const isAuthenticated = () => {
  // Vérifier si le token est présent dans le localStorage
  return !!localStorage.getItem("token");
};

export const logout = () => {
  // Supprimer le token et l'ID utilisateur du localStorage
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
};

/*export const logout = () => {
  // Supprimer le token du localStorage
  localStorage.removeItem("token");
};*/
