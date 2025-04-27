const { contextBridge } = require('electron');
contextBridge.exposeInMainWorld('env', { BACKEND: 'http://localhost:5000' });
