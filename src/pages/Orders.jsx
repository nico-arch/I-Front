import React, { useState, useEffect } from "react";
import { Modal, Button, Table, Form, Alert, Pagination } from "react-bootstrap";
import {
  getOrders,
  addOrder,
  editOrder,
  cancelOrder,
  completeOrder,
} from "../services/orderService";
import { getSuppliers } from "../services/supplierService";
import { getProducts } from "../services/productService";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchSupplier, setSearchSupplier] = useState("");
  const [searchProduct, setSearchProduct] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchOrders();
    fetchSuppliers();
    fetchProducts();
  }, []);

  const fetchOrders = async () => {
    try {
      const ordersData = await getOrders();
      setOrders(ordersData);
    } catch (err) {
      setError("Erreur lors du chargement des commandes.");
    }
  };

  const fetchSuppliers = async () => {
    try {
      const suppliersData = await getSuppliers();
      setSuppliers(suppliersData);
    } catch (err) {
      setError("Erreur lors du chargement des fournisseurs.");
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

  const handleShowModal = (order = null) => {
    setCurrentOrder(order);
    setSelectedProducts(order ? order.products : []);
    setSelectedSupplier(order ? order.supplier : null);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

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
        quantity: 1,
        price: product.priceUSD,
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
    setSelectedProducts(updatedProducts);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSupplier) {
      setError("Veuillez sélectionner un fournisseur.");
      return;
    }
    if (selectedProducts.length === 0) {
      setError("Veuillez ajouter au moins un produit.");
      return;
    }

    const orderData = {
      supplierId: selectedSupplier._id,
      products: selectedProducts,
    };

    try {
      if (currentOrder) {
        await editOrder(currentOrder._id, orderData);
        setSuccess("Commande modifiée avec succès.");
      } else {
        await addOrder(orderData);
        setSuccess("Commande créée avec succès.");
      }
      fetchOrders();
      handleCloseModal();
    } catch (err) {
      setError("Erreur lors de la création/modification de la commande.");
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await cancelOrder(orderId);
      setSuccess("Commande annulée avec succès.");
      fetchOrders();
    } catch (err) {
      setError("Erreur lors de l'annulation de la commande.");
    }
  };

  const handleCompleteOrder = async (orderId) => {
    try {
      await completeOrder(orderId);
      setSuccess("Commande complétée avec succès.");
      fetchOrders();
    } catch (err) {
      setError("Erreur lors de la finalisation de la commande.");
    }
  };

  return (
    <div>
      <h2>Gestion des commandes</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Button variant="primary" onClick={() => handleShowModal()}>
        Créer une commande
      </Button>

      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Fournisseur</th>
            <th>Date</th>
            <th>Statut</th>
            <th>Total</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order.supplier.companyName}</td>
              <td>{new Date(order.orderDate).toLocaleDateString()}</td>
              <td>{order.status}</td>
              <td>{order.totalAmount} USD</td>
              <td>
                <Button
                  variant="warning"
                  onClick={() => handleShowModal(order)}
                >
                  Modifier
                </Button>{" "}
                <Button
                  variant="danger"
                  onClick={() => handleCancelOrder(order._id)}
                >
                  Annuler
                </Button>{" "}
                <Button
                  variant="success"
                  onClick={() => handleCompleteOrder(order._id)}
                >
                  Compléter
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal pour ajouter/modifier une commande */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {currentOrder ? "Modifier" : "Créer"} une commande
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="searchSupplier">
              <Form.Label>Rechercher un fournisseur</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nom du fournisseur"
                value={searchSupplier}
                onChange={(e) => setSearchSupplier(e.target.value)}
              />
            </Form.Group>

            <div className="mt-3">
              {suppliers
                .filter((supplier) =>
                  supplier.companyName
                    .toLowerCase()
                    .includes(searchSupplier.toLowerCase()),
                )
                .map((supplier) => (
                  <div
                    key={supplier._id}
                    className="d-flex justify-content-between"
                  >
                    <span>{supplier.companyName}</span>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => setSelectedSupplier(supplier)}
                    >
                      Sélectionner
                    </Button>
                  </div>
                ))}
            </div>

            <Form.Group controlId="searchProduct" className="mt-4">
              <Form.Label>Rechercher des produits</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nom du produit"
                value={searchProduct}
                onChange={(e) => setSearchProduct(e.target.value)}
              />
            </Form.Group>

            <div className="mt-3">
              {products
                .filter((product) =>
                  product.productName
                    .toLowerCase()
                    .includes(searchProduct.toLowerCase()),
                )
                .map((product) => (
                  <div
                    key={product._id}
                    className="d-flex justify-content-between"
                  >
                    <span>{product.productName}</span>
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

            <div className="mt-4">
              <h5>Produits sélectionnés</h5>
              {selectedProducts.map((product, index) => (
                <div
                  key={product.productId}
                  className="d-flex justify-content-between"
                >
                  <span>{product.productName}</span>
                  <Form.Control
                    type="number"
                    min="1"
                    value={product.quantity}
                    onChange={(e) =>
                      handleChangeProduct(index, "quantity", e.target.value)
                    }
                    style={{ width: "70px" }}
                  />
                  <Form.Control
                    type="number"
                    min="0"
                    value={product.price}
                    onChange={(e) =>
                      handleChangeProduct(index, "price", e.target.value)
                    }
                    style={{ width: "100px" }}
                  />
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleRemoveProduct(product.productId)}
                  >
                    Retirer
                  </Button>
                </div>
              ))}
            </div>

            <Button variant="primary" type="submit" className="mt-4">
              {currentOrder ? "Modifier" : "Créer"} la commande
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Orders;
