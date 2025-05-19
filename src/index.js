const { app, BrowserWindow } = require('electron');
const path = require('path');

async function createWindow () {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            nodeIntegrationInWorker: true,
            contextIsolation: false,
            enablePreferredSizeMode: true,
        },
        minHeight: 500,
        minWidth: 500,
        titleBarStyle: 'hidden',
        ...(process.platform !== 'darwin' ? { titleBarOverlay: true } : {})
    });

    mainWindow.setMenu(null);


    // Load serialized DOM into the window.
    mainWindow.loadFile(path.join(__dirname, 'index.html'));

    // Allows the opening of external links in the default browser.
    // Otherwise, it will open in the app.
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    require('electron').shell.openExternal(url);
        return { action: 'deny' };
    });
}

app.whenReady().then(async () => {
    await createWindow();

    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
}
);