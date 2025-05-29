const { ipcRenderer } = require("electron");

ipcRenderer.on('zoom-in', () => {
    const gameContainer = document.getElementById('game-container')
    if (gameContainer) {
        const currentZoom = parseFloat(gameContainer.style.zoom) || 1;
        gameContainer.style.zoom = (currentZoom + 0.1).toFixed(1);
    }
})

ipcRenderer.on('zoom-out', () => {
    const gameContainer = document.getElementById('game-container')

    if (gameContainer) {
        const currentZoom = parseFloat(gameContainer.style.zoom) || 1;
        if (currentZoom == 0.1) return; // Prevent zooming out below 0.1
        gameContainer.style.zoom = (currentZoom - 0.1).toFixed(1);
    }
})