import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  ListGroup,
  Spinner,
  Alert,
  Button
} from "react-bootstrap";
import {
  FaShoppingCart,
  FaMoneyBillWave,
  FaUsers,
  FaExclamationTriangle,
  FaReceipt,
} from "react-icons/fa";

// Import des services depuis le dossier approprié
import { getSales } from "../services/saleService";
import { getClients } from "../services/clientService";
import { getProducts } from "../services/productService";

const Dashboard = () => {
  const navigate = useNavigate();

  const [sales, setSales] = useState([]);
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Récupération des données dès le chargement du composant
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [salesData, clientsData, productsData] = await Promise.all([
          getSales(),
          getClients(),
          getProducts(),
        ]);
        setSales(salesData);
        setClients(clientsData);
        setProducts(productsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fonction utilitaire pour obtenir le code de devise d'une vente
  const getCurrencyCode = (sale) => {
    if (sale.currency) {
      if (typeof sale.currency === "object" && sale.currency.currencyCode) {
        return sale.currency.currencyCode;
      }
      return sale.currency;
    }
    return null;
  };

  // Filtrer les ventes selon la devise
  const salesUSD = sales.filter((sale) => getCurrencyCode(sale) === "USD");
  const salesHTG = sales.filter((sale) => getCurrencyCode(sale) === "HTG");

  // Calculer le nombre de ventes et le revenu total pour chaque devise
  const totalSalesUSD = salesUSD.length;
  const totalRevenueUSD = salesUSD.reduce(
    (acc, sale) => acc + sale.totalAmount,
    0,
  );

  const totalSalesHTG = salesHTG.length;
  const totalRevenueHTG = salesHTG.reduce(
    (acc, sale) => acc + sale.totalAmount,
    0,
  );

  // Ventes récentes : triées par date décroissante
  const recentSales = [...sales]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 4);

  // Alertes de stock : on considère faible si stockQuantity ≤ 5
  const lowStockProducts = products.filter(
    (product) => product.stockQuantity <= 5,
  );

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Chargement...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="mt-4">
      <h1>
        Bienvenue {localStorage.getItem("userFirstName")}{" "}
        {localStorage.getItem("userLastName")} !
      </h1>
      <Row>
        {/* Ventes en HTG */}
        <Col md={4} sm={6} xs={12} className="mb-4">
          <Card className="text-center shadow">
            <Card.Body>
              <FaShoppingCart size={40} className="text-primary mb-3" />
              <Card.Title>Ventes en HTG</Card.Title>
              <Card.Text>
                <div>
                  <strong>Nombre de ventes:</strong> {totalSalesHTG}
                </div>
                <div>
                  <strong>Revenu:</strong> {totalRevenueHTG.toLocaleString()}{" "}
                  HTG
                </div>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        {/* Ventes en USD */}
        <Col md={4} sm={6} xs={12} className="mb-4">
          <Card className="text-center shadow">
            <Card.Body>
              <FaMoneyBillWave size={40} className="text-success mb-3" />
              <Card.Title>Ventes en USD</Card.Title>
              <Card.Text>
                <div>
                  <strong>Nombre de ventes:</strong> {totalSalesUSD}
                </div>
                <div>
                  <strong>Revenu:</strong> {totalRevenueUSD.toLocaleString()}{" "}
                  USD
                </div>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        {/* Clients enregistrés */}
        <Col md={4} sm={6} xs={12} className="mb-4">
          <Card className="text-center shadow">
            <Card.Body>
              <FaUsers size={40} className="text-info mb-3" />
              <Card.Title>Clients enregistrés</Card.Title>
              <Card.Text>
                <h3>{clients.length}</h3>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Ventes récentes et alertes de stock */}
      <Row>
        <Col md={6} sm={12} className="mb-4">
          <Card className="shadow">
            <Card.Header className="bg-primary text-white">
              <FaReceipt className="me-2" />
              Ventes récentes
            </Card.Header>
            <Card.Body>
              <ListGroup>
                {recentSales.length > 0 ? (
                  recentSales.map((sale) => (
                    <ListGroup.Item key={sale._id}>
                      Vente #{sale._id} - {sale.totalAmount.toLocaleString()}{" "}
                      {getCurrencyCode(sale)}
                    </ListGroup.Item>
                  ))
                ) : (
                  <ListGroup.Item>Aucune vente récente</ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} sm={12} className="mb-4">
          <Card className="shadow">
            <Card.Header className="bg-danger text-white">
              <FaExclamationTriangle className="me-2" />
              Alertes de stock
            </Card.Header>
            <Card.Body>
              <ListGroup>
                {lowStockProducts.length > 0 ? (
                  lowStockProducts.map((product) => (
                    <ListGroup.Item
                      key={product._id}
                      className={
                        product.stockQuantity === 0 ? "text-danger" : ""
                      }
                    >
                      {product.productName} - {product.stockQuantity} unités
                      restantes
                    </ListGroup.Item>
                  ))
                ) : (
                  <ListGroup.Item>Aucune alerte de stock</ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {/* Nouveau bouton pour le rapport d'inventaire */}
      <Row>
        <Col>
          <Card className="shadow">
            <Card.Body className="text-center">
              <Card.Title>Rapport d'inventaire</Card.Title>
              <Card.Text>
                Générez un rapport d'inventaire par catégorie pour vérifier le stock physique.
              </Card.Text>
              <Button variant="primary" onClick={() => navigate("/stock-report")}>
                Voir le rapport
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
