import type { DBSchema } from "idb";

export interface HighliteSchema extends DBSchema {
    resources: {
        key: string; //resource name
        value: {
            updatedAt: number; //timestamp of last update
            data: string; //base64 encoded data
        };
    }
    settings: {
        key: string; //plugin name
        value: Record<string, boolean | number | string>;
    };
}