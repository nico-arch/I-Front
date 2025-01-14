import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Alert, Pagination } from "react-bootstrap";
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
    priceUSD: "",
    stockQuantity: "",
    categories: [],
  });
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showOutOfStock, setShowOutOfStock] = useState(false);
  const itemsPerPage = 5;

  // Charger les produits et les catégories au montage du composant
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

  // Gérer l'ouverture du modal pour ajouter/modifier un produit
  const handleShowModal = (product = null) => {
    setCurrentProduct(product);
    setFormData(
      product
        ? { ...product, categories: product.categories.map((c) => c._id) }
        : {
            productName: "",
            description: "",
            priceUSD: "",
            stockQuantity: "",
            categories: [],
          },
    );
    setShowModal(true);
    setError("");
  };

  // Gérer la fermeture du modal
  const handleCloseModal = () => setShowModal(false);

  // Gérer les changements de formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Gérer les changements de catégories (multisélection)
  const handleCategoryChange = (e) => {
    const selectedCategories = Array.from(
      e.target.selectedOptions,
      (option) => option.value,
    );
    setFormData({ ...formData, categories: selectedCategories });
  };

  // Soumettre le formulaire (ajout ou modification)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentProduct) {
        await editProduct(currentProduct._id, formData);
      } else {
        await addProduct(formData);
      }
      setShowModal(false);
      window.location.reload();
    } catch (err) {
      setError(err.message);
    }
  };

  // Supprimer un produit
  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      try {
        await deleteProduct(id);
        window.location.reload();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  // Gérer la recherche
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Filtrer les produits en fonction du terme de recherche
  const filteredProducts = products.filter((product) => {
    const productName = product.productName?.toLowerCase() || "";
    const description = product.description?.toLowerCase() || "";
    const searchLower = searchTerm.toLowerCase();
    return (
      productName.includes(searchLower) || description.includes(searchLower)
    );
  });

  // Filtrer les produits out of stock si nécessaire
  const displayedProducts = showOutOfStock
    ? filteredProducts.filter((product) => product.stockQuantity === 0)
    : filteredProducts;

  // Pagination : Calculer les produits à afficher pour la page courante
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = displayedProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct,
  );

  // Gérer le changement de page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Imprimer la liste des produits out of stock
  const handlePrintOutOfStock = () => {
    const outOfStockProducts = products.filter(
      (product) => product.stockQuantity === 0,
    );
    const printableContent = outOfStockProducts
      .map(
        (product) =>
          `Nom : ${product.productName}, Description : ${product.description}, Prix (USD) : ${product.priceUSD}`,
      )
      .join("\n");
    const newWindow = window.open();
    newWindow.document.write(`<pre>${printableContent}</pre>`);
    newWindow.print();
    newWindow.close();
  };

  return (
    <div>
      <h2>Gestion des produits</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      <div className="d-flex justify-content-between mb-3">
        <div>
          <Button variant="primary" onClick={() => handleShowModal()}>
            Ajouter un produit
          </Button>{" "}
          <Button
            variant="secondary"
            onClick={() => setShowOutOfStock(!showOutOfStock)}
          >
            {showOutOfStock
              ? "Afficher tous les produits"
              : "Produits en rupture de stock"}
          </Button>{" "}
          <Button variant="info" onClick={handlePrintOutOfStock}>
            Imprimer les produits en rupture de stock
          </Button>
        </div>
        <Form.Control
          type="text"
          placeholder="Rechercher un produit..."
          value={searchTerm}
          onChange={handleSearch}
          style={{ width: "300px" }}
        />
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nom du produit</th>
            <th>Description</th>
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
              <td>{product.priceUSD}</td>
              <td>{product.stockQuantity}</td>
              <td>
                {product.categories.map((category) => category.name).join(", ")}
              </td>
              <td>
                <Button
                  variant="warning"
                  onClick={() => handleShowModal(product)}
                >
                  Modifier
                </Button>{" "}
                <Button
                  variant="danger"
                  onClick={() => handleDelete(product._id)}
                >
                  Supprimer
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Pagination */}
      <Pagination className="mt-3">
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

      {/* Modal pour ajouter/modifier un produit */}
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

            <Form.Group controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="priceUSD">
              <Form.Label>Prix (USD)</Form.Label>
              <Form.Control
                type="number"
                name="priceUSD"
                value={formData.priceUSD}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="stockQuantity">
              <Form.Label>Quantité en stock</Form.Label>
              <Form.Control
                type="number"
                name="stockQuantity"
                value={formData.stockQuantity}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="categories">
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

            <Button variant="primary" type="submit" className="mt-3">
              {currentProduct ? "Modifier" : "Ajouter"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Products;
