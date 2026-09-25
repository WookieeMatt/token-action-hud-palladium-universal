# Token Action HUD Palladium Universal

A [Token Action HUD](https://foundryvtt.com/packages/token-action-hud-core) system module for the **Palladium Universal** game system (TMNT & Other Strangeness) on Foundry VTT v14.

Select a token and the HUD shows its actions; everything runs through the system's own rolls and chat cards.

| Tab | What's in it |
|---|---|
| **Attack** | Each equipped weapon, one button per attack mode (Aimed / Burst / Wild, Sneak Attack, Leap Attack when unlocked, black powder modes), with the Strike bonus and damage; the maneuvers the Combat Training unlocks (Hold, Entangle, Tackle, Throw, Jump Kick). |
| **Combat** | Initiative, Strike, Parry, Dodge, Roll with Impact, Pull Punch, Disarm; the saving throws, Save vs Coma and vs Horror Factor. |
| **Attributes & Skills** | The eight attributes (click prints the score to chat) and every skill with its percentage. |
| **Powers** | Spells (cast), the magic tradition's automatic abilities, psionics, abilities with a roll. |
| **Inventory** | Gear and armor with a roll; devices to operate. |
| **Vehicle** | For vehicles and time machines: Control Roll, Evade, Maneuver and the mounted weapons. |
| **Conditions** | Every condition as a toggle (lit when active), plus Dead. |
| **Utility** | In combat: Roll Initiative, Move Action, Cover, End Turn. Rest & Heal, New Day (spell casters), and Token Action HUD's own token actions. |

**Right-click** a weapon, skill, spell, power or item to open it. With **several tokens selected**, combat rolls, saves and attributes roll for each of them.

The **Palladium Universal** HUD style (parchment and green, like the sheets) can be picked in Token Action HUD Core's *Style* setting.

## Installation
In Foundry's **Add-on Modules** tab, **Install Module**, and paste this manifest URL:

```
https://github.com/WookieeMatt/token-action-hud-palladium-universal/releases/latest/download/module.json
```

Requires the **Palladium Universal** system (1.28.0 or later), **Token Action HUD Core** 2.1 and its library **socketlib**.

## License
MIT (see LICENSE). The HUD style in `styles/tah-palladium.css` is adapted from Token Action HUD Core's Foundry VTT Light style (CC BY 4.0, by Larkinabout). Not affiliated with Palladium Books; Palladium Universal is a fan-made system.
