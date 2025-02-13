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
import { useParams, useNavigate } from "react-router-dom";
import { getSaleById } from "../services/saleService";
import { addReturn } from "../services/returnService";

const SaleReturns = () => {
  const { saleId } = useParams();
  const navigate = useNavigate();

  const [sale, setSale] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // État pour les produits à retourner : on initialise une liste avec chaque produit et une quantité de retour à 0
  const [returnProducts, setReturnProducts] = useState([]);
  const [remarks, setRemarks] = useState("");

  // Lors du chargement de la vente, on initialise returnProducts avec les produits de la vente
  useEffect(() => {
    const fetchSale = async () => {
      try {
        const saleData = await getSaleById(saleId);
        setSale(saleData);
        // Pour chaque produit de la vente, créer un objet avec le champ returnQuantity initialisé à 0
        const initialReturns = saleData.products.map((p) => ({
          productId: p.product._id,
          productName: p.product.productName,
          barcode: p.product.barcode,
          soldQuantity: p.quantity,
          price: p.price, // le prix utilisé pour le calcul de remboursement
          returnQuantity: 0,
        }));
        setReturnProducts(initialReturns);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSale();
  }, [saleId]);

  // Calculer le montant total à rembourser en fonction des quantités retournées
  const totalRefund = returnProducts.reduce((acc, prod) => {
    return acc + prod.returnQuantity * prod.price;
  }, 0);

  // Mettre à jour la quantité à retourner pour un produit donné
  const handleReturnQuantityChange = (index, value) => {
    const updated = [...returnProducts];
    // Convertir la valeur en entier et s'assurer qu'elle ne dépasse pas la quantité vendue
    const qty = Math.min(parseInt(value) || 0, updated[index].soldQuantity);
    updated[index].returnQuantity = qty;
    setReturnProducts(updated);
  };

  // Soumission du formulaire de retour
  const handleSubmitReturn = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Filtrer les produits pour lesquels une quantité de retour est supérieure à zéro
    const productsToReturn = returnProducts.filter(
      (prod) => prod.returnQuantity > 0,
    );
    if (productsToReturn.length === 0) {
      setError("Veuillez sélectionner au moins un produit à retourner.");
      return;
    }

    // Préparer la liste des produits à retourner au format attendu par le backend
    const returnProductsData = productsToReturn.map((prod) => ({
      // Remplacer "product" par "productId" pour correspondre à ce que le backend attend
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
      // Optionnel : rediriger ou réinitialiser le formulaire
      // navigate('/sales');
    } catch (err) {
      setError(err.message);
    }
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
        <h2 className="text-center mb-4">Retour sur la Vente #{sale._id}</h2>
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

        <Row className="mt-4">
          <Col md={6}>
            <h5>Détails de la Vente</h5>
            <p>
              <strong>Client :</strong>{" "}
              {sale.client.companyName ||
                `${sale.client.firstName} ${sale.client.lastName}`}
            </p>
            <p>
              <strong>Total de la Vente :</strong> {sale.totalAmount}{" "}
              {sale.currency.currencyCode}
            </p>
          </Col>
        </Row>

        <h4 className="mt-4">Sélection des produits à retourner</h4>
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

        <Button variant="primary" className="mt-3" onClick={handleSubmitReturn}>
          Valider le Retour
        </Button>
      </Card>
    </Container>
  );
};

export default SaleReturns;
