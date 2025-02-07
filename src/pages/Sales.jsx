import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Table,
  Form,
  Alert,
  Pagination,
  Card,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaSearch,
  FaPrint,
  FaMoneyBillWave, // Importation de l'icône pour les paiements
} from "react-icons/fa";
import {
  getSales,
  addSale,
  editSale,
  cancelSale,
  deleteSale,
} from "../services/saleService";
import { getClients } from "../services/clientService";
import { getProducts } from "../services/productService";
import { getCurrencies } from "../services/currencyService";
import { getCurrentRate } from "../services/exchangeRateService";
import { useNavigate } from "react-router-dom";

const Sales = () => {
  // États pour les données principales
  const [sales, setSales] = useState([]);
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  // Taux de change et devise à utiliser pour la vente en cours
  const [exchangeRate, setExchangeRate] = useState(1);
  const [currency, setCurrency] = useState("USD"); // Code de la devise (modifiable en création)

  // États pour la vente en cours
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [creditSale, setCreditSale] = useState(false);

  // États pour l'affichage, recherche et messages dans le modal
  const [searchClient, setSearchClient] = useState("");
  const [searchProduct, setSearchProduct] = useState("");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentSale, setCurrentSale] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  // Détermine si les produits de la vente peuvent être modifiés.
  // En création, c'est toujours possible.
  // En modification, c'est possible uniquement si le statut est "pending" et que la vente n'est pas à crédit.
  const canEditProducts =
    !currentSale ||
    (currentSale && currentSale.saleStatus === "pending" && !creditSale);

  // Calcul du montant total de la vente à partir des totaux des produits sélectionnés
  const totalSale = selectedProducts.reduce(
    (acc, product) => acc + product.total,
    0,
  );

  // Chargement initial des données
  useEffect(() => {
    fetchSales();
    fetchClients();
    fetchProducts();
    fetchCurrencies();
    fetchExchangeRate();
  }, []);

  const fetchSales = async () => {
    try {
      const salesData = await getSales();
      setSales(salesData);
    } catch (err) {
      setError("Erreur lors du chargement des ventes.");
    }
  };

  const fetchClients = async () => {
    try {
      const clientsData = await getClients();
      setClients(clientsData);
    } catch (err) {
      setError("Erreur lors du chargement des clients. " + err);
    }
  };

  const fetchProducts = async () => {
    try {
      const productsData = await getProducts();
      setProducts(productsData);
    } catch (err) {
      setError("Erreur lors du chargement des produits. " + err);
    }
  };

  const fetchCurrencies = async () => {
    try {
      const currenciesData = await getCurrencies();
      setCurrencies(currenciesData);
    } catch (err) {
      setError("Erreur lors du chargement des devises. " + err);
    }
  };

  // En création, on utilise le taux actuel (déjà chargé via fetchExchangeRate).
  // En modification, on utilisera le taux enregistré dans la vente.
  const fetchExchangeRate = async () => {
    try {
      const rateData = await getCurrentRate();
      setExchangeRate(rateData.currentRate);
    } catch (err) {
      setError("Erreur lors du chargement du taux de change. " + err);
    }
  };

  // Ouverture du modal de création/modification
  const handleShowModal = (sale = null) => {
    setError("");
    setSuccess("");
    setCurrentSale(sale);
    if (sale) {
      // Mode modification : utiliser le taux enregistré dans la vente et fixer la devise
      setExchangeRate(sale.exchangeRate);
      setCurrency(sale.currency.currencyCode);
      setRemarks(sale.remarks || "");
      setCreditSale(sale.creditSale);
      // Charger les produits à partir de la vente existante
      const loadedProducts = sale.products.map((p) => {
        // Le prix enregistré est en USD (basePrice)
        const basePrice = p.price;
        // Utiliser le taux enregistré (sale.exchangeRate) pour recalculer le prix affiché
        const displayedPrice =
          sale.currency.currencyCode === "USD"
            ? basePrice
            : basePrice * sale.exchangeRate;
        const total =
          (displayedPrice +
            (displayedPrice * p.tax) / 100 -
            (displayedPrice * p.discount) / 100) *
          p.quantity;
        return {
          productId: p.product._id,
          productName: p.product.productName,
          barcode: p.product.barcode,
          quantity: p.quantity,
          basePrice: basePrice,
          price: displayedPrice,
          tax: p.tax,
          discount: p.discount,
          total: total,
        };
      });
      setSelectedProducts(loadedProducts);
      setSelectedClient(sale.client);
    } else {
      // Mode création : réinitialiser les valeurs
      setSelectedProducts([]);
      setSelectedClient(null);
      setRemarks("");
      setCreditSale(false);
      // La devise et le taux restent ceux chargés (modifiable en création)
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setError("");
  };

  // Ajout d'un produit depuis la liste (affichage du stock)
  const handleAddProduct = (product) => {
    if (selectedProducts.find((p) => p.productId === product._id)) {
      setError("Ce produit a déjà été ajouté.");
      return;
    }
    const basePrice = product.priceUSD;
    const convertedPrice =
      currency === "USD" ? basePrice : basePrice * exchangeRate;
    setSelectedProducts([
      ...selectedProducts,
      {
        productId: product._id,
        productName: product.productName,
        barcode: product.barcode,
        quantity: 1,
        basePrice: basePrice,
        price: convertedPrice,
        tax: 0,
        discount: 0,
        total: convertedPrice,
      },
    ]);
  };

  const handleRemoveProduct = (productId) => {
    setSelectedProducts(
      selectedProducts.filter((p) => p.productId !== productId),
    );
  };

  // Modification d'un champ (quantité, taxe, remise) d'un produit sélectionné
  // Le champ prix est calculé automatiquement et n'est pas modifiable
  const handleChangeProduct = (index, field, value) => {
    const updatedProducts = [...selectedProducts];
    if (field === "price") return;
    updatedProducts[index][field] = value;
    updatedProducts[index].total =
      (updatedProducts[index].price +
        (updatedProducts[index].price * updatedProducts[index].tax) / 100 -
        (updatedProducts[index].price * updatedProducts[index].discount) /
          100) *
      updatedProducts[index].quantity;
    setSelectedProducts(updatedProducts);
  };

  // Gestion du changement de devise en mode création
  // En modification, la devise est figée.
  const handleCurrencyChange = (e) => {
    const selectedCurrency = e.target.value;
    const updatedProducts = selectedProducts.map((product) => {
      const newPrice =
        selectedCurrency === "USD"
          ? product.basePrice
          : product.basePrice * exchangeRate;
      const newTotal =
        (newPrice +
          (newPrice * product.tax) / 100 -
          (newPrice * product.discount) / 100) *
        product.quantity;
      return { ...product, price: newPrice, total: newTotal };
    });
    setSelectedProducts(updatedProducts);
    setCurrency(selectedCurrency);
  };

  // Soumission du formulaire de création/modification de vente
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedClient) {
      setError("Veuillez sélectionner un client.");
      return;
    }
    if (selectedProducts.length === 0) {
      setError("Veuillez ajouter au moins un produit.");
      return;
    }
    // Recherche de l'objet devise correspondant au code sélectionné
    const selectedCurrencyObj = currencies.find(
      (cur) => cur.currencyCode === currency,
    );
    if (!selectedCurrencyObj) {
      setError("La devise sélectionnée est introuvable.");
      return;
    }
    const productsForSale = selectedProducts.map((product) => ({
      productId: product.productId,
      quantity: product.quantity,
      price: product.basePrice, // Prix de base en USD
      tax: product.tax,
      discount: product.discount,
    }));

    const saleData = {
      clientId: selectedClient._id,
      currencyId: selectedCurrencyObj._id,
      products: productsForSale,
      creditSale,
      remarks,
    };

    try {
      if (currentSale) {
        await editSale(currentSale._id, saleData);
        setSuccess("Vente modifiée avec succès.");
      } else {
        await addSale(saleData);
        setSuccess("Vente créée avec succès.");
      }
      // Rafraîchir la liste des ventes ET la liste des produits pour tenir compte du stock
      fetchSales();
      fetchProducts();
      handleCloseModal();
    } catch (err) {
      setError("Erreur lors de la création/modification de la vente. " + err);
    }
  };

  const handleCancelSale = async (saleId) => {
    try {
      await cancelSale(saleId);
      setSuccess("Vente annulée avec succès.");
      fetchSales();
    } catch (err) {
      setError("Erreur lors de l'annulation de la vente. " + err);
    }
  };

  const handleDeleteSale = async (saleId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette vente ?")) {
      try {
        await deleteSale(saleId);
        setSuccess("Vente supprimée avec succès.");
        fetchSales();
      } catch (err) {
        setError("Erreur lors de la suppression de la vente. " + err);
      }
    }
  };

  const handlePrintSale = (saleId) => {
    navigate(`/sales/print/${saleId}`);
  };

  // Filtrage pour la recherche dans la liste des ventes
  const filteredSales = sales.filter((sale) => {
    const clientName = sale.client
      ? sale.client.companyName ||
        `${sale.client.firstName || ""} ${sale.client.lastName || ""}`
      : "";
    const status = sale.saleStatus.toLowerCase();
    const totalAmount = sale.totalAmount.toString();
    const saleId = sale._id.toLowerCase();
    const searchLower = search.toLowerCase();
    return (
      clientName.toLowerCase().includes(searchLower) ||
      status.includes(searchLower) ||
      totalAmount.includes(searchLower) ||
      saleId.includes(searchLower)
    );
  });

  // Filtrage pour la recherche dans la liste des clients
  const filteredClients = clients.filter((client) =>
    `${client.companyName || client.firstName + " " + client.lastName}`
      .toLowerCase()
      .includes(searchClient.toLowerCase()),
  );

  // Filtrage pour la recherche dans la liste des produits
  const filteredProducts = products.filter(
    (product) =>
      product.productName.toLowerCase().includes(searchProduct.toLowerCase()) ||
      product.barcode?.toLowerCase().includes(searchProduct.toLowerCase()),
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSales = filteredSales.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Container fluid className="mt-4">
      <Row>
        <Col>
          <Card className="shadow p-4">
            <h2 className="text-center mb-4">Gestion des ventes</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <div className="d-flex justify-content-between align-items-center mb-3">
              <Button variant="primary" onClick={() => handleShowModal()}>
                <FaPlus className="me-2" />
                Créer une vente
              </Button>
              <div className="d-flex align-items-center">
                <FaSearch className="me-2" />
                <Form.Control
                  type="text"
                  placeholder="Rechercher une vente..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ width: "300px" }}
                />
              </div>
            </div>

            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Client</th>
                  <th>Date</th>
                  <th>Statut</th>
                  <th>Type</th>
                  <th>Total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentSales.map((sale) => {
                  const saleType = sale.creditSale
                    ? "Credit " + sale.saleStatus
                    : "Normal " + sale.saleStatus;
                  return (
                    <tr key={sale._id}>
                      <td>{sale._id}</td>
                      <td>
                        {sale.client
                          ? sale.client.companyName ||
                            `${sale.client.firstName || ""} ${sale.client.lastName || ""}`
                          : ""}
                      </td>
                      <td>{new Date(sale.createdAt).toLocaleDateString()}</td>
                      <td>{sale.saleStatus}</td>
                      <td>{saleType}</td>
                      <td>
                        {sale.totalAmount}{" "}
                        {sale.currency && sale.currency.currencyCode
                          ? sale.currency.currencyCode
                          : "USD"}
                      </td>

                      <td>
                        <Button
                          variant="info"
                          className="me-2"
                          onClick={() =>
                            navigate(`/sales/payments/${sale._id}`)
                          }
                        >
                          <FaMoneyBillWave />
                        </Button>

                        <Button
                          variant="warning"
                          className="me-2"
                          onClick={() => handleShowModal(sale)}
                        >
                          <FaEdit className="me-1" />
                        </Button>
                        <Button
                          variant="danger"
                          className="me-2"
                          onClick={() => handleDeleteSale(sale._id)}
                        >
                          <FaTrash className="me-1" />
                        </Button>
                        <Button
                          variant="outline-danger"
                          onClick={() => handleCancelSale(sale._id)}
                        >
                          <FaTimes className="me-1" />
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() => handlePrintSale(sale._id)}
                        >
                          <FaPrint className="me-1" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>

            <Pagination className="mt-3 justify-content-center">
              {Array.from({
                length: Math.ceil(filteredSales.length / itemsPerPage),
              }).map((_, index) => (
                <Pagination.Item
                  key={index + 1}
                  active={index + 1 === currentPage}
                  onClick={() => paginate(index + 1)}
                >
                  {index + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          </Card>
        </Col>
      </Row>

      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {currentSale ? "Modifier" : "Créer"} une vente
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Alerte d'erreur dans le modal */}
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Row>
              {/* Colonne Clients */}
              <Col md={6}>
                <h5 className="mb-3">Clients</h5>
                <Form.Control
                  type="text"
                  placeholder="Rechercher un client"
                  value={searchClient}
                  onChange={(e) => setSearchClient(e.target.value)}
                  className="mb-2"
                />
                <div
                  className="p-2 border rounded bg-light"
                  style={{ maxHeight: "200px", overflowY: "auto" }}
                >
                  {filteredClients.map((client) => (
                    <div
                      key={client._id}
                      className="d-flex justify-content-between align-items-center my-2"
                    >
                      <span>
                        {client.companyName ||
                          `${client.firstName} ${client.lastName}`}
                      </span>
                      <Button
                        variant={
                          selectedClient?._id === client._id
                            ? "success"
                            : "outline-primary"
                        }
                        size="sm"
                        onClick={() => setSelectedClient(client)}
                      >
                        {selectedClient?._id === client._id
                          ? "Sélectionné"
                          : "Sélectionner"}
                      </Button>
                    </div>
                  ))}
                </div>
                {selectedClient && (
                  <Alert variant="info" className="mt-2">
                    Client sélectionné :{" "}
                    {selectedClient.companyName ||
                      `${selectedClient.firstName} ${selectedClient.lastName}`}
                  </Alert>
                )}
              </Col>

              {/* Colonne Produits */}
              <Col md={6}>
                <h5 className="mb-3">Produits (Stock affiché)</h5>
                <Form.Control
                  type="text"
                  placeholder="Rechercher un produit"
                  value={searchProduct}
                  onChange={(e) => setSearchProduct(e.target.value)}
                  className="mb-2"
                />
                <div
                  className="p-2 border rounded bg-light"
                  style={{ maxHeight: "200px", overflowY: "auto" }}
                >
                  {filteredProducts.map((product) => (
                    <div
                      key={product._id}
                      className="d-flex justify-content-between align-items-center my-2"
                    >
                      <span>
                        {product.productName} - Barcode: {product.barcode} -{" "}
                        {product.priceUSD} USD – Stock: {product.stockQuantity}
                      </span>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleAddProduct(product)}
                      >
                        Ajouter
                      </Button>
                    </div>
                  ))}
                </div>
              </Col>
            </Row>

            {/* Section Devise et Taux de change */}
            <Row className="mt-3">
              <Col md={6}>
                <h5>Devise</h5>
                <Form.Select
                  value={currency}
                  onChange={handleCurrencyChange}
                  disabled={!!currentSale} // En modification, la devise est figée
                >
                  {currencies.map((cur) => (
                    <option key={cur._id} value={cur.currencyCode}>
                      {cur.currencyName} ({cur.currencyCode})
                    </option>
                  ))}
                </Form.Select>
                <h6 className="mt-2">
                  Taux de change de la vente :{" "}
                  {exchangeRate ? exchangeRate : "N/A"}
                </h6>
              </Col>
              <Col md={6}>
                {currentSale ? (
                  <div className="mt-4">
                    <strong>Type de vente :</strong>{" "}
                    {creditSale ? "À crédit" : "Normale"}
                  </div>
                ) : (
                  <Form.Group controlId="creditSale" className="mt-4">
                    <Form.Check
                      type="checkbox"
                      label="Vente à crédit"
                      checked={creditSale}
                      onChange={(e) => setCreditSale(e.target.checked)}
                    />
                  </Form.Group>
                )}
              </Col>
            </Row>

            {/* Section Remarques */}
            <Row className="mt-3">
              <Col>
                <h5>Remarques</h5>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Saisir des remarques..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                />
              </Col>
            </Row>

            {/* Tableau des produits sélectionnés */}
            <h5 className="mt-4">Produits sélectionnés</h5>
            <Table striped bordered hover className="mt-3">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Barcode</th>
                  <th>Quantité</th>
                  <th>Prix ({currency})</th>
                  <th>Tax (%)</th>
                  <th>Remise (%)</th>
                  <th>Total ({currency})</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {selectedProducts.map((product, index) => (
                  <tr key={index}>
                    <td>{product.productName}</td>
                    <td>{product.barcode}</td>
                    <td>
                      <Form.Control
                        type="number"
                        min="1"
                        value={product.quantity}
                        onChange={(e) =>
                          handleChangeProduct(
                            index,
                            "quantity",
                            parseFloat(e.target.value),
                          )
                        }
                        disabled={!canEditProducts}
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="number"
                        value={product.price}
                        readOnly
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="number"
                        min="0"
                        value={product.tax}
                        onChange={(e) =>
                          handleChangeProduct(
                            index,
                            "tax",
                            parseFloat(e.target.value),
                          )
                        }
                        disabled={!canEditProducts}
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="number"
                        min="0"
                        value={product.discount}
                        onChange={(e) =>
                          handleChangeProduct(
                            index,
                            "discount",
                            parseFloat(e.target.value),
                          )
                        }
                        disabled={!canEditProducts}
                      />
                    </td>
                    <td>{product.total?.toFixed(2) || 0}</td>
                    <td>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleRemoveProduct(product.productId)}
                        disabled={!canEditProducts}
                      >
                        Retirer
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {/* Affichage du montant total de la vente */}
            <h5 className="mt-3">
              Montant total de la vente : {totalSale.toFixed(2)} {currency}
            </h5>

            <Button variant="primary" type="submit" className="mt-3 w-100">
              {currentSale ? "Modifier" : "Créer"} la vente
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Sales;
