import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  Row,
  Col,
  Table,
  Button,
  Form,
  Alert,
  Spinner,
} from "react-bootstrap";
import { FaEye } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import { getSaleById } from "../services/saleService";
import {
  addReturn,
  getReturnsBySale,
  cancelReturn,
} from "../services/returnService";
import { getRefundBySale } from "../services/refundService";

const SaleReturns = () => {
  const { saleId } = useParams();
  const navigate = useNavigate();

  const [sale, setSale] = useState(null);
  const [refund, setRefund] = useState(null); // Refund associé à la vente
  const [returns, setReturns] = useState([]); // Liste des retours existants pour cette vente
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // État pour la création d'un nouveau retour
  const [returnProducts, setReturnProducts] = useState([]);
  const [remarks, setRemarks] = useState("");

  // Charger la vente et initialiser l'état pour le retour
  const fetchSaleData = async () => {
    try {
      const saleData = await getSaleById(saleId);
      setSale(saleData);
      // Initialiser returnProducts à partir des produits de la vente (en s'assurant que le produit est peuplé)
      const initialReturns = saleData.products
        .filter((p) => p.product)
        .map((p) => ({
          productId: p.product._id.toString(),
          productName: p.product.productName,
          barcode: p.product.barcode,
          soldQuantity: p.quantity,
          price: p.price, // Prix utilisé pour le calcul du remboursement
          returnQuantity: 0,
        }));
      setReturnProducts(initialReturns);
    } catch (err) {
      setError(err.message);
    }
  };

  // Charger le refund associé à la vente
  const fetchRefundData = async () => {
    try {
      const refundData = await getRefundBySale(saleId);
      setRefund(refundData);
    } catch (err) {
      console.error("Erreur lors de la récupération du refund :", err);
      // Si aucun refund n'est trouvé, on laisse refund à null
      setRefund(null);
    }
  };

  // Charger la liste des retours existants pour la vente
  const fetchReturnsData = async () => {
    try {
      const returnsData = await getReturnsBySale(saleId);
      setReturns(returnsData);
    } catch (err) {
      console.error("Erreur lors de la récupération des retours :", err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchSaleData();
      await fetchRefundData();
      await fetchReturnsData();
      setLoading(false);
    };
    loadData();
  }, [saleId]);

  // Calculer le montant total à rembourser pour le nouveau retour
  const totalRefund = returnProducts.reduce(
    (acc, prod) => acc + prod.returnQuantity * prod.price,
    0,
  );

  // Limiter la quantité de retour à la quantité vendue
  const handleReturnQuantityChange = (index, value) => {
    const updated = [...returnProducts];
    const qty = Math.min(parseInt(value) || 0, updated[index].soldQuantity);
    updated[index].returnQuantity = qty;
    setReturnProducts(updated);
  };

  // Soumission du formulaire de retour
  const handleSubmitReturn = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const productsToReturn = returnProducts.filter(
      (prod) => prod.returnQuantity > 0,
    );
    if (productsToReturn.length === 0) {
      setError("Veuillez sélectionner au moins un produit à retourner.");
      return;
    }

    const returnProductsData = productsToReturn.map((prod) => ({
      productId: prod.productId,
      quantity: prod.returnQuantity,
      price: prod.price,
    }));

    const payload = {
      saleId: sale._id,
      clientId: sale.client._id,
      products: returnProductsData,
      remarks,
    };

    try {
      const response = await addReturn(payload);
      setSuccess("Retour enregistré avec succès.");
      // Rafraîchir les données après création
      await fetchSaleData();
      await fetchReturnsData();
      await fetchRefundData();
      setRemarks("");
      // Réinitialiser returnProducts à partir de la vente actualisée
      if (sale) {
        const updatedReturns = sale.products
          .filter((p) => p.product)
          .map((p) => ({
            productId: p.product._id.toString(),
            productName: p.product.productName,
            barcode: p.product.barcode,
            soldQuantity: p.quantity,
            price: p.price,
            returnQuantity: 0,
          }));
        setReturnProducts(updatedReturns);
		window.location.reload();
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Annuler un retour
  const handleCancelReturn = async (returnId) => {
    setError("");
    setSuccess("");
    try {
      await cancelReturn(returnId);
      setSuccess("Retour annulé avec succès.");
      await fetchReturnsData();
      await fetchSaleData();
      await fetchRefundData();
    } catch (err) {
      setError(err.message);
    }
  };

  // Afficher les détails d'un retour (peut ouvrir un modal ou rediriger)
  const handleViewReturn = (returnId) => {
    console.log("Afficher les détails pour le retour", returnId);
    // Vous pouvez rediriger ou ouvrir un modal avec les détails du retour
  };

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
        <Button onClick={() => navigate("/sales")}>Retour</Button>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Card className="shadow p-4">
        <h2 className="text-center mb-4">
          Gestion des Retours pour la Vente #{sale._id}
        </h2>
        <Button variant="secondary" onClick={() => navigate("/sales")}>
          Retour
        </Button>
        {error && (
          <Alert variant="danger" className="mt-3">
            {error}
          </Alert>
        )}
        {success && (
          <Alert variant="success" className="mt-3">
            {success}
          </Alert>
        )}

        {refund && (
          <Alert variant="info" className="mt-3">
            Montant actuel du Refund :{" "}
            {Number(refund.totalRefundAmount).toFixed(2)}{" "}
            {sale.currency.currencyCode}
          </Alert>
        )}

        {/* Formulaire pour ajouter un nouveau retour */}
        <Card className="mt-4 p-3">
          <h5>Ajouter un Retour</h5>
          <Table striped bordered className="mt-3">
            <thead>
              <tr>
                <th>Produit</th>
                <th>Quantité vendue</th>
                <th>Prix unitaire ({sale.currency.currencyCode})</th>
                <th>Quantité à retourner</th>
                <th>Montant du retour</th>
              </tr>
            </thead>
            <tbody>
              {returnProducts.map((prod, index) => (
                <tr key={prod.productId}>
                  <td>{prod.productName}</td>
                  <td>{prod.soldQuantity}</td>
                  <td>{Number(prod.price).toFixed(2)}</td>
                  <td>
                    <Form.Control
                      type="number"
                      min="0"
                      max={prod.soldQuantity}
                      value={prod.returnQuantity}
                      onChange={(e) =>
                        handleReturnQuantityChange(index, e.target.value)
                      }
                    />
                  </td>
                  <td>
                    {(prod.returnQuantity * prod.price).toFixed(2)}{" "}
                    {sale.currency.currencyCode}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <h5 className="mt-3">
            Montant total à rembourser: {totalRefund.toFixed(2)}{" "}
            {sale.currency.currencyCode}
          </h5>
          <Form.Group className="mt-3" controlId="returnRemarks">
            <Form.Label>Remarques</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Saisir des remarques concernant le retour"
            />
          </Form.Group>
          <Button
            variant="primary"
            className="mt-3"
            onClick={handleSubmitReturn}
          >
            Valider le Retour
          </Button>
        </Card>

        {/* Liste des retours existants pour la vente */}
        <h4 className="mt-4">Retours existants</h4>
        {returns.length === 0 ? (
          <p>Aucun retour enregistré pour cette vente.</p>
        ) : (
          <Table striped bordered className="mt-3">
            <thead>
              <tr>
                <th>ID</th>
                <th>Date / Heure</th>
                <th>Montant remboursé</th>
                <th>Effectué par</th>
                <th>Remarques</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {returns.map((ret) => (
                <tr key={ret._id}>
                  <td>{ret._id}</td>
                  <td>{new Date(ret.createdAt).toLocaleString()}</td>
                  <td>
                    {Number(ret.totalRefundAmount).toFixed(2)}{" "}
                    {sale.currency.currencyCode}
                  </td>
                  <td>
                    {ret.createdBy
                      ? `${ret.createdBy.firstName} ${ret.createdBy.lastName}`
                      : "N/A"}
                  </td>
                  <td>{ret.remarks || "-"}</td>
                  <td>
                    {/* <Button
                      variant="info"
                      size="sm"
                      className="me-2"
                      onClick={() => handleViewReturn(ret._id)}
                    >
                      Afficher
                    </Button> */}
                    <Button
                      variant="info"
                      size="sm"
                      onClick={() => navigate(`/returns/print/${ret._id}`)}
                    >
                      <FaEye />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </Container>
  );
};

export default SaleReturns;
