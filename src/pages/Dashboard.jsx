// frontend/src/pages/Dashboard.js
import React from "react";
import { useHistory } from "react-router-dom";

const Dashboard = () => {
  const history = useHistory();

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
