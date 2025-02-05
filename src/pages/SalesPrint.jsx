import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSaleById } from "../services/saleService";
import { getUserById } from "../services/userService";
import { Table, Button, Spinner, Container } from "react-bootstrap";
import Barcode from "react-barcode";

const SalesPrint = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sale, setSale] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSale = async () => {
      let saleData = null;
      try {
        saleData = await getSaleById(id);
      } catch (err) {
        console.error("Erreur lors de la récupération de la vente :", err);
      }

      try {
        // Si le champ createdBy n'est pas un objet utilisateur complet, on le remplace par les données récupérées
        if (
          saleData.createdBy &&
          (typeof saleData.createdBy === "string" ||
            !saleData.createdBy.firstName)
        ) {
          const user = await getUserById(saleData.createdBy);
          saleData.createdBy = user;
        }
        setSale(saleData);
      } catch (err) {
        console.error(
          "Erreur lors de la récupération des informations de l'utilisateur ayant créé la vente :",
          err,
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSale();
  }, [id]);

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Chargement de la vente...</p>
      </Container>
    );
  }

  if (!sale) {
    return (
      <Container className="text-center mt-5">
        <h4>Vente introuvable</h4>
        <Button variant="primary" onClick={() => navigate("/sales")}>
          Retour
        </Button>
      </Container>
    );
  }

  // Exemple de fonction de calcul du profit (à adapter selon vos besoins)
  const calculateProfit = (salePrice, purchasePrice, quantity) => {
    return (salePrice - purchasePrice) * quantity;
  };

  const totalProfit = sale.products.reduce(
    (acc, item) =>
      acc + calculateProfit(item.price, item.purchasePrice || 0, item.quantity),
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
      <h2 className="text-center">Vente #{sale._id}</h2>

      {/* Génération du code-barres basé sur l'ID de la vente */}
      <div className="text-center my-3">
        <Barcode value={sale._id} />
      </div>

      <hr />

      <div>
        <p>
          <strong>Client :</strong>{" "}
          {sale.client
            ? sale.client.companyName ||
              `${sale.client.firstName} ${sale.client.lastName}`
            : "N/A"}
        </p>
        <p>
          <strong>Créé par :</strong>{" "}
          {sale.createdBy
            ? `${sale.createdBy.firstName} ${sale.createdBy.lastName}`
            : "N/A"}
        </p>
        <p>
          <strong>Date :</strong>{" "}
          {new Date(sale.createdAt).toLocaleDateString()}
        </p>
        <p>
          <strong>Heure :</strong>{" "}
          {new Date(sale.createdAt).toLocaleTimeString()}
        </p>
        <p>
          <strong>Remarques :</strong> {sale.remarks || "Aucune"}
        </p>
        <p>
          <strong>Type de vente :</strong>{" "}
          {sale.creditSale ? "À crédit" : "Normale"} - {sale.saleStatus}
        </p>
      </div>

      <h4 className="mt-4">Détails de la vente</h4>
      <Table striped bordered className="mt-3">
        <thead>
          <tr>
            <th>Produit</th>
            <th>Quantité</th>
            <th>Prix unitaire (USD)</th>
            <th>Tax (%)</th>
            <th>Remise (%)</th>
            <th>Total (USD)</th>
          </tr>
        </thead>
        <tbody>
          {sale.products.map((item) => (
            <tr key={item.product._id}>
              <td>{item.product.productName}</td>
              <td>{item.quantity}</td>
              <td>{Number(item.price).toFixed(2)}</td>
              <td>{item.tax}</td>
              <td>{item.discount}</td>
              <td>{Number(item.total).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <p>
        <strong>Total de la vente :</strong>{" "}
        {Number(sale.totalAmount).toFixed(2)} USD
      </p>
      {sale.purchasePrice && (
        <p>
          <strong>Bénéfice total :</strong> {totalProfit.toFixed(2)} USD
        </p>
      )}

      <div className="text-center mt-4">
        <Button variant="primary" onClick={() => navigate("/sales")}>
          Retour
        </Button>
        <Button
          variant="secondary"
          className="ms-2"
          onClick={() => window.print()}
        >
          Imprimer
        </Button>
      </div>
    </div>
  );
};

export default SalesPrint;
