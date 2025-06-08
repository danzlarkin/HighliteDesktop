import { ipcMain } from "electron";
import keytar from "keytar";
import log from 'electron-log';

const SERVICE_NAME = "HighLite";

// Password Handling
ipcMain.handle("save-username-password", async (event, username, password) => {
    try {
        await keytar.setPassword(SERVICE_NAME, username, password);
        log.info(`Saved credential for ${username}`);
    } catch (err) {
        log.error('Failed to save credential:', err);
    }
});

ipcMain.handle("get-saved-usernames", async () => {
    try {
        const credentials = await keytar.findCredentials(SERVICE_NAME);
        return credentials.map(c => c.account);
    } catch (err) {
        log.error('Failed to list usernames:', err);
        return [];
    }
});

ipcMain.handle("get-saved-password", async (event, username) => {
    try {
        const password = await keytar.getPassword(SERVICE_NAME, username);
        return password || '';
    } catch (err) {
        log.error(`Failed to get password for ${username}:`, err);
        return '';
    }
});

ipcMain.handle("delete-username-password", async (event, username) => {
    try {
        await keytar.deletePassword(SERVICE_NAME, username);
        log.info(`Deleted credential for ${username}`);
    } catch (err) {
        log.error(`Failed to delete credential for ${username}:`, err);
    }
});