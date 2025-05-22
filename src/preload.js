const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronApi', {
    onSetTitle: (callback) => ipcRenderer.on('set-title', (event, data) => callback(data)),
});
