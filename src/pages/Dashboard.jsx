// frontend/src/pages/Dashboard.js
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";

const Dashboard = () => {
  const history = useHistory();

  useEffect(() => {
    // Vérifier si l'utilisateur est authentifié
    const token = localStorage.getItem("token");
    if (!token) {
      // Rediriger vers la page de connexion si le token n'existe pas
      history.push("/login");
    }
  }, [history]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    history.push("/login");
  };

  return (
    <div className="container">
      <h2>Dashboard</h2>
      <button onClick={handleLogout} className="btn btn-danger">
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
