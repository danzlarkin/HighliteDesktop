import type { Plugin } from "../../interfaces/highlite/plugin.class";

export class PluginManager {
    private static instance: PluginManager;
    plugins: Array<Plugin> = [];


    constructor() {
        if (PluginManager.instance) {
            return PluginManager.instance;
        }
        PluginManager.instance = this;
        document.highlite.managers.PluginManager = this;
        document.highlite.plugins = this.plugins;
    }


    registerPlugin<T extends Plugin>(pluginClass: new () => T): boolean {
        const pluginInstance = new pluginClass();
        console.info(`[Highlite] New plugin ${pluginInstance.pluginName} registered`);

        this.plugins.push(pluginInstance);
        return true;
    }

    initAll() : void {
        for (const plugin of this.plugins) {
            try {
                plugin.init();
            } catch (error) {
                console.error(`[Highlite] Error initializing plugin ${plugin.pluginName}:`, error);
            }
        }
    }

    postInitAll() : void {
        for (const plugin of this.plugins) {
            try {
                if (plugin.postInit) {
                    plugin.postInit();
                }
            } catch (error) {
                console.error(`[Highlite] Error post-initializing plugin ${plugin.pluginName}:`, error);
            }
        }
    }

    startAll() : void {
        for (const plugin of this.plugins) {
            if (plugin.settings.enable) {
                try {
                    plugin.start();
                } catch (error) {
                    console.error(`[Highlite] Error starting plugin ${plugin.pluginName}:`, error);
                }
            }
        }
    }

    stopAll() : void {
        for (const plugin of this.plugins) {
            try {
                plugin.stop();
            } catch (error) {
                console.error(`[Highlite] Error stopping plugin ${plugin.pluginName}:`, error);
            }
        }
    }
}