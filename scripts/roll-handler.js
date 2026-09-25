export let RollHandler = null;

/** Item-based action types: right-click opens the item instead. */
const ITEM_TYPES = new Set(["attack", "skill", "spell", "psionic", "itemRoll", "device"]);

Hooks.once("tokenActionHudCoreApiReady", async coreModule => {
  /** Runs the Palladium Universal actions through the system's own API (game.palladium). */
  RollHandler = class RollHandler extends coreModule.api.RollHandler {
    /** @override */
    async handleActionClick(event, encodedValue) {
      const [type, ...parts] = String(encodedValue ?? "").split(this.delimiter);
      const itemId = ITEM_TYPES.has(type) ? parts[0] : (type === "vehicle" && parts[0] === "weapon" ? parts[1] : null);
      if ( itemId && this.isRenderItem() ) return this.renderItem(this.actor, itemId);

      // Several tokens selected: roll for each (combat rolls, saves, attributes).
      const actors = this.actor ? [this.actor] : (this.actors ?? []);
      for ( const actor of actors ) {
        if ( !actor ) continue;
        await this.#run(actor, type, parts);
      }
    }

    /** Do one action for one actor. */
    async #run(actor, type, parts) {
      const api = game.palladium;
      if ( !api ) return ui.notifications.warn("Palladium Universal isn't running.");
      const item = id => actor.items.get(id);
      switch ( type ) {
        case "attack": {
          const weapon = item(parts[0]);
          return weapon && api.rollAttack(actor, weapon, parts[1] || "aimed");
        }
        case "maneuver": return api.rollManeuver(actor, parts[0]);
        case "combat": return api.rollCombat(actor, parts[0]);
        case "save":
          if ( parts[0] === "coma" ) return api.rollSaveVsComa(actor);
          if ( parts[0] === "horror" ) return api.rollHorrorFactor(actor);
          return api.rollSave(actor, parts[0]);
        case "attribute": return api.printAttribute(actor, parts[0]);
        case "skill": {
          const skill = item(parts[0]);
          return skill && api.rollSkill(actor, skill, parts[1] === "2");
        }
        case "spell": { const s = item(parts[0]); return s && api.castSpell(actor, s); }
        case "psionic": { const p = item(parts[0]); return p && api.usePsionic(actor, p); }
        case "magicAbility": return api.rollMagicAbility(actor, Number(parts[0]));
        case "itemRoll": { const i = item(parts[0]); return i && api.rollItem(actor, i); }
        case "device": { const d = item(parts[0]); return d && api.operateDevice(d); }
        case "condition": return actor.toggleStatusEffect(parts[0], parts[0] === "dead" ? { overlay: true } : {});
        case "vehicle":
          if ( parts[0] === "control" ) return api.rollControl(actor);
          if ( parts[0] === "evade" ) return api.rollEvade(actor);
          if ( parts[0] === "maneuver" ) return api.rollVehicleManeuver(actor);
          if ( parts[0] === "weapon" ) { const w = item(parts[1]); return w && api.rollVehicleAttack(actor, w); }
          return null;
        case "utility": return this.#utility(actor, parts[0]);
      }
      return null;
    }

    /** Utility actions. */
    async #utility(actor, key) {
      const api = game.palladium;
      const combat = game.combat;
      const combatant = combat?.combatants?.find(c => (c.actor === actor) || (c.actorId === actor.id && c.tokenId === this.token?.id));
      switch ( key ) {
        case "heal": return api.healDialog(actor);
        case "newDay": return api.newDay(actor);
        case "initiative": return combatant && combat.rollInitiative([combatant.id]);
        case "move": return combatant && api.toggleMove(combatant);
        case "cover": return combatant && api.coverDialog(combatant);
        case "endTurn": return (combat?.combatant?.id === combatant?.id) && combat.nextTurn();
      }
      return null;
    }
  };
});
