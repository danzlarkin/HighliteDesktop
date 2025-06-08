export enum SettingsTypes {
    checkbox,
    range,
}

export interface PluginSettings {
    text: string;
    type: SettingsTypes;
    value: boolean | number | string;
    callback: Function;
}