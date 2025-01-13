import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Clients from "./pages/Clients";
import Login from "./pages/Login";
import Categories from "./pages/Categories"; // Importer le composant Categories
import Products from "./pages/Products"; // Importer le composant Products

const App = () => {
  // Fonction pour vérifier si l'utilisateur est authentifié
  const isAuthenticated = () => {
    return localStorage.getItem("token") !== null;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            isAuthenticated() ? (
              <Layout>
                <Dashboard />
              </Layout>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/users"
          element={
            isAuthenticated() ? (
              <Layout>
                <Users />
              </Layout>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/clients"
          element={
            isAuthenticated() ? (
              <Layout>
                <Clients />
              </Layout>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/categories"
          element={
            isAuthenticated() ? (
              <Layout>
                <Categories />
              </Layout>
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/products"
          element={
            isAuthenticated() ? (
              <Layout>
                <Products />
              </Layout>
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* Ajouter d'autres routes ici si nécessaire */}
      </Routes>
    </Router>
  );
};

export default App;
