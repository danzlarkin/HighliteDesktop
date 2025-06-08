import { openDB, type IDBPDatabase } from "idb";
import type { HighliteSchema } from "../../interfaces/highlite/database/database.schema";

export class DatabaseManager {
    private static instance: DatabaseManager;
    database!: IDBPDatabase<HighliteSchema>;

    constructor() {
        if (DatabaseManager.instance) {
            return DatabaseManager.instance;
        }
        DatabaseManager.instance = this;
        document.highlite.managers.DatabaseManager = this;
    }

   async initDB() {
        this.database = await openDB<HighliteSchema>('HighliteDatabase', 1, {
            upgrade(db) {
                if (!db.objectStoreNames.contains('settings')) {
                    db.createObjectStore('settings');
                }
            }
        });
    }
}