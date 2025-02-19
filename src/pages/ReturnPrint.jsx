import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Button, Spinner, Table } from "react-bootstrap";
import Barcode from "react-barcode";
import { getReturnById } from "../services/returnService";
import { getUserById } from "../services/userService"; // Pour s'assurer que createdBy est complet
import "./printStyles.css"; // Vos styles d'impression personnalisés

const ReturnPrint = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [returnEntry, setReturnEntry] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReturn = async () => {
      try {
        let data = await getReturnById(id);
        // Si le champ createdBy n'est pas un objet complet, le compléter
        if (
          data.createdBy &&
          (typeof data.createdBy === "string" || !data.createdBy.firstName)
        ) {
          const user = await getUserById(data.createdBy);
          data.createdBy = user;
        }
        setReturnEntry(data);
      } catch (err) {
        console.error("Erreur lors de la récupération du retour :", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReturn();
  }, [id]);

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Chargement du retour...</p>
      </Container>
    );
  }

  if (!returnEntry) {
    return (
      <Container className="text-center mt-5">
        <h4>Retour introuvable</h4>
        <Button
          variant="primary"
          onClick={() => navigate(`/sales/returns/${returnEntry.sale._id}`)}
        >
          Retour
        </Button>
      </Container>
    );
  }

  const currencyCode = returnEntry.currency || "USD";

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
      <h1 className="text-center">
        <strong>Coin Des Trouvailles</strong>
      </h1>
      <h6 className="text-center">6 Rue Clerveaux Petionville</h6>
      <h6 className="text-center">coindestrouvailles1@gmail.com</h6>
      <h6 className="text-center">+509 41 35 0004</h6>
      <hr />
      <h5 className="text-center">Retour #{returnEntry._id}</h5>

      {/* Génération du code-barres basé sur l'ID du retour */}
      <div className="text-center my-3">
        <Barcode
          value={returnEntry._id}
          width={1}
          height={50}
          fontSize={12}
          margin={1}
        />
      </div>

      <hr />

      {/* Détails du retour */}
      <div>
        <p>
          <strong>Client :</strong>{" "}
          {returnEntry.client?.companyName ||
            `${returnEntry.client?.firstName} ${returnEntry.client?.lastName}` ||
            "N/A"}
        </p>
        <p>
          <strong>Effectué par :</strong>{" "}
          {returnEntry.createdBy
            ? `${returnEntry.createdBy.firstName} ${returnEntry.createdBy.lastName}`
            : "N/A"}
        </p>
        <p>
          <strong>Date :</strong>{" "}
          {new Date(returnEntry.createdAt).toLocaleDateString()}
        </p>
        <p>
          <strong>Heure :</strong>{" "}
          {new Date(returnEntry.createdAt).toLocaleTimeString()}
        </p>
        <p>
          <strong>Total remboursé :</strong>{" "}
          {Number(returnEntry.totalRefundAmount).toFixed(2)} {currencyCode}
        </p>
        <p>
          <strong>Statut du remboursement :</strong> {returnEntry.refundStatus}
        </p>
        <p>
          <strong>Remarques :</strong> {returnEntry.remarks || "-"}
        </p>
      </div>

      {/* Liste des produits retournés */}
      <h4 className="mt-4">Produits retournés</h4>
      <Table striped bordered className="mt-3">
        <thead>
          <tr>
            <th>Produit</th>
            <th>Quantité retournée</th>
            <th>Prix unitaire ({currencyCode})</th>
            <th>Total ({currencyCode})</th>
          </tr>
        </thead>
        <tbody>
          {returnEntry.products.map((item) => (
            <tr key={item.product._id}>
              <td>{item.product.productName}</td>
              <td>{item.quantity}</td>
              <td>{Number(item.price).toFixed(2)}</td>
              <td>{(item.quantity * item.price).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Boutons d'action en mode non-impression */}
      <div className="text-center mt-4 no-print">
        <Button
          variant="primary"
          onClick={() => navigate(`/sales/returns/${returnEntry.sale._id}`)}
        >
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

export default ReturnPrint;
