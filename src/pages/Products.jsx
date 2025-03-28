import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
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
  FaPrint,
  FaFilter,
  FaSearch,
} from "react-icons/fa";
import {
  getProducts,
  addProduct,
  editProduct,
  deleteProduct,
} from "../services/productService";
import { getCategories } from "../services/categoryService";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    barcode: "",
    priceUSD: "",
    stockQuantity: "",
    categories: [],
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showOutOfStock, setShowOutOfStock] = useState(false);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsData = await getProducts();
        const categoriesData = await getCategories();
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchData();
  }, []);

  const handleShowModal = (product = null) => {
    setCurrentProduct(product);
    setFormData(
      product
        ? { ...product, categories: product.categories.map((c) => c._id) }
        : {
          productName: "",
          description: "",
          barcode: "",
          priceUSD: "",
          purchasePrice: "", // Nouveau champ
          stockQuantity: "",
          categories: [],
        },
    );
    setShowModal(true);
    setError("");
    setSuccess("");
  };

  const handleCloseModal = () => setShowModal(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCategoryChange = (e) => {
    const selectedCategories = Array.from(
      e.target.selectedOptions,
      (option) => option.value,
    );
    setFormData({ ...formData, categories: selectedCategories });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentProduct) {
        await editProduct(currentProduct._id, formData);
        setSuccess("Produit modifié avec succès.");
      } else {
        await addProduct(formData);
        setSuccess("Produit ajouté avec succès.");
      }
      setShowModal(false);
      setTimeout(() => setSuccess(""), 3000);
      window.location.reload();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      try {
        await deleteProduct(id);
        setSuccess("Produit supprimé avec succès.");
        setTimeout(() => setSuccess(""), 3000);
        window.location.reload();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredProducts = products.filter((product) => {
    const productName = product.productName?.toLowerCase() || "";
    const description = product.description?.toLowerCase() || "";
    const barcode = product.barcode?.toLowerCase() || "";
    const searchLower = searchTerm.toLowerCase();
    return (
      productName.includes(searchLower) ||
      description.includes(searchLower) ||
      barcode.includes(searchLower)
    );
  });

  const displayedProducts = showOutOfStock
    ? filteredProducts.filter((product) => product.stockQuantity === 0)
    : filteredProducts;

  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = displayedProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct,
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handlePrintOutOfStock = () => {
    const outOfStockProducts = products.filter(
      (product) => product.stockQuantity === 0,
    );
    const printableContent = outOfStockProducts
      .map(
        (product) =>
          `Nom : ${product.productName}, Description : ${product.description}, Code-barres : ${product.barcode}, Prix (USD) : ${product.priceUSD}`,
      )
      .join("\n");
    const newWindow = window.open();
    newWindow.document.write(`<pre>${printableContent}</pre>`);
    newWindow.print();
    newWindow.close();
  };

  return (
    <Container fluid className="mt-4">
      <Row>
        <Col>
          <Card className="shadow p-4">
            <h2 className="text-center mb-4">Gestion des produits</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <Button variant="primary" onClick={() => handleShowModal()}>
                  <FaPlus className="me-2" />
                  Ajouter un produit
                </Button>{" "}
                <Button
                  variant="secondary"
                  onClick={() => setShowOutOfStock(!showOutOfStock)}
                >
                  <FaFilter className="me-2" />
                  {showOutOfStock
                    ? "Afficher tous les produits"
                    : "Produits en rupture de stock"}
                </Button>{" "}
                {/* <Button variant="info" onClick={handlePrintOutOfStock}>
                  <FaPrint className="me-2" />
                  Imprimer les produits en rupture de stock
                </Button> */}
              </div>
              <div className="d-flex align-items-center">
                <FaSearch className="me-2" />
                <Form.Control
                  type="text"
                  placeholder="Rechercher un produit par nom, description ou code-barres..."
                  value={searchTerm}
                  onChange={handleSearch}
                  style={{ width: "300px" }}
                />
              </div>
            </div>

            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Nom du produit</th>
                  <th>Description</th>
                  <th>Code-barres</th>
                  <th>Prix (USD)</th>
                  <th>Stock</th>
                  <th>Catégories</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentProducts.map((product) => (
                  <tr key={product._id}>
                    <td>{product.productName}</td>
                    <td>{product.description}</td>
                    <td>{product.barcode}</td>
                    <td>{product.priceUSD}</td>
                    <td>{product.stockQuantity}</td>
                    <td>
                      {product.categories
                        .map((category) => category.name)
                        .join(", ")}
                    </td>
                    <td>
                      <Button
                        variant="warning"
                        className="me-2"
                        onClick={() => handleShowModal(product)}
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleDelete(product._id)}
                      >
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <Pagination className="mt-3 justify-content-center">
              {Array.from({
                length: Math.ceil(displayedProducts.length / itemsPerPage),
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

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {currentProduct ? "Modifier" : "Ajouter"} un produit
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="productName">
              <Form.Label>Nom du produit</Form.Label>
              <Form.Control
                type="text"
                name="productName"
                value={formData.productName}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="description" className="mt-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="barcode" className="mt-3">
              <Form.Label>Code-barres</Form.Label>
              <Form.Control
                type="text"
                name="barcode"
                value={formData.barcode}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="priceUSD" className="mt-3">
              <Form.Label>Prix (USD)</Form.Label>
              <Form.Control
                type="number"
                name="priceUSD"
                value={formData.priceUSD}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="purchasePrice" className="mt-3">
              <Form.Label>Prix d'achat (USD)</Form.Label>
              <Form.Control
                type="number"
                name="purchasePrice"
                value={formData.purchasePrice}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="stockQuantity" className="mt-3">
              <Form.Label>Quantité en stock</Form.Label>
              <Form.Control
                type="number"
                name="stockQuantity"
                value={formData.stockQuantity}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="categories" className="mt-3">
              <Form.Label>Catégories</Form.Label>
              <Form.Control
                as="select"
                multiple
                value={formData.categories}
                onChange={handleCategoryChange}
              >
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-4 w-100">
              {currentProduct ? "Modifier" : "Ajouter"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Products;
