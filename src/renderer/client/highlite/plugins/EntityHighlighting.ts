import { Color3 } from "@babylonjs/core/Maths/math";
import { Plugin } from "../core/interfaces/highlite/plugin/plugin.class";

export class EntityHighlighting extends Plugin {
    pluginName = "Entity Highlighting";

    previousEntity: any = null; // Store the previously highlighted entity
    constructor() {
        super();
        this.settings.enable = {
            text: "Enable",
            type: 0,
            value: true,
            callback: () => { } //NOOP
        };
    }

    init(): void {
        this.log("Initialized");
    }

    start(): void {
        this.log("Started");
        // Add logic to start entity highlighting
    }

    stop(): void {
        this.log("Stopped");
        // Add logic to stop entity highlighting
    }

    dG_getActionsAndEntitiesAtMousePointer(e, t, i): void {
        // I contains mesh hits with distance. Find the closest entity and highlight it
        const closestEntity = i.reduce((closest, current) => {
            if (!closest || current.distance < closest.distance) {
                return current;
            }
            return closest;
        }, null);

        if (closestEntity.pickedMesh.id === "ground") {
            // Set renderOverlay to true but with transparency
            closestEntity.pickedMesh.renderOverlay = true;
            closestEntity.pickedMesh.overlayAlpha = 0; // Set transparency for ground
        }

        if (this.previousEntity && this.previousEntity !== closestEntity.pickedMesh) {
            // Reset the previous entity's highlight
            this.previousEntity.renderOverlay = false;
        }

        if (!closestEntity.pickedMesh.id.includes("wall") && !closestEntity.pickedMesh.id.includes("ground") && !closestEntity.pickedMesh.id.includes("roof")) {
          closestEntity.pickedMesh.renderOverlay = true; // Highlight the closest entity
          closestEntity.pickedMesh.overlayAlpha = 0.1; // Set full opacity for the highlight
          closestEntity.pickedMesh.overlayColor = new Color3(0, 1, 1); // Set highlight color to red
          closestEntity.pickedMesh.renderOutline = true;
          closestEntity.pickedMesh._sourceMesh.renderOverlay = true; // Ensure the source mesh is highlighted
          closestEntity.pickedMesh._sourceMesh.overlayAlpha = 0; // Set full opacity for the highlight
          for (const submesh in closestEntity.pickedMesh.subMeshes) {
            submesh._renderingMesh.renderOverlay = true; // Ensure all submeshes are highlighted
            submesh._renderingMesh.overlayAlpha = 0.1; // Set full opacity for the highlight
            submesh._renderingMesh.overlayColor = new Color3(0, 1, 1); // Set highlight color to red
            submesh._renderingMesh.renderOutline = true; // Ensure all submeshes have outlines
          }
          this.previousEntity = closestEntity.pickedMesh; // Store the previously highlighted entity
        }

        
    }
}
