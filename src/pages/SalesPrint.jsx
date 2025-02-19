import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSaleById } from "../services/saleService";
import { getUserById } from "../services/userService";
import { Table, Button, Spinner, Container, Form } from "react-bootstrap";
import Barcode from "react-barcode";
import "./printStyles.css"; // Styles améliorés

const SalesPrint = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sale, setSale] = useState(null);
  const [loading, setLoading] = useState(true);
  const [printFormat, setPrintFormat] = useState("letter");

  useEffect(() => {
    const fetchSale = async () => {
      let saleData = null;
      try {
        saleData = await getSaleById(id);
      } catch (err) {
        console.error("Erreur lors de la récupération de la vente :", err);
      }

      try {
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
          "Erreur lors de la récupération des informations de l'utilisateur :",
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

  const currencyCode = sale.currency?.currencyCode || "USD";

  return (
    <div className={`print-container ${printFormat}`}>
      {/* En-tête */}
      <div className="header-section">
        <h1 className="text-center">
          <strong>Coin Des Trouvailles</strong>
        </h1>
        <h6 className="text-center">6 Rue Clerveaux Petionville</h6>
        <h6 className="text-center">coindestrouvailles1@gmail.com</h6>
        <h6 className="text-center">+509 41 35 0004</h6>
        <hr />
        <h5 className="text-center">Vente #{sale._id}</h5>
      </div>

      {/* Code-barres */}
      <div className="barcode text-center">
        <Barcode
          value={sale._id}
          width={1}
          height={50}
          fontSize={12}
          margin={1}
        />
      </div>

      <hr />

      {/* Détails de la vente */}
      <div>
        <p>
          <strong>Client :</strong>{" "}
          {sale.client?.companyName ||
            `${sale.client?.firstName} ${sale.client?.lastName}` ||
            "N/A"}
        </p>
        <p>
          <strong>Créé par :</strong> {sale.createdBy?.firstName}{" "}
          {sale.createdBy?.lastName}
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
          <strong>Type de vente :</strong>{" "}
          {sale.creditSale ? "À crédit" : "Normale"} - {sale.saleStatus}
        </p>
      </div>

      {/* Tableau des produits */}
      <Table striped bordered className="mt-3">
        <thead>
          <tr>
            <th>Produit</th>
            <th>Quantité</th>
            <th>Prix unitaire ({currencyCode})</th>
            <th>Remise (%)</th>
            <th>Total ({currencyCode})</th>
          </tr>
        </thead>
        <tbody>
          {sale.products.map((item) => (
            <tr key={item.product._id}>
              <td>{item.product.productName}</td>
              <td>{item.quantity}</td>
              <td>{Number(item.price).toFixed(2)}</td>
              <td>{item.discount}</td>
              <td>{Number(item.total).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Total */}
      <p className="total-summary">
        Total : {Number(sale.totalAmount).toFixed(2)} {currencyCode}
      </p>
      {/* Remarks */}
      <p className="">
        <strong>Remarque :</strong> {sale.remarks || "Aucun remarque"}
      </p>

      {/* Bouton Retour */}
      <div className="text-center mt-4 no-print">
        <Button variant="primary" onClick={() => navigate("/sales")}>
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

export default SalesPrint;
