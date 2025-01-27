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
import { useNavigate } from "react-router-dom";

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [searchClient, setSearchClient] = useState("");
  const [searchProduct, setSearchProduct] = useState("");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentSale, setCurrentSale] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    fetchSales();
    fetchClients();
    fetchProducts();
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
      setError("Erreur lors du chargement des clients.");
    }
  };

  const fetchProducts = async () => {
    try {
      const productsData = await getProducts();
      setProducts(productsData);
    } catch (err) {
      setError("Erreur lors du chargement des produits.");
    }
  };

  const handleShowModal = (sale = null) => {
    setCurrentSale(sale);
    setSelectedProducts(
      sale
        ? sale.products.map((p) => ({
            productId: p.product._id,
            productName: p.product.productName,
            barcode: p.product.barcode,
            quantity: p.quantity,
            price: p.price,
            tax: p.tax,
            discount: p.discount,
          }))
        : [],
    );
    setSelectedClient(sale ? sale.client : null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setError("");
  };

  const handleAddProduct = (product) => {
    if (selectedProducts.find((p) => p.productId === product._id)) {
      setError("Ce produit a déjà été ajouté.");
      return;
    }
    setSelectedProducts([
      ...selectedProducts,
      {
        productId: product._id,
        productName: product.productName,
        barcode: product.barcode,
        quantity: 1,
        price: product.priceUSD,
        tax: 0,
        discount: 0,
      },
    ]);
  };

  const handleRemoveProduct = (productId) => {
    setSelectedProducts(
      selectedProducts.filter((p) => p.productId !== productId),
    );
  };

  const handleChangeProduct = (index, field, value) => {
    const updatedProducts = [...selectedProducts];
    updatedProducts[index][field] = value;
    updatedProducts[index].total =
      (updatedProducts[index].price +
        (updatedProducts[index].price * updatedProducts[index].tax) / 100 -
        (updatedProducts[index].price * updatedProducts[index].discount) /
          100) *
      updatedProducts[index].quantity;
    setSelectedProducts(updatedProducts);
  };

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

    const saleData = {
      clientId: selectedClient._id,
      products: selectedProducts,
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
      setError("Erreur lors de la création/modification de la vente.");
    }
  };

  const handleCancelSale = async (saleId) => {
    try {
      await cancelSale(saleId);
      setSuccess("Vente annulée avec succès.");
      fetchSales();
    } catch (err) {
      setError("Erreur lors de l'annulation de la vente.");
    }
  };

  const handleDeleteSale = async (saleId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette vente ?")) {
      try {
        await deleteSale(saleId);
        setSuccess("Vente supprimée avec succès.");
        fetchSales();
      } catch (err) {
        setError("Erreur lors de la suppression de la vente.");
      }
    }
  };

  const handlePrintSale = (saleId) => {
    navigate(`/sales/print/${saleId}`);
  };

  const filteredSales = sales.filter((sale) => {
    const clientName =
      `${sale.client?.firstName || ""} ${sale.client?.lastName || ""}`.toLowerCase();
    const status = sale.saleStatus.toLowerCase();
    const totalAmount = sale.totalAmount.toString();
    const saleId = sale._id.toLowerCase();
    const searchLower = search.toLowerCase();

    return (
      clientName.includes(searchLower) ||
      status.includes(searchLower) ||
      totalAmount.includes(searchLower) ||
      saleId.includes(searchLower)
    );
  });

  const filteredClients = clients.filter((client) =>
    `${client.firstName} ${client.lastName}`
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
                      {`${sale.client?.firstName || ""} ${
                        sale.client?.lastName || ""
                      }`}
                    </td>
                    <td>{new Date(sale.createdAt).toLocaleDateString()}</td>
                    <td>{sale.saleStatus}</td>
                    <td>{sale.totalAmount} USD</td>
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
                      <span>{`${client.firstName} ${client.lastName}`}</span>
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

              <Col md={6}>
                <h5 className="mb-3">Produits</h5>
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

            <h5 className="mt-4">Produits sélectionnés</h5>
            <Table striped bordered hover className="mt-3">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Barcode</th>
                  <th>Quantité</th>
                  <th>Prix (USD)</th>
                  <th>Tax</th>
                  <th>Remise</th>
                  <th>Total</th>
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
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="number"
                        min="0"
                        value={product.price}
                        onChange={(e) =>
                          handleChangeProduct(
                            index,
                            "price",
                            parseFloat(e.target.value),
                          )
                        }
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
                      />
                    </td>
                    <td>{product.total?.toFixed(2) || 0}</td>
                    <td>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleRemoveProduct(product.productId)}
                      >
                        Retirer
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
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
