const { ipcRenderer } = require('electron');

ipcRenderer.on('set-title', (data) => {
    console.log('Received from main:', data);
    window.logoText.innerText = data.title;
});
