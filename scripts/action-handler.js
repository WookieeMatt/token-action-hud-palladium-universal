import { ACTION_TYPE, GROUP } from "./constants.js";
import { getSetting } from "./settings.js";

export let ActionHandler = null;

/** Signed number: +3 / −2. */
const signed = n => (Number(n) >= 0 ? `+${Number(n)}` : `−${Math.abs(Number(n))}`);

Hooks.once("tokenActionHudCoreApiReady", async coreModule => {
  const i18n = s => coreModule.api.Utils.i18n(s);

  /** Builds the Palladium Universal actions for the selected token(s). */
  ActionHandler = class ActionHandler extends coreModule.api.ActionHandler {
    /** @override */
    async buildSystemActions(groupIds) {
      this.api = game.palladium;
      if ( !this.api ) return;
      this.displayUnequipped = getSetting("displayUnequipped", false);
      this.showSkillPercent = getSetting("showSkillPercent", true);
      const actor = this.actor;
      if ( actor ) {
        this.items = coreModule.api.Utils.sortItemsByName(actor.items);
        if ( ["character", "npc"].includes(actor.type) ) return this.#buildCharacter(actor);
        if ( ["vehicle", "timeMachine"].includes(actor.type) ) return this.#buildVehicle(actor);
        return;
      }
      // Several tokens: the rolls everyone has.
      const actors = (this.actors ?? []).filter(a => ["character", "npc"].includes(a?.type));
      if ( actors.length ) this.#buildMultiple(actors);
    }

    /* -------------------------------------------- */

    /** A character or an NPC. */
    #buildCharacter(actor) {
      this.#buildWeapons(actor);
      this.#buildManeuvers(actor);
      this.#buildCombatRolls(actor);
      this.#buildSaves(actor);
      this.#buildSkills(actor);
      this.#buildPowers(actor);
      this.#buildInventory(actor);
      this.#buildConditions(actor);
      this.#buildCombat(actor);
      this.#buildUtility(actor);
    }

    /** Several characters / NPCs selected: combat rolls and saves roll for each of them. */
    #buildMultiple(actors) {
      const first = actors[0];
      this.#buildCombatRolls(first, true);
      this.#buildSaves(first, true);
    }

    /* -------------------------------------------- */

    /** One action. */
    #action(type, parts, name, extra = {}) {
      const id = [type, ...parts].join("-");
      const typeName = i18n(ACTION_TYPE[type] ?? "");
      return { id, name, listName: `${typeName ? `${typeName}: ` : ""}${name}`, encodedValue: [type, ...parts].join(this.delimiter), ...extra };
    }

    #items(type, filter = () => true) {
      return [...(this.items?.values?.() ?? this.items ?? [])].filter(i => (i.type === type) && filter(i));
    }

    /** Weapons: one action per attack mode (Aimed / Burst / Wild, Sneak Attack, Leap Attack...). */
    #buildWeapons(actor) {
      const weapons = this.#items("weapon", w => this.displayUnequipped || (w.system.equipped !== false));
      const actions = [];
      for ( const weapon of weapons ) {
        const w = weapon.system;
        const modes = this.api.attackModes?.(actor, weapon) ?? [{ key: "aimed", label: "Attack", bonus: 0 }];
        // Ammo left (guns, bows) or how many are left (thrown weapons, grenades): system 1.34+.
        const left = w.tracksAmmo ? { text: `${w.ammo.value}/${w.ammo.max}`, title: "Ammo left", class: w.ammo.value ? "" : "tah-pu-empty" }
          : w.tracksQuantity ? { text: `×${w.quantity ?? 0}`, title: "Left", class: w.quantity ? "" : "tah-pu-empty" } : undefined;
        modes.forEach((m, i) => actions.push(this.#action("attack", [weapon.id, m.key], i ? `${weapon.name}: ${m.label}` : weapon.name, {
          img: coreModule.api.Utils.getImage(weapon), info1: { text: signed(m.bonus), title: "Strike bonus" },
          info2: { text: w.damage ?? "", title: "Damage" }, info3: left,
          tooltip: `${m.label}: Strike ${signed(m.bonus)}, damage ${w.damage ?? "—"}${left ? `, ${left.title.toLowerCase()} ${left.text}` : ""}. Right-click: open the weapon.`
        })));
        if ( w.tracksAmmo && (w.ammo.value < w.ammo.max) ) actions.push(this.#action("reload", [weapon.id], `Reload ${weapon.name}`, {
          img: coreModule.api.Utils.getImage(weapon), tooltip: `Back to ${w.ammo.max}${w.reload ? ` (takes ${w.reload})` : ""}` }));
      }
      this.addActions(actions, { id: GROUP.weapons.id, type: "system" });
    }

    /** Maneuvers the Combat Training unlocks (Hold, Entangle, Tackle, Throw, Jump Kick). */
    #buildManeuvers(actor) {
      const unlocks = actor.system.combat?.trainingData?.unlocks ?? [];
      const actions = Object.entries(CONFIG.PALLADIUM.MANEUVERS ?? {}).filter(([, m]) => !m.requires || unlocks.includes(m.requires))
        .map(([key, m]) => this.#action("maneuver", [key], m.label, { tooltip: m.text }));
      this.addActions(actions, { id: GROUP.maneuvers.id, type: "system" });
    }

    /** Initiative, Strike, Parry, Dodge, Roll with Impact, Pull Punch, Disarm. */
    #buildCombatRolls(actor, group = false) {
      const rolls = this.api.COMBAT_ROLLS ?? {};
      const totals = actor.system.combat?.totals ?? {};
      const actions = Object.entries(rolls).map(([key, label]) => this.#action("combat", [key], label,
        group ? {} : { info1: { text: signed(totals[key] ?? 0) } }));
      this.addActions(actions, { id: GROUP.combatRolls.id, type: "system" });
    }

    /** Saving throws, Save vs Coma and vs Horror Factor. */
    #buildSaves(actor, group = false) {
      const totals = actor.system.saves?.totals ?? {};
      const actions = Object.entries(CONFIG.PALLADIUM.SAVES ?? {}).map(([key, s]) => this.#action("save", [key], `Save ${s.label}`,
        group || !totals[key] ? {} : { info1: { text: signed(totals[key].bonus ?? 0) } }));
      actions.push(this.#action("save", ["horror"], "Save vs Horror Factor"));
      this.addActions(actions, { id: GROUP.saves.id, type: "system" });
    }

    /** Skills with their percentage (and the second percentage when the skill has one). */
    #buildSkills(actor) {
      const actions = [];
      for ( const skill of this.#items("skill", s => !s.system.passive) ) {
        const pct = actor.system.skillPercentages?.(skill) ?? {};
        actions.push(this.#action("skill", [skill.id, "1"], skill.name, {
          img: coreModule.api.Utils.getImage(skill), info1: this.showSkillPercent ? { text: `${pct.primary ?? "?"}%` } : undefined
        }));
        if ( skill.system.label2 ) actions.push(this.#action("skill", [skill.id, "2"], `${skill.name}: ${skill.system.label2}`, {
          img: coreModule.api.Utils.getImage(skill), info1: this.showSkillPercent ? { text: `${pct.secondary ?? "?"}%` } : undefined
        }));
      }
      this.addActions(actions, { id: GROUP.skills.id, type: "system" });
    }

    /** Spells, the magic tradition's automatic abilities, psionics, and abilities with a roll. */
    #buildPowers(actor) {
      const img = i => coreModule.api.Utils.getImage(i);
      this.addActions(this.#items("spell").map(s => this.#action("spell", [s.id], s.name, { img: img(s) })), { id: GROUP.spells.id, type: "system" });
      const abilities = actor.system.magic?.caster?.abilities ?? [];
      this.addActions(abilities.map((a, i) => (a.chance ? this.#action("magicAbility", [String(i)], a.label, { info1: { text: `${a.chance}%` } }) : null))
        .filter(a => a), { id: GROUP.magicAbilities.id, type: "system" });
      this.addActions(this.#items("psionic").map(p => this.#action("psionic", [p.id], p.name, { img: img(p) })), { id: GROUP.psionics.id, type: "system" });
      this.addActions(this.#items("ability", a => a.system.itemRolls?.length).map(a => this.#action("itemRoll", [a.id], a.name, { img: img(a) })),
        { id: GROUP.abilities.id, type: "system" });
    }

    /** Gear and armor with a roll; devices to operate. */
    #buildInventory(actor) {
      const img = i => coreModule.api.Utils.getImage(i);
      const rollable = [...this.#items("gear"), ...this.#items("armor")].filter(i => i.system.itemRolls?.length);
      this.addActions(rollable.map(i => this.#action("itemRoll", [i.id], i.name, { img: img(i) })), { id: GROUP.gear.id, type: "system" });
      this.addActions(this.#items("device").map(d => this.#action("device", [d.id], d.name, { img: img(d), tooltip: "Operate. Right-click: open it." })),
        { id: GROUP.devices.id, type: "system" });
    }

    /** Conditions: toggles, lit when active. */
    #buildConditions(actor) {
      const statuses = actor.statuses ?? new Set();
      const list = [...Object.entries(CONFIG.PALLADIUM.CONDITIONS ?? {}), ["dead", { label: "Dead", img: CONFIG.statusEffects?.find(e => e.id === "dead")?.img, text: "" }]];
      const actions = list.map(([id, c]) => this.#action("condition", [id], c.label, {
        img: coreModule.api.Utils.getImage(c.img ?? ""), cssClass: `toggle${statuses.has(id) ? " active" : ""}`, tooltip: c.text || c.label
      }));
      this.addActions(actions, { id: GROUP.conditions.id, type: "system" });
    }

    /** In combat: roll Initiative (if not rolled), take the Move Action, set cover, end the turn. */
    #buildCombat(actor) {
      const combat = game.combat;
      const combatant = combat?.combatants?.find(c => (c.actor === actor) || (c.actorId === actor.id && c.tokenId === this.token?.id));
      if ( !combatant ) return;
      const actions = [];
      if ( !Number.isFinite(combatant.initiative) ) actions.push(this.#action("utility", ["initiative"], "Roll Initiative"));
      const moved = this.api.hasMoved?.(combatant);
      actions.push(this.#action("utility", ["move"], moved ? "Move Action (taken)" : "Move Action", {
        cssClass: `toggle${moved ? " active" : ""}`, tooltip: "Once per round; costs an action (p.85). Click again to undo."
      }));
      actions.push(this.#action("utility", ["cover"], "Cover", { tooltip: "What this combatant is behind (lasts the combat)" }));
      if ( combat.combatant?.id === combatant.id ) actions.push(this.#action("utility", ["endTurn"], "End Turn"));
      this.addActions(actions, { id: GROUP.combat.id, type: "system" });
    }

    /** Healing, a new day for casters. */
    #buildUtility(actor) {
      const actions = [this.#action("utility", ["heal"], "Rest & Heal")];
      if ( actor.system.magic?.caster?.isCaster ) actions.push(this.#action("utility", ["newDay"], "New Day (spells)"));
      this.addActions(actions, { id: GROUP.utility.id, type: "system" });
    }

    /** Vehicles and time machines: Control Roll, Evade, Maneuver, and the mounted weapons. */
    #buildVehicle(actor) {
      this.addActions([
        this.#action("vehicle", ["control"], "Control Roll"),
        this.#action("vehicle", ["evade"], "Evade"),
        this.#action("vehicle", ["maneuver"], "Maneuver")
      ], { id: GROUP.vehicle.id, type: "system" });
      this.addActions(this.#items("weapon").map(w => this.#action("vehicle", ["weapon", w.id], w.name, {
        img: coreModule.api.Utils.getImage(w), info1: { text: w.system.damage ?? "" }
      })), { id: GROUP.vehicleWeapons.id, type: "system" });
    }
  };
});
