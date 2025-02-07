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
import {
  getPaymentsBySale,
  addPayment,
  cancelPayment,
  deletePayment,
} from "../services/paymentService";

const SalePayments = () => {
  const { saleId } = useParams();
  const navigate = useNavigate();

  const [sale, setSale] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // État pour le nouveau paiement
  const [newPayment, setNewPayment] = useState({
    amount: "",
    paymentType: "cash",
    remarks: "",
  });

  // Charger la vente et ses paiements associés
  useEffect(() => {
    const fetchData = async () => {
      try {
        const saleData = await getSaleById(saleId);
        setSale(saleData);
        const paymentsData = await getPaymentsBySale(saleId);
        setPayments(paymentsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [saleId]);

  // Calculer le montant total déjà payé en excluant les paiements annulés
  const totalPaid = payments
    .filter((payment) => payment.paymentStatus !== "cancelled")
    .reduce((acc, payment) => acc + payment.amount, 0);

  // Calculer le montant restant à payer
  const remainingAmount = sale ? sale.totalAmount - totalPaid : 0;

  const handleInputChange = (e) => {
    setNewPayment({
      ...newPayment,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddPayment = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Vérifier que la vente n'est pas annulée
    if (sale.saleStatus === "cancelled") {
      setError("Impossible d'ajouter un paiement sur une vente annulée.");
      return;
    }

    const paymentAmount = parseFloat(newPayment.amount);
    if (paymentAmount > remainingAmount) {
      setError("Le montant saisi dépasse le montant restant à payer.");
      return;
    }

    try {
      const paymentData = {
        saleId: saleId,
        clientId: sale.client._id,
        amount: paymentAmount,
        currency: sale.currency.currencyCode, // Devise de la vente
        paymentType: newPayment.paymentType,
        remarks: newPayment.remarks,
      };

      await addPayment(paymentData);
      setSuccess("Paiement ajouté avec succès.");
      // Rafraîchir la liste des paiements
      const paymentsData = await getPaymentsBySale(saleId);
      setPayments(paymentsData);
      // Réinitialiser le formulaire
      setNewPayment({
        amount: "",
        paymentType: "cash",
        remarks: "",
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancelPayment = async (paymentId) => {
    setError("");
    setSuccess("");
    try {
      await cancelPayment(paymentId);
      setSuccess("Paiement annulé avec succès.");
      const paymentsData = await getPaymentsBySale(saleId);
      setPayments(paymentsData);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeletePayment = async (paymentId) => {
    if (
      window.confirm("Êtes-vous sûr de vouloir supprimer ce paiement annulé ?")
    ) {
      try {
        await deletePayment(paymentId);
        setSuccess("Paiement supprimé avec succès.");
        const paymentsData = await getPaymentsBySale(saleId);
        setPayments(paymentsData);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Chargement...</p>
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
          Gestion des Paiements pour la Vente #{sale._id}
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
            <p>
              <strong>Déjà payé :</strong> {totalPaid}{" "}
              {sale.currency.currencyCode}
            </p>
            <p>
              <strong>Montant restant :</strong> {remainingAmount}{" "}
              {sale.currency.currencyCode}
            </p>
          </Col>
          <Col md={6}>
            <h5>Ajouter un Paiement</h5>
            <Form onSubmit={handleAddPayment}>
              <Form.Group className="mb-2" controlId="paymentAmount">
                <Form.Label>
                  Montant (max: {remainingAmount} {sale.currency.currencyCode})
                </Form.Label>
                <Form.Control
                  type="number"
                  name="amount"
                  value={newPayment.amount}
                  onChange={handleInputChange}
                  placeholder="Montant"
                  required
                  min="0"
                  max={remainingAmount}
                />
              </Form.Group>
              <Form.Group className="mb-2" controlId="paymentType">
                <Form.Label>Type de Paiement</Form.Label>
                <Form.Select
                  name="paymentType"
                  value={newPayment.paymentType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="cash">Espèces</option>
                  <option value="check">Chèque</option>
                  <option value="bank_transfer">Virement bancaire</option>
                  <option value="card">Carte</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-2" controlId="paymentRemarks">
                <Form.Label>Remarques</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="remarks"
                  value={newPayment.remarks}
                  onChange={handleInputChange}
                  placeholder="Remarques éventuelles"
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Ajouter le Paiement
              </Button>
            </Form>
          </Col>
        </Row>

        <h4 className="mt-4">Liste des Paiements</h4>
        {payments.length === 0 ? (
          <p>Aucun paiement enregistré pour cette vente.</p>
        ) : (
          <Table striped bordered className="mt-3">
            <thead>
              <tr>
                <th>Date</th>
                <th>Montant</th>
                <th>Type</th>
                <th>Remarques</th>
                <th>Effectué par</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment._id}>
                  <td>{new Date(payment.createdAt).toLocaleString()}</td>
                  <td>
                    {payment.amount} {payment.currency}
                  </td>
                  <td>{payment.paymentType}</td>
                  <td>{payment.remarks || "-"}</td>
                  <td>
                    {payment.createdBy
                      ? `${payment.createdBy.firstName} ${payment.createdBy.lastName}`
                      : "N/A"}
                  </td>
                  <td>
                    {payment.paymentStatus !== "cancelled" && (
                      <Button
                        variant="warning"
                        size="sm"
                        onClick={() => handleCancelPayment(payment._id)}
                      >
                        Annuler
                      </Button>
                    )}
                    {payment.paymentStatus === "cancelled" && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeletePayment(payment._id)}
                      >
                        Supprimer
                      </Button>
                    )}
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

export default SalePayments;
