const { app, BrowserWindow, shell } = require('electron');
const { ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');
const path = require('path');

let windows = new Set();

function createWindow() {
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
        ...(process.platform !== 'darwin' ? {
            titleBarOverlay: {
                color: '#141414',
                symbolColor: '#eee',
                height: 25
            },
        } : {}),
        show: false,
    });

    mainWindow.setMenu(null);
    mainWindow.loadFile(path.join(__dirname, 'index.html'));

    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        return { action: 'deny' };
    });
        mainWindow.webContents.openDevTools();
        
    mainWindow.on('closed', () => {
        windows.delete(mainWindow);
    });

    // Listen for "ui-ready" signal from renderer
    ipcMain.once('ui-ready', () => {
        mainWindow.show();
    });

    windows.add(mainWindow);

    autoUpdater.checkForUpdatesAndNotify();
}

app.commandLine.appendSwitch('disable-background-timer-throttling');
app.commandLine.appendSwitch('disable-renderer-backgrounding');
app.commandLine.appendSwitch('disable-backgrounding-occluded-windows');
const gotTheLock = app.requestSingleInstanceLock();

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';

autoUpdater.on('update-available', () => {
  log.info('Update available');
});

autoUpdater.on('update-downloaded', () => {
  log.info('Update downloaded, will install on quit');
  autoUpdater.quitAndInstall();
});


if (!gotTheLock) {
    app.quit();
} else {
    app.whenReady().then(() => {
        createWindow();

        app.on('activate', () => {
            // On macOS it's common to re-create a window in the app when the
            // dock icon is clicked and there are no other windows open.
            if (windows.size === 0) {
                createWindow();
            }
        });
    });

    app.on('second-instance', (event, argv, workingDirectory) => {
        // Someone tried to run a second instance, open a new window in response.
        createWindow();
    });

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });
}
