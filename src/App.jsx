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
import Sales from "./pages/Sales"; // Page pour la gestion des ventes
import SalesPrint from "./pages/SalesPrint"; // Page pour l'impression des ventes
import SalePayments from "./pages/SalePayments"; // Page pour la gestion des paiements de vente
import SaleReturns from "./pages/SaleReturns"; // Assurez-vous que le chemin est correct
import SaleRefunds from "./pages/SaleRefunds"; // Import de la page de gestion des paiements de remboursement
import ReturnPrint from "./pages/ReturnPrint"; // Import de la page ReturnPrint

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

        <Route
          path="/sales"
          element={
            <Layout>
              <Sales /> {/* Section pour la gestion des ventes */}
            </Layout>
          }
        />

        <Route
          path="/sales/print/:id"
          element={isAuthenticated() ? <SalesPrint /> : <Navigate to="/" />}
        />

        <Route
          path="/sales/payments/:saleId"
          element={
            isAuthenticated() ? (
              <Layout>
                <SalePayments />
              </Layout>
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/sales/returns/:saleId"
          element={
            isAuthenticated() ? (
              <Layout>
                <SaleReturns />
              </Layout>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/sales/refunds/:saleId"
          element={
            isAuthenticated() ? (
              <Layout>
                <SaleRefunds />
              </Layout>
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/returns/print/:id"
          element={
            isAuthenticated() ? (
              <Layout>
                <ReturnPrint />
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
