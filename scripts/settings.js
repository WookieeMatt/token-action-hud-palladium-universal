import { MODULE } from "./constants.js";

/**
 * Module settings (Configure Settings → Token Action HUD Palladium Universal).
 * @param {Function} coreUpdate   Token Action HUD Core's update function
 */
export function register(coreUpdate) {
  game.settings.register(MODULE.ID, "displayUnequipped", {
    name: game.i18n.localize("tokenActionHud.palladium.settings.displayUnequipped.name"),
    hint: game.i18n.localize("tokenActionHud.palladium.settings.displayUnequipped.hint"),
    scope: "client", config: true, type: Boolean, default: false,
    onChange: value => coreUpdate(value)
  });
  game.settings.register(MODULE.ID, "showSkillPercent", {
    name: game.i18n.localize("tokenActionHud.palladium.settings.showSkillPercent.name"),
    hint: game.i18n.localize("tokenActionHud.palladium.settings.showSkillPercent.hint"),
    scope: "client", config: true, type: Boolean, default: true,
    onChange: value => coreUpdate(value)
  });
}

/** Read one of this module's settings. */
export function getSetting(key, fallback = null) {
  try { return game.settings.get(MODULE.ID, key); } catch(err) { return fallback; }
}
