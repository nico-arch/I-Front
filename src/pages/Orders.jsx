import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Alert, Pagination } from "react-bootstrap";
import {
  getOrders,
  addOrder,
  editOrder,
  completeOrder,
  cancelOrder,
  deleteOrder,
} from "../services/orderService";
import { getSuppliers } from "../services/supplierService";
import { getProducts } from "../services/productService";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [formData, setFormData] = useState({
    supplierId: "",
    products: [],
    status: "pending",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ordersData = await getOrders();
        const suppliersData = await getSuppliers();
        const productsData = await getProducts();
        setOrders(ordersData);
        setSuppliers(suppliersData);
        setProducts(productsData);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchData();
  }, []);

  const handleShowModal = (order = null) => {
    setCurrentOrder(order);
    setFormData(
      order
        ? {
            ...order,
            supplierId: order.supplier._id,
            products: order.products.map((p) => ({
              productId: p.product._id,
              quantity: p.quantity,
            })),
          }
        : { supplierId: "", products: [], status: "pending" },
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

  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...formData.products];
    updatedProducts[index][field] = value;
    setFormData({ ...formData, products: updatedProducts });
  };

  const addProductRow = () => {
    setFormData({
      ...formData,
      products: [...formData.products, { productId: "", quantity: 1 }],
    });
  };

  const removeProductRow = (index) => {
    const updatedProducts = formData.products.filter((_, i) => i !== index);
    setFormData({ ...formData, products: updatedProducts });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentOrder) {
        await editOrder(currentOrder._id, formData);
        setSuccess("Commande modifiée avec succès");
      } else {
        await addOrder(formData);
        setSuccess("Commande ajoutée avec succès");
      }
      setShowModal(false);
      window.location.reload();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleComplete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir compléter cette commande ?")) {
      try {
        await completeOrder(id);
        setSuccess("Commande complétée avec succès");
        window.location.reload();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleCancel = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir annuler cette commande ?")) {
      try {
        await cancelOrder(id);
        setSuccess("Commande annulée avec succès");
        window.location.reload();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette commande ?")) {
      try {
        await deleteOrder(id);
        setSuccess("Commande supprimée avec succès");
        window.location.reload();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <h2>Gestion des commandes</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <div className="d-flex justify-content-between mb-3">
        <Button variant="primary" onClick={() => handleShowModal()}>
          Ajouter une commande
        </Button>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Fournisseur</th>
            <th>Produits</th>
            <th>Montant total</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order.supplier.companyName}</td>
              <td>
                {order.products.map((p) => (
                  <div key={p.product._id}>
                    {p.product.productName} - {p.quantity}
                  </div>
                ))}
              </td>
              <td>{order.totalAmount}</td>
              <td>{order.status}</td>
              <td>
                {order.status === "pending" && (
                  <>
                    <Button
                      variant="warning"
                      onClick={() => handleShowModal(order)}
                    >
                      Modifier
                    </Button>{" "}
                    <Button
                      variant="success"
                      onClick={() => handleComplete(order._id)}
                    >
                      Compléter
                    </Button>{" "}
                    <Button
                      variant="danger"
                      onClick={() => handleCancel(order._id)}
                    >
                      Annuler
                    </Button>{" "}
                    <Button
                      variant="dark"
                      onClick={() => handleDelete(order._id)}
                    >
                      Supprimer
                    </Button>
                  </>
                )}
                {order.status === "completed" && <span>Complétée</span>}
                {order.status === "canceled" && <span>Annulée</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Pagination className="mt-3">
        {Array.from({ length: Math.ceil(orders.length / itemsPerPage) }).map(
          (_, index) => (
            <Pagination.Item
              key={index + 1}
              active={index + 1 === currentPage}
              onClick={() => paginate(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ),
        )}
      </Pagination>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {currentOrder ? "Modifier" : "Ajouter"} une commande
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="supplierId">
              <Form.Label>Fournisseur</Form.Label>
              <Form.Control
                as="select"
                name="supplierId"
                value={formData.supplierId}
                onChange={handleChange}
                required
              >
                <option value="">Sélectionnez un fournisseur</option>
                {suppliers.map((supplier) => (
                  <option key={supplier._id} value={supplier._id}>
                    {supplier.companyName}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="products" className="mt-3">
              <Form.Label>Produits</Form.Label>
              {formData.products.map((product, index) => (
                <div key={index} className="d-flex align-items-center mb-2">
                  <Form.Control
                    as="select"
                    value={product.productId}
                    onChange={(e) =>
                      handleProductChange(index, "productId", e.target.value)
                    }
                    required
                  >
                    <option value="">Sélectionnez un produit</option>
                    {products.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.productName}
                      </option>
                    ))}
                  </Form.Control>
                  <Form.Control
                    type="number"
                    min="1"
                    value={product.quantity}
                    onChange={(e) =>
                      handleProductChange(index, "quantity", e.target.value)
                    }
                    className="mx-2"
                    required
                  />
                  <Button
                    variant="danger"
                    onClick={() => removeProductRow(index)}
                  >
                    -
                  </Button>
                </div>
              ))}
              <Button variant="secondary" onClick={addProductRow}>
                Ajouter un produit
              </Button>
            </Form.Group>

            <Button variant="primary" type="submit" className="mt-3">
              {currentOrder ? "Modifier" : "Ajouter"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Orders;
