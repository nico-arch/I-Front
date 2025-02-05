import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderById } from "../services/orderService";
import { Table, Button, Card, Spinner, Container } from "react-bootstrap";
import Barcode from "react-barcode";
import "./printStyles.css"; // On suppose que vous importez un fichier CSS dédié à l'impression

const OrderPrint = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderData = await getOrderById(id);
        setOrder(orderData);
      } catch (err) {
        console.error("Erreur lors de la récupération de la commande :", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Chargement de la commande...</p>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container className="text-center mt-5">
        <h4>Commande introuvable</h4>
        <Button variant="primary" onClick={() => navigate("/orders")}>
          Retour
        </Button>
      </Container>
    );
  }

  const calculateProfit = (salePrice, purchasePrice, quantity) => {
    return (salePrice - purchasePrice) * quantity;
  };

  const totalProfit = order.products.reduce(
    (acc, item) =>
      acc + calculateProfit(item.salePrice, item.purchasePrice, item.quantity),
    0,
  );

  return (
    <div
      style={{
        width: "8.5in",
        margin: "0 auto",
        padding: "1in",
        fontFamily: "Arial, sans-serif",
      }}
      className="print-container"
    >
      <h2 className="text-center">Commande #{order._id}</h2>
      {/* Génération du code-barres basé sur l'ID de la vente */}
      <div className="text-center my-3">
        <Barcode
          value={order._id}
          width={1} // réduire la largeur des barres
          height={50} // définir une hauteur plus petite
          fontSize={12} // réduire la taille du texte affiché
          margin={1} // ajuster la marge
        />
      </div>
      <hr />
      <div>
        <p>
          <strong>Fournisseur :</strong> {order.supplier.companyName}
        </p>
        <p>
          <strong>Email :</strong> {order.supplier.emails[0]}
        </p>
        <p>
          <strong>Adresse :</strong> {order.supplier.addresses[0]}
        </p>
        <p>
          <strong>Date :</strong>{" "}
          {new Date(order.orderDate).toLocaleDateString()}
        </p>
        <p>
          <strong>Heure :</strong>{" "}
          {new Date(order.createdAt).toLocaleTimeString()}
        </p>
        <p>
          <strong>Créé par :</strong> {order.createdBy.firstName}{" "}
          {order.createdBy.lastName}
        </p>
        <p>
          <strong>Statut :</strong>{" "}
          <span
            style={{
              padding: "4px 8px",
              backgroundColor:
                order.status === "completed"
                  ? "#28a745"
                  : order.status === "pending"
                    ? "#ffc107"
                    : "#6c757d",
              color: "#fff",
              borderRadius: "4px",
            }}
          >
            {order.status}
          </span>
        </p>
      </div>
      <h4 className="mt-4">Détails de la commande</h4>
      <Table striped bordered className="mt-3">
        <thead>
          <tr>
            <th>Produit</th>
            <th>Quantité</th>
            <th>Prix d'achat</th>
            <th>Prix de vente</th>
            <th>Bénéfice par produit</th>
          </tr>
        </thead>
        <tbody>
          {order.products.map((item) => (
            <tr key={item.product._id}>
              <td>{item.product.productName}</td>
              <td>{item.quantity}</td>
              <td>{item.purchasePrice || "N/A"} USD</td>
              <td>{item.salePrice || "N/A"} USD</td>
              <td>
                {calculateProfit(
                  item.salePrice,
                  item.purchasePrice,
                  item.quantity,
                ).toFixed(2)}{" "}
                USD
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <p>
        <strong>Total :</strong> {order.totalAmount.toFixed(2)} USD
      </p>
      <p>
        <strong>Bénéfice total :</strong> {totalProfit.toFixed(2)} USD
      </p>
      <div className="text-center mt-4 no-print">
        <Button variant="primary" onClick={() => navigate("/orders")}>
          Retour
        </Button>
        <Button
          variant="secondary"
          className="ms-2 no-print"
          onClick={() => window.print()}
        >
          Imprimer
        </Button>
      </div>
    </div>
  );
};

export default OrderPrint;
