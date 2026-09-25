import { ActionHandler } from "./action-handler.js";
import { RollHandler as Core } from "./roll-handler.js";
import { MODULE } from "./constants.js";
import { DEFAULTS } from "./defaults.js";
import * as systemSettings from "./settings.js";

export let SystemManager = null;

Hooks.once("tokenActionHudCoreApiReady", async coreModule => {
  /** Token Action HUD Core's SystemManager for Palladium Universal. */
  SystemManager = class SystemManager extends coreModule.api.SystemManager {
    /** @override */
    getActionHandler() {
      return new ActionHandler();
    }

    /** @override */
    getAvailableRollHandlers() {
      return { core: "Palladium Universal" };
    }

    /** @override */
    getRollHandler() {
      return new Core();
    }

    /** @override */
    async registerDefaults() {
      return DEFAULTS;
    }

    /** @override */
    registerSettings(coreUpdate) {
      systemSettings.register(coreUpdate);
    }

    /** @override */
    registerStyles() {
      return {
        palladium: { class: "tah-style-palladium", file: "tah-palladium", moduleId: MODULE.ID, name: "Palladium Universal" }
      };
    }
  };
});
