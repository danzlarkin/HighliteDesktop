const { ipcRenderer } = require('electron');

ipcRenderer.on('set-title', (event, data) => {
    document.title = data.title;

    window.logoText.innerText = data.title;
});
