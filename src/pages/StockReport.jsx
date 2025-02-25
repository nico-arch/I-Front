import React, {useEffect, useState} from "react";
import {
  Container,
  Spinner,
  Alert,
  Table,
  Button,
  Form
} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {getCategories, getProductsByCategory} from "../services/categoryService";
import "./printStyles.css";

const StockReport = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // 1. Charger les catégories au montage
  useEffect(() => {
    const fetchCats = async () => {
      setLoading(true);
      try {
        const cats = await getCategories();
        setCategories(cats);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCats();
  }, []);

  // 2. Quand l'utilisateur sélectionne une catégorie, on va chercher les produits correspondants
  const handleCategoryChange = async (e) => {
    const catId = e.target.value;
    setSelectedCategory(catId);

    // Si l'utilisateur efface la sélection (option vide), on n'affiche plus de produits
    if (!catId) {
      setProducts([]);
      return;
    }

    setLoading(true);
    try {
      const prods = await getProductsByCategory(catId);
      setProducts(prods);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Affichage d'un spinner si on est en cours de chargement (catégories ou produits)
  if (loading) {
    return (<Container className="text-center mt-5">
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Chargement...</span>
      </Spinner>
    </Container>);
  }

  // Si on a une erreur
  if (error) {
    return (<Container className="mt-5">
      <Alert variant="danger">{error}</Alert>
    </Container>);
  }

  // Récupérer le nom de la catégorie sélectionnée (pour l'affichage du titre)
  const selectedCategoryName = selectedCategory && categories.find((cat) => cat._id === selectedCategory)
    ?.name;

  return (<Container fluid="fluid" className="mt-4 print-container">
    <h1 className="mb-4 text-center">Rapport d'inventaire</h1>

    {/* Sélecteur de catégorie */}
    <Form.Group className="mb-3">
      <Form.Label>Sélectionnez une catégorie :</Form.Label>
      <Form.Select value={selectedCategory} onChange={handleCategoryChange}>
        <option value="">-- Choisir une catégorie --</option>
        {
          categories.map((cat) => (<option key={cat._id} value={cat._id}>
            {cat.name}
          </option>))
        }
      </Form.Select>
    </Form.Group>

    {/* Affichage des produits */}
    {
      selectedCategory
        ? (<> < h3 > {
          selectedCategoryName
        }</h3> {
          products.length > 0
            ? (<Table striped="striped" bordered="bordered" hover="hover" responsive="responsive">
              <thead>
                <tr>
                  <th>Produit</th>
                  <th>Quantité en stock</th>
                  <th>Quantité vérifiée en stock</th>
                </tr>
              </thead>
              <tbody>
                {
                  products.map((prod) => (<tr key={prod._id}>
                    <td>{prod.productName}</td>
                    <td>{prod.stockQuantity}</td>
                    <td></td>
                  </tr>))
                }
              </tbody>
            </Table>)
            : (<p>Aucun produit dans cette catégorie</p>)
        } < />
      ) : (
        <p>Veuillez sélectionner une catégorie pour afficher le rapport.</p >)
    }

    {/* Boutons en bas : Imprimer et Retour */}
    <div className="text-center mt-4 no-print">
      <Button variant="primary" className="ms-2" onClick={() => navigate("/dashboard")}>
        Retour au Dashboard
      </Button>
      {" "}
      <Button variant="secondary" onClick={() => window.print()}>
        Imprimer
      </Button>
    </div>
  </Container>);
};

export default StockReport;
