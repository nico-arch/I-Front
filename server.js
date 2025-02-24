// server.js (ou dans electron.js)
const express = require("express");
const path = require("path");

function startServer() {
  const app = express();
  const port = 3000; // ou un autre port

  // Servir le dossier dist
  app.use(express.static(path.join(__dirname, "dist")));

  // Gérer toutes les routes en renvoyant index.html
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
  });

  app.listen(port, () => {
    console.log(`Serveur local démarré sur http://localhost:${port}`);
  });

  return `http://localhost:${port}`;
}

module.exports = { startServer };
