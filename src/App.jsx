import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";

const App = () => (
  <Router>
    <Routes>
      {/* Route de connexion */}
      <Route path="/" element={<Login />} />

      {/* Route du tableau de bord (protégée) */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </PrivateRoute>
        }
      />

      {/* Route de gestion des utilisateurs (protégée) */}
      <Route
        path="/users"
        element={
          <PrivateRoute>
            <Layout>
              <Users />
            </Layout>
          </PrivateRoute>
        }
      />
    </Routes>
  </Router>
);

export default App;
