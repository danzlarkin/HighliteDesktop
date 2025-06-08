import { Plugin } from "../core/interfaces/highlite/plugin/plugin.class";

export class RefreshWarning extends Plugin {
    pluginName = "Refresh Warning";

    init(): void {
        this.log("Initializing");
    }
    
    start(): void {
        this.log("Started");
        if (this.settings.enable) {
            this.enableWarning();
        }
    }

    stop(): void {
        this.log("Stopped");
    }

    enableWarning() {
        window.addEventListener("beforeunload", this.refreshWarning);
    }

    disableWarning() {
        window.removeEventListener("beforeunload", this.refreshWarning);
    }

    refreshWarning(e: BeforeUnloadEvent) {
        e.preventDefault();
    }
}