/*
const { app, BrowserWindow } = require("electron");
const path = require("path");
const { startServer } = require("./server");

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
	// Permet de masquer la barre de menu (affichable avec Alt sous Windows)
    autoHideMenuBar: true,
  });

  // Démarrer le serveur local
  const urlLocal = startServer();

  // Charger l'URL locale dans Electron
  mainWindow.loadURL(urlLocal);
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
*/

const { app, BrowserWindow } = require("electron");
const path = require("path");

// Activer l'aperçu d'impression Chromium en supprimant le flag de désactivation et en l'ajoutant explicitement
//app.commandLine.removeSwitch("disable-print-preview");
//app.commandLine.appendSwitch("enable-print-preview");

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    autoHideMenuBar: true,
  });

  // Charger directement le fichier index.html du build
  mainWindow.loadFile(path.join(__dirname, "dist", "index.html"));
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
