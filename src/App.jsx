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
import ExchangeRate from "./pages/ExchangeRate"; // Importer le composant ExchangeRate
import Suppliers from "./pages/Suppliers"; // Importer le composant Suppliers
import Orders from "./pages/Orders"; // Importer le composant Orders
import OrderPrint from "./pages/OrderPrint"; // Importer le composant OrderPrint

const App = () => {
  // Fonction pour vérifier si l'utilisateur est authentifié
  const userId = localStorage.getItem("userId");
  if (userId) {
    console.log("Utilisateur connecté avec ID :", userId);
  } else {
    console.log("Aucun utilisateur connecté.");
  }

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

        <Route
          path="/exchange-rate"
          element={
            isAuthenticated() ? (
              <Layout>
                <ExchangeRate />
              </Layout>
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/suppliers"
          element={
            isAuthenticated() ? (
              <Layout>
                <Suppliers />
              </Layout>
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/orders"
          element={
            isAuthenticated() ? (
              <Layout>
                <Orders />
              </Layout>
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/orders/print/:id"
          element={isAuthenticated() ? <OrderPrint /> : <Navigate to="/" />}
        />

        {/* Ajouter d'autres routes ici si nécessaire */}
      </Routes>
    </Router>
  );
};

export default App;
