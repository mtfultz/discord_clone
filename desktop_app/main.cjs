// main.cjs  (Electron entry)
const { app, BrowserWindow } = require('electron');
const path  = require('path');

const isDev = process.env.NODE_ENV === 'development';

function createWindow () {
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true
    }
  });

  if (isDev) {
    win.loadURL('http://localhost:5173/');
    win.webContents.openDevTools();  // optional
  } else {
    win.loadFile(path.join(__dirname, 'dist/index.html'));
  }
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
