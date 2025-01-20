import React, { useState, useEffect } from "react";
import { Modal, Button, Table, Form, Alert, Pagination } from "react-bootstrap";
import {
  getOrders,
  addOrder,
  editOrder,
  cancelOrder,
  completeOrder,
  deleteOrder,
} from "../services/orderService";
import { getSuppliers } from "../services/supplierService";
import { getProducts } from "../services/productService";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [searchSupplier, setSearchSupplier] = useState("");
  const [searchProduct, setSearchProduct] = useState("");
  const [searchOrder, setSearchOrder] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Nombre de commandes par page
  const navigate = useNavigate();

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
    if (order && (order.status === "complété" || order.status === "annulé")) {
      setError(
        "Vous ne pouvez pas modifier une commande complétée ou annulée.",
      );
      return;
    }
    setCurrentOrder(order);
    setSelectedProducts(
      order
        ? order.products.map((p) => ({
            productId: p.product._id,
            productName: p.product.productName,
            quantity: p.quantity,
            price: p.price,
          }))
        : [],
    );
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
        purchasePrice: product.purchasePrice || 0, // Par défaut
        salePrice: product.salePrice || product.priceUSD, // Par défaut
      },
    ]);
  };

  /*const handleAddProduct = (product) => {
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
        purchasePrice: product.purchasePrice || 0, // Par défaut
        salePrice: product.salePrice || product.priceUSD, // Par défaut
      },
    ]);
  };
  */
  /*const handleAddProduct = (product) => {
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
*/
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
      setError(
        "Erreur lors de la création/modification de la commande. " + err,
      );
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

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette commande ?")) {
      try {
        await deleteOrder(orderId);
        setSuccess("Commande supprimée avec succès.");
        fetchOrders();
      } catch (err) {
        setError("Erreur lors de la suppression de la commande.");
      }
    }
  };

  const handlePrintOrder = (orderId) => {
    navigate(`/orders/print/${orderId}`);
  };

  const filteredOrders = orders.filter((order) => {
    const supplierName = order.supplier.companyName.toLowerCase();
    const status = order.status.toLowerCase();
    const totalAmount = order.totalAmount.toString();
    const orderId = order._id.toLowerCase(); // Inclure l'ID de la commande dans le filtre
    const searchLower = searchOrder.toLowerCase();
    return (
      supplierName.includes(searchLower) ||
      status.includes(searchLower) ||
      totalAmount.includes(searchLower) ||
      orderId.includes(searchLower) // Rechercher par ID de la commande
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <h2>Gestion des commandes</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <div className="d-flex justify-content-between align-items-center mb-3">
        <Button variant="primary" onClick={() => handleShowModal()}>
          Créer une commande
        </Button>
        <Form.Control
          type="text"
          placeholder="Rechercher une commande..."
          value={searchOrder}
          onChange={(e) => setSearchOrder(e.target.value)}
          style={{ width: "300px" }}
        />
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Fournisseur</th>
            <th>Date</th>
            <th>Statut</th>
            <th>Total</th>

            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {currentOrders.map((order) => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{order.supplier.companyName}</td>
              <td>{new Date(order.orderDate).toLocaleDateString()}</td>
              <td>{order.status}</td>
              <td>{order.totalAmount} USD</td>

              <td>
                <Button
                  variant="warning"
                  onClick={() => handleShowModal(order)}
                  disabled={
                    order.status === "complété" || order.status === "annulé"
                  }
                >
                  Modifier
                </Button>{" "}
                <Button
                  variant="danger"
                  onClick={() => handleDeleteOrder(order._id)}
                >
                  Supprimer
                </Button>{" "}
                <Button
                  variant="secondary"
                  onClick={() => handlePrintOrder(order._id)}
                >
                  Imprimer
                </Button>{" "}
                <Button
                  variant="success"
                  onClick={() => handleCompleteOrder(order._id)}
                  disabled={
                    order.status === "complété" || order.status === "annulé"
                  }
                >
                  Compléter
                </Button>{" "}
                <Button
                  variant="outline-danger"
                  onClick={() => handleCancelOrder(order._id)}
                  disabled={
                    order.status === "complété" || order.status === "annulé"
                  }
                >
                  Annuler
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Pagination className="mt-3">
        {Array.from({
          length: Math.ceil(filteredOrders.length / itemsPerPage),
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

      {/* Modal pour ajouter/modifier une commande */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {currentOrder ? "Modifier" : "Créer"} une commande
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <div className="d-flex mb-3">
              <div className="me-4" style={{ width: "50%" }}>
                <h5>Fournisseurs</h5>
                <Form.Control
                  type="text"
                  placeholder="Rechercher un fournisseur"
                  value={searchSupplier}
                  onChange={(e) => setSearchSupplier(e.target.value)}
                />
                <div
                  style={{
                    maxHeight: "200px",
                    overflowY: "scroll",
                    marginTop: "10px",
                  }}
                >
                  {suppliers
                    .filter((supplier) =>
                      supplier.companyName
                        .toLowerCase()
                        .includes(searchSupplier.toLowerCase()),
                    )
                    .map((supplier) => (
                      <div
                        key={supplier._id}
                        className="d-flex justify-content-between align-items-center"
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
                {selectedSupplier && (
                  <div className="mt-2">
                    <strong>Fournisseur sélectionné:</strong>{" "}
                    {selectedSupplier.companyName}
                  </div>
                )}
              </div>

              <div style={{ width: "50%" }}>
                <h5>Produits</h5>
                <Form.Control
                  type="text"
                  placeholder="Rechercher des produits"
                  value={searchProduct}
                  onChange={(e) => setSearchProduct(e.target.value)}
                />
                <div
                  style={{
                    maxHeight: "200px",
                    overflowY: "scroll",
                    marginTop: "10px",
                  }}
                >
                  {products
                    .filter((product) =>
                      product.productName
                        .toLowerCase()
                        .includes(searchProduct.toLowerCase()),
                    )
                    .map((product) => (
                      <div
                        key={product._id}
                        className="d-flex justify-content-between align-items-center"
                      >
                        <span>
                          {product.productName} - Stock: {product.stockQuantity}{" "}
                          - Prix: {product.priceUSD} USD
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
              </div>
            </div>

            <h5>Produits sélectionnés</h5>
            <Table striped bordered>
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Quantité</th>
                  <th>Prix d'achat (USD)</th>
                  <th>Prix de vente (USD)</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {selectedProducts.map((product, index) => (
                  <tr key={`${product.productId}-${index}`}>
                    <td>{product.productName}</td>
                    <td>
                      <Form.Control
                        type="number"
                        min="1"
                        value={product.quantity}
                        onChange={(e) =>
                          handleChangeProduct(index, "quantity", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="number"
                        min="0"
                        value={product.purchasePrice}
                        onChange={(e) =>
                          handleChangeProduct(
                            index,
                            "purchasePrice",
                            e.target.value,
                          )
                        }
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="number"
                        min="0"
                        value={product.salePrice}
                        onChange={(e) =>
                          handleChangeProduct(
                            index,
                            "salePrice",
                            e.target.value,
                          )
                        }
                      />
                    </td>
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

            <Button variant="primary" type="submit" className="mt-3">
              {currentOrder ? "Modifier" : "Créer"} la commande
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Orders;
