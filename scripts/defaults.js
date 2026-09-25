import { GROUP } from "./constants.js";

/** The default layout: tabs (layout entries) with their groups. Users can rearrange them in the HUD. */
export let DEFAULTS = null;

Hooks.once("tokenActionHudCoreApiReady", async coreModule => {
  const i18n = s => coreModule.api.Utils.i18n(s);
  const groups = GROUP;
  for ( const group of Object.values(groups) ) {
    group.name = i18n(group.name);
    group.listName = `Group: ${i18n(group.listName ?? group.name)}`;
  }
  const tab = (id, name, list) => ({ nestId: id, id, name: i18n(name), groups: list.map(g => ({ ...groups[g], nestId: `${id}_${groups[g].id}` })) });
  DEFAULTS = {
    layout: [
      tab("attack", "tokenActionHud.palladium.tabs.attack", ["weapons", "maneuvers"]),
      tab("combat", "tokenActionHud.palladium.tabs.combat", ["combatRolls", "saves"]),
      tab("abilities", "tokenActionHud.palladium.tabs.abilities", ["skills"]),
      tab("powers", "tokenActionHud.palladium.tabs.powers", ["spells", "magicAbilities", "psionics", "abilities"]),
      tab("inventory", "tokenActionHud.palladium.tabs.inventory", ["gear", "devices"]),
      tab("vehicle", "tokenActionHud.palladium.tabs.vehicle", ["vehicle", "vehicleWeapons"]),
      tab("conditions", "tokenActionHud.palladium.tabs.conditions", ["conditions"]),
      tab("utility", "tokenActionHud.utility", ["combat", "token", "utility"])
    ],
    groups: Object.values(groups)
  };
});
