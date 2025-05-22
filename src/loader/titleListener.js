const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronApi', {
    onSetTitle: (callback) => ipcRenderer.on('set-title', (event, data) => callback(data)),
});

window.electronApi.onSetTitle((data) => {
    console.log('Received from main:', data);
    window.logoText.innerText = data.title;
});
