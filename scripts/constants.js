/** Module constants. */
export const MODULE = { ID: "token-action-hud-palladium-universal" };
export const CORE_MODULE = { ID: "token-action-hud-core" };
export const SYSTEM_ID = "palladium-universal";

/** Token Action HUD Core version this module works with (major.minor must match). */
export const REQUIRED_CORE_MODULE_VERSION = "2.1";

/** Action types: the first part of each action's encoded value. */
export const ACTION_TYPE = {
  attack: "tokenActionHud.palladium.attack",
  maneuver: "tokenActionHud.palladium.maneuver",
  combat: "tokenActionHud.palladium.combatRoll",
  save: "tokenActionHud.palladium.save",
  skill: "tokenActionHud.palladium.skill",
  spell: "tokenActionHud.palladium.spell",
  psionic: "tokenActionHud.palladium.psionic",
  magicAbility: "tokenActionHud.palladium.magicAbility",
  itemRoll: "tokenActionHud.palladium.itemRoll",
  device: "tokenActionHud.palladium.device",
  condition: "tokenActionHud.palladium.condition",
  utility: "tokenActionHud.utility",
  vehicle: "tokenActionHud.palladium.vehicle"
};

/** Groups (the lists inside each tab). */
export const GROUP = {
  weapons: { id: "weapons", name: "tokenActionHud.palladium.weapons", type: "system" },
  maneuvers: { id: "maneuvers", name: "tokenActionHud.palladium.maneuvers", type: "system" },
  combatRolls: { id: "combatRolls", name: "tokenActionHud.palladium.combatRolls", type: "system" },
  saves: { id: "saves", name: "tokenActionHud.palladium.saves", type: "system" },
  skills: { id: "skills", name: "tokenActionHud.palladium.skills", type: "system" },
  spells: { id: "spells", name: "tokenActionHud.palladium.spells", type: "system" },
  magicAbilities: { id: "magicAbilities", name: "tokenActionHud.palladium.magicAbilities", type: "system" },
  psionics: { id: "psionics", name: "tokenActionHud.palladium.psionics", type: "system" },
  abilities: { id: "abilities", name: "tokenActionHud.palladium.abilities", type: "system" },
  gear: { id: "gear", name: "tokenActionHud.palladium.gear", type: "system" },
  devices: { id: "devices", name: "tokenActionHud.palladium.devices", type: "system" },
  conditions: { id: "conditions", name: "tokenActionHud.palladium.conditions", type: "system" },
  vehicle: { id: "vehicle", name: "tokenActionHud.palladium.vehicleActions", type: "system" },
  vehicleWeapons: { id: "vehicleWeapons", name: "tokenActionHud.palladium.vehicleWeapons", type: "system" },
  combat: { id: "combat", name: "tokenActionHud.combat", type: "system" },
  token: { id: "token", name: "tokenActionHud.token", type: "system" },
  utility: { id: "utility", name: "tokenActionHud.utility", type: "system" }
};
