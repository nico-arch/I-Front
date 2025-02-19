const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
  // Crée une nouvelle fenêtre
  const mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      // Si vous avez un preload, vous pouvez l'indiquer ici
      // preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Charger le fichier index.html de votre build (généré par Vite)
  mainWindow.loadFile(path.join(__dirname, "dist", "index.html"));

  // Optionnel : ouvrir les DevTools en mode développement
  // mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
