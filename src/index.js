const { app, BrowserWindow } = require('electron');
const path = require('path');


// See: https://www.electronforge.io/config/makers/squirrel.windows#handling-startup-events
if (require('electron-squirrel-startup')) app.quit();


async function createWindow () {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        titleBarStyle: 'hidden',
        webPreferences: {
            nodeIntegration: true,
            nodeIntegrationInWorker: true,
            contextIsolation: false,
            enablePreferredSizeMode: true,
        },
        minHeight: 500,
        minWidth: 500,
        icon: path.join(__dirname, 'static/icons/icon.png'),
        ...(process.platform !== 'darwin' ? { titleBarOverlay: {
            color: '#141414',
            symbolColor: '#eee',
            height: 25
        },} : {}),
    });

    mainWindow.setMenu(null);


    // Load serialized DOM into the window.
    mainWindow.loadFile(path.join(__dirname, 'index.html'));
    mainWindow.webContents.openDevTools();

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