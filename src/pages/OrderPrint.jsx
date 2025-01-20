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
      //console.log("Supplier email :" + order.supplier.email);
    } catch (err) {
      console.error(
        "Erreur lors de la récupération de la commande. error:" + err,
      );
    }
  };

  if (!order) return <div>Chargement...</div>;

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
            <th style={{ border: "1px solid black", padding: "8px" }}>Prix</th>
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
                {item.price} USD
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>
        <strong>Total:</strong> {order.totalAmount} USD
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
