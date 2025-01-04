import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router'; // Import depuis 'react-router' au lieu de 'react-router-dom'
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
      {/* Ajouter les autres routes ici */}
    </Routes>
  </Router>
);

export default App;
