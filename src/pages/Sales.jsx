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
  // États liés aux données et à la gestion des ventes
  const [sales, setSales] = useState([]);
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  // États pour la gestion des devises et du taux de change
  const [currencies, setCurrencies] = useState([]);
  const [exchangeRate, setExchangeRate] = useState(1);
  const [currency, setCurrency] = useState("USD"); // Stocke le code de la devise

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [searchClient, setSearchClient] = useState("");
  const [searchProduct, setSearchProduct] = useState("");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentSale, setCurrentSale] = useState(null);
  // Pour indiquer qu'il s'agit d'une vente à crédit (seulement lors de la création ou si modifiable)
  const [creditSale, setCreditSale] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  // Détermine si la modification des produits est autorisée :
  // Pour une vente nouvelle, c'est toujours possible.
  // Pour une vente en modification, c'est possible uniquement si la vente est "pending" et n'est pas à crédit.
  const canEditProducts =
    !currentSale ||
    (currentSale && currentSale.saleStatus === "pending" && !creditSale);

  // Calcul du montant total de la vente (somme des totaux des produits sélectionnés)
  const totalSale = selectedProducts.reduce(
    (acc, product) => acc + product.total,
    0,
  );

  useEffect(() => {
    fetchSales();
    fetchClients();
    fetchProducts();
    fetchCurrencies();
    fetchExchangeRate();
  }, []);

  // Récupération des ventes depuis l'API
  const fetchSales = async () => {
    try {
      const salesData = await getSales();
      setSales(salesData);
    } catch (err) {
      setError("Erreur lors du chargement des ventes.");
    }
  };

  // Récupération des clients
  const fetchClients = async () => {
    try {
      const clientsData = await getClients();
      setClients(clientsData);
    } catch (err) {
      setError("Erreur lors du chargement des clients. " + err);
    }
  };

  // Récupération des produits
  const fetchProducts = async () => {
    try {
      const productsData = await getProducts();
      setProducts(productsData);
    } catch (err) {
      setError("Erreur lors du chargement des produits. " + err);
    }
  };

  // Récupération des devises
  const fetchCurrencies = async () => {
    try {
      const currenciesData = await getCurrencies();
      setCurrencies(currenciesData);
    } catch (err) {
      setError("Erreur lors du chargement des devises. " + err);
    }
  };

  // Récupération du taux de change actuel
  const fetchExchangeRate = async () => {
    try {
      const rateData = await getCurrentRate();
      // L'API renvoie par exemple { currentRate: 150 }
      setExchangeRate(rateData.currentRate);
    } catch (err) {
      setError("Erreur lors du chargement du taux de change. " + err);
    }
  };

  // Affichage du modal pour créer/modifier une vente
  const handleShowModal = (sale = null) => {
    setCurrentSale(sale);
    if (sale) {
      // Lors de la modification, on charge les produits en utilisant leur prix de base (en USD)
      const loadedProducts = sale.products.map((p) => {
        const basePrice = p.price; // le prix stocké en USD dans la vente
        const displayedPrice =
          currency === "USD" ? basePrice : basePrice * exchangeRate;
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
      setCreditSale(sale.creditSale);
    } else {
      setSelectedProducts([]);
      setSelectedClient(null);
      setCreditSale(false);
    }
    setShowModal(true);
    setError("");
    setSuccess("");
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setError("");
  };

  // Ajout d'un produit à la vente en cours
  // On affiche également la quantité en stock dans la liste des produits (voir la section "Produits" dans le modal)
  const handleAddProduct = (product) => {
    if (selectedProducts.find((p) => p.productId === product._id)) {
      setError("Ce produit a déjà été ajouté.");
      return;
    }
    const basePrice = product.priceUSD; // prix en USD
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

  // Suppression d'un produit sélectionné
  const handleRemoveProduct = (productId) => {
    setSelectedProducts(
      selectedProducts.filter((p) => p.productId !== productId),
    );
  };

  // Modification d'un champ (quantité, taxe, remise) d'un produit sélectionné
  // Le prix ne peut pas être modifié manuellement.
  const handleChangeProduct = (index, field, value) => {
    const updatedProducts = [...selectedProducts];
    if (field === "price") return;
    updatedProducts[index][field] = value;
    // Recalcul du total pour ce produit
    updatedProducts[index].total =
      (updatedProducts[index].price +
        (updatedProducts[index].price * updatedProducts[index].tax) / 100 -
        (updatedProducts[index].price * updatedProducts[index].discount) /
          100) *
      updatedProducts[index].quantity;
    setSelectedProducts(updatedProducts);
  };

  // Gestion du changement de devise
  // Pour chaque produit, on recalcule le prix affiché à partir de sa valeur de base (en USD)
  // En mode création, la devise est modifiable ; en modification, le sélecteur est désactivé.
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

  // Soumission du formulaire pour créer ou modifier une vente
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
      price: product.basePrice, // En USD
      tax: product.tax,
      discount: product.discount,
    }));

    const saleData = {
      clientId: selectedClient._id,
      currencyId: selectedCurrencyObj._id,
      products: productsForSale,
      creditSale, // Indique si la vente est à crédit
      // D'autres champs (ex. remarks) peuvent être ajoutés ici si besoin
    };

    try {
      if (currentSale) {
        await editSale(currentSale._id, saleData);
        setSuccess("Vente modifiée avec succès.");
      } else {
        await addSale(saleData);
        setSuccess("Vente créée avec succès.");
      }
      fetchSales();
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

  // Filtres pour la recherche dans la liste des ventes, clients et produits
  const filteredSales = sales.filter((sale) => {
    // Pour le nom du client, on affiche soit le nom de l'entreprise s'il existe, soit prénom + nom
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

  const filteredClients = clients.filter((client) =>
    `${client.companyName || client.firstName + " " + client.lastName}`
      .toLowerCase()
      .includes(searchClient.toLowerCase()),
  );

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
                  <th>Total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentSales.map((sale) => (
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
                    <td>
                      {currency === "USD"
                        ? `${sale.totalAmount} USD`
                        : `${(sale.totalAmount * exchangeRate).toFixed(2)} ${currency}`}
                    </td>
                    <td>
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
                ))}
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
                        {product.priceUSD} USD
                        {" - "}Stock: {product.stockQuantity}
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

            {/* Section de sélection de la devise et affichage du taux de change */}
            <Row className="mt-3">
              <Col md={6}>
                <h5>Devise</h5>
                <Form.Select
                  value={currency}
                  onChange={handleCurrencyChange}
                  disabled={!!currentSale}
                >
                  {/* La devise est figée en modification */}
                  {currencies.map((cur) => (
                    <option key={cur._id} value={cur.currencyCode}>
                      {cur.currencyName} ({cur.currencyCode})
                    </option>
                  ))}
                </Form.Select>
                <h6 className="mt-2">
                  Taux de change actuel : {exchangeRate ? exchangeRate : "N/A"}
                </h6>
              </Col>
              <Col md={6}>
                {currentSale ? (
                  // En modification, on affiche simplement le type de vente
                  <div className="mt-4">
                    <strong>Type de vente :</strong>{" "}
                    {creditSale ? "À crédit" : "Normale"}
                  </div>
                ) : (
                  // Lors de la création, on peut choisir d'indiquer une vente à crédit
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
                        min="0"
                        value={product.price}
                        readOnly // Le prix n'est pas modifiable
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
