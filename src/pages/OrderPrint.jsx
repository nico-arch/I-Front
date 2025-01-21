import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderById } from "../services/orderService";

const OrderPrint = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      const orderData = await getOrderById(id);
      setOrder(orderData);
    } catch (err) {
      console.error("Erreur lors de la récupération de la commande :", err);
    }
  };

  if (!order) return <div>Chargement...</div>;

  const calculateProfit = (salePrice, purchasePrice, quantity) => {
    return (salePrice - purchasePrice) * quantity;
  };

  const totalProfit = order.products.reduce(
    (acc, item) =>
      acc + calculateProfit(item.salePrice, item.purchasePrice, item.quantity),
    0,
  );

  return (
    <div style={{ width: "8.5in", margin: "0 auto", padding: "1in" }}>
      <h2>Commande #{order._id}</h2>
      <p>
        <strong>Fournisseur:</strong> {order.supplier.companyName}
      </p>
      <p>
        <strong>Email:</strong> {order.supplier.emails[0]}
      </p>
      <p>
        <strong>Adresse:</strong> {order.supplier.addresses[0]}
      </p>
      <p>
        <strong>Date:</strong> {new Date(order.orderDate).toLocaleDateString()}
      </p>
      <p>
        <strong>Créé par:</strong> {order.createdBy.firstName}{" "}
        {order.createdBy.lastName}
      </p>
      <p>
        <strong>Statut:</strong> {order.status}
      </p>
      <h4>Détails de la commande</h4>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid black", padding: "8px" }}>
              Produit
            </th>
            <th style={{ border: "1px solid black", padding: "8px" }}>
              Quantité
            </th>
            <th style={{ border: "1px solid black", padding: "8px" }}>
              Prix d'achat
            </th>
            <th style={{ border: "1px solid black", padding: "8px" }}>
              Prix de vente
            </th>
            <th style={{ border: "1px solid black", padding: "8px" }}>
              Bénéfice par produit
            </th>
          </tr>
        </thead>
        <tbody>
          {order.products.map((item) => (
            <tr key={item.product._id}>
              <td style={{ border: "1px solid black", padding: "8px" }}>
                {item.product.productName}
              </td>
              <td style={{ border: "1px solid black", padding: "8px" }}>
                {item.quantity}
              </td>
              <td style={{ border: "1px solid black", padding: "8px" }}>
                {item.purchasePrice || "N/A"} USD
              </td>
              <td style={{ border: "1px solid black", padding: "8px" }}>
                {item.salePrice || "N/A"} USD
              </td>
              <td style={{ border: "1px solid black", padding: "8px" }}>
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
      </table>
      <p>
        <strong>Total:</strong> {order.totalAmount.toFixed(2)} USD
      </p>
      <p>
        <strong>Bénéfice total:</strong> {totalProfit.toFixed(2)} USD
      </p>
      <button
        onClick={() => navigate("/orders")}
        style={{
          marginTop: "20px",
          padding: "10px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        Retour
      </button>
    </div>
  );
};

export default OrderPrint;
