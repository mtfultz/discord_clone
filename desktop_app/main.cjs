const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
require('@electron/remote/main').initialize();

function createWindow() {
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true
    }
  });
  win.loadURL(
    process.env.VITE_DEV_SERVER_URL || `file://${path.join(__dirname, 'dist/index.html')}`
  );
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
