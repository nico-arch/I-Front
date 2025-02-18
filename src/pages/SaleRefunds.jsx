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
import { getRefundBySale, getRefundById } from "../services/refundService";
import {
  getRefundPayments,
  addRefundPayment,
  cancelRefundPayment,
  deleteRefundPayment,
} from "../services/refundPaymentService";

const SaleRefunds = () => {
  const { saleId } = useParams();
  const navigate = useNavigate();

  const [refund, setRefund] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // État pour le nouveau paiement de remboursement
  const [newPayment, setNewPayment] = useState({
    paymentAmount: "",
    paymentMethod: "cash",
    remarks: "",
  });

  // Charge le Refund associé à la vente
  const fetchRefund = async () => {
    try {
      //const refundData = await getRefundBySale(saleId);
      const refundData = await getRefundById(saleId);
      setRefund(refundData);
    } catch (err) {
      setError(err.message);
    }
  };

  // Charge la liste des paiements de remboursement pour ce refund
  const fetchPayments = async (refundId) => {
    try {
      const paymentsData = await getRefundPayments(refundId);
      setPayments(paymentsData);
    } catch (err) {
      setError(err.message);
    }
  };

  // Chargement initial
  useEffect(() => {
    const loadData = async () => {
      await fetchRefund();
      setLoading(false);
    };
    loadData();
  }, [saleId]);

  // Lorsque le refund est chargé, on charge ses paiements
  useEffect(() => {
    //if (refund && refund._id) {
    // fetchPayments(refund._id);
    //}
    if (saleId) {
      // Ici, le saleId est le refundId
      fetchPayments(saleId);
    }
  }, [refund]);

  // Calcul du montant total déjà remboursé (paiements non annulés)
  const totalRefundPaid = payments
    .filter((p) => p.paymentStatus !== "cancelled")
    .reduce((acc, p) => acc + p.paymentAmount, 0);

  // Le montant restant à rembourser est celui indiqué dans refund.totalRefundAmount
  const remainingRefund = refund ? refund.totalRefundAmount : 0;

  const handleInputChange = (e) => {
    setNewPayment({
      ...newPayment,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddRefundPayment = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const paymentAmount = parseFloat(newPayment.paymentAmount);
    if (paymentAmount <= 0) {
      setError("Le montant doit être supérieur à 0.");
      return;
    }
    if (paymentAmount > remainingRefund) {
      setError(
        `Le montant saisi dépasse le montant restant à rembourser (${remainingRefund} ${refund.currency}).`,
      );
      return;
    }

    try {
      const paymentData = {
        //refundId: refund._id,
        refundId: saleId,
        paymentAmount,
        paymentMethod: newPayment.paymentMethod,
        remarks: newPayment.remarks,
      };
      await addRefundPayment(paymentData);
      setSuccess("Paiement de remboursement ajouté avec succès.");
      // Rechargez les paiements et le refund mis à jour
      await fetchRefund();
      await fetchPayments(refund._id);
      setNewPayment({ paymentAmount: "", paymentMethod: "cash", remarks: "" });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancelRefundPayment = async (paymentId) => {
    setError("");
    setSuccess("");
    try {
      await cancelRefundPayment(paymentId);
      setSuccess("Paiement de remboursement annulé avec succès.");
      await fetchRefund();
      await fetchPayments(refund._id);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteRefundPayment = async (paymentId) => {
    if (
      window.confirm("Êtes-vous sûr de vouloir supprimer ce paiement annulé ?")
    ) {
      setError("");
      setSuccess("");
      try {
        await deleteRefundPayment(paymentId);
        setSuccess("Paiement de remboursement supprimé avec succès.");
        await fetchPayments(refund._id);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Chargement du remboursement...</p>
      </Container>
    );
  }

  if (!refund) {
    return (
      <Container className="text-center mt-5">
        <h4>Aucun remboursement trouvé pour cette vente.</h4>
        <Button variant="secondary" onClick={() => navigate("/sales")}>
          Retour
        </Button>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Card className="shadow p-4">
        <h2 className="text-center mb-4">
          Gestion des Paiements de Remboursement pour la Vente #{refund.sale}
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

        {/* Informations sur le remboursement */}
        <Row className="mt-4">
          <Col md={6}>
            <h5>Détails du Remboursement</h5>
            <p>
              <strong>Montant total à rembourser :</strong>{" "}
              {refund.totalRefundAmount.toFixed(2)} {refund.currency}
            </p>
            <p>
              <strong>Montant déjà remboursé :</strong>{" "}
              {totalRefundPaid.toFixed(2)} {refund.currency}
            </p>
            <p>
              <strong>Montant restant :</strong> {remainingRefund.toFixed(2)}{" "}
              {refund.currency}
            </p>
          </Col>
        </Row>

        {/* Formulaire pour ajouter un paiement de remboursement */}
        <Card className="mt-4 p-3">
          <h5>Ajouter un Paiement de Remboursement</h5>
          <Form onSubmit={handleAddRefundPayment}>
            <Form.Group className="mb-2" controlId="refundPaymentAmount">
              <Form.Label>
                Montant (max: {remainingRefund.toFixed(2)} {refund.currency})
              </Form.Label>
              <Form.Control
                type="number"
                name="paymentAmount"
                value={newPayment.paymentAmount}
                onChange={handleInputChange}
                placeholder="Montant"
                required
                min="0"
                max={remainingRefund}
              />
            </Form.Group>
            <Form.Group className="mb-2" controlId="refundPaymentType">
              <Form.Label>Type de Paiement</Form.Label>
              <Form.Select
                name="paymentMethod"
                value={newPayment.paymentMethod}
                onChange={handleInputChange}
                required
              >
                <option value="cash">Espèces</option>
                <option value="check">Chèque</option>
                <option value="bank_transfer">Virement bancaire</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-2" controlId="refundPaymentRemarks">
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
              Ajouter le Paiement de Remboursement
            </Button>
          </Form>
        </Card>

        {/* Liste des paiements de remboursement */}
        <h4 className="mt-4">Liste des Paiements de Remboursement</h4>
        {payments.length === 0 ? (
          <p>
            Aucun paiement de remboursement enregistré pour ce remboursement.
          </p>
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
                    {payment.paymentAmount} {payment.currency}
                  </td>
                  <td>{payment.paymentMethod}</td>
                  <td>{payment.remarks || "-"}</td>
                  <td>
                    {payment.processedBy
                      ? `${payment.processedBy.firstName} ${payment.processedBy.lastName}`
                      : "N/A"}
                  </td>
                  <td>
                    {payment.paymentStatus !== "cancelled" && (
                      <Button
                        variant="warning"
                        size="sm"
                        onClick={() => handleCancelRefundPayment(payment._id)}
                      >
                        Annuler
                      </Button>
                    )}
                    {payment.paymentStatus === "cancelled" && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteRefundPayment(payment._id)}
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

export default SaleRefunds;
