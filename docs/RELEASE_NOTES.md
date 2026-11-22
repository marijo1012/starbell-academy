# Starbell Academy — Release Notes

Newest first. Written by Claude Code after each release (see CLAUDE.md). Releases before 23 Nov 2026 are in the Starbell Studio project doc *Code Chat Release Notes*; they are already reflected in `docs/GAME_BIBLE.md`.

---

## 23 Nov 2026: Clocktide Harbor, Act 1 (commit c757fed, build 2e57967e38)

Implements **Game Bible section 17, Act 1 (items 1–8)** plus the Act 1 parts of items 16–20 (drops, EXP, Boss Rush, achievement, report). Sections touched: 3.4, 5, 5.3, 7.1, 7.4, 8.

### What's new
- **Skyward Dock** at the far right of the Starbell Courtyard (x≈845). Appears once the Headmaster's Shadow quest is done (or the Thesis is passed); the *Starling* takes Lv 40+ students. First boarding plays Wren's boarding scene; later talks offer the flight.
- **Clocktide Harbor** (new map, id `harbor1`): Brassbell Wharf (hub) · Cogwind Docks (Lv 42) · Cloudsail Rigging (Lv 46) · Stormglass Lighthouse (Lv 48, boss deck). All four join the World Map once visited. Arrival scene on first visit.
- **Brassbell Wharf:** *Starling* + Captain Wren (fly home, story lines), **Teakettle Boiler** (heals), **Ottilie Spanner** (intro scene, then her shop: Tidebrass, Stormglass, Star Shard ×10, potion/ether ×10).
- **Wind gusts** (Rigging): every 7–9 s, a 1.2 s warning ("A gust is coming →"), then 2 s of wind pushing you (115 px/s) and your projectiles. Streaks drawn on screen.
- **Lightning strikes** (Lighthouse): yellow mark, strike 1 s later, every 2.5–4 s (5–7 s while the boss is up). Hurts you and also non-boss monsters (12% of their max HP). Rain and sky flashes.
- **Monsters:** Gear Crab (raises claws for 1.5 s every 3–5 s and blocks every frontal hit, shows "Blocked"), Kite Gull (circles, cries and pauses 0.55 s with a dashed red line to its target, then dives in a straight line), Rusted Automaton (wind-up punch + a telegraphed steam vent 120 px in front every 4.5–6 s, 16% gear drop), Storm Jelly (slow floater; glows 0.9 s, then an electric ring of 120 px; touching it while charged does ×1.6).
- **Brass Colossus** (Lv 50): Piston Punch (270 px telegraphed reach) and Steam Vents (three vents around you). Phase 2 at 60%: lightning on 3 marked spots + 2 Rusted Automatons. Phase 3 at 30%: six vents erupting left to right (0.38 s apart), furnace door opens every 12 s for 3 s (all hits ×2, shown on its belly), +25% speed. Enrage at 6 min. Defeat scene, then the lamp sputters.
- **Stormglass Lamp** at the top of a platform stack at the right end of the Lighthouse. After the Colossus, pulling the lever plays the beam / giant-eye scene ("That's no seagull…").
- **Quests 25–33** (inserted before Extra Credit, so players on Extra Credit now get "All Aboard"). Brass Cogs drop at 25% from Harbor monsters while Spare Parts is active.
- **Gear:** Tier 9 Tidebrass (Lv 45, 170,000g), Tier 10 Stormglass (Lv 50, 260,000g), colours as in 7.1. **Pet:** Clockwork Sparrow (Spare Parts reward): +15% Star Shard drop chance, +50% loot pickup range (both grow with pet level as usual).
- **Boss Rush:** 7 waves now; the Brass Colossus (60% HP) comes before the Final Exam.
- **Achievement:** Full Steam (beat the Colossus). Monster Log lists the five new monsters automatically. Quest arrow covers the dock, Ottilie, cogs and the lamp. Report version `0.19 Clocktide Harbor Act 1`.

### Live numbers (level curve)
| Monster | Lv | HP | ATK | DEF | EXP/kill | Kills per level |
|---|---|---|---|---|---|---|
| Gear Crab | 42 | 2,812 | 185 | 25 | 844 | 17 |
| Kite Gull | 43 | 1,563 | 200 | 26 | 797 | 19 |
| Storm Jelly | 46 | 2,200 | 209 | 28 | 919 | 18 |
| Rusted Automaton | 48 (Rigging) / 50 (Lighthouse) | 6,166 / 6,630 | 311 / 330 | 29 / 30 | 1,911 / 1,984 | ~9.5 (heavy) |
| **Brass Colossus** | 50 | **232,050** (role ×91 = 1.3× the Shadow's ×70) | 306 | 30 | 45,777 | — |

Drops: Docks/Rigging monsters tier 8, Lighthouse monsters tier 9, Colossus tier 10 (guaranteed weapon + daily chest). Harbor monster gear drops are capped at tier 9 (other regions keep the old cap of 6).
Quest rewards (EXP shown ×1.5 in game): All Aboard 5k EXP/10k gold/10 pots/10 eths · Mind the Gears 3k/5k/10 shards · Pinch Points 6k/15k/Sealbreaker charm · Gull-ible 6k/15k/10 pots/5 eths · Spare Parts 7k/18k/Sparrow · Rust Bucket 8k/20k/Tidebrass weapon · Shock Value 8k/20k/Tidebrass charm · Engine Trouble 20k/50k/Stormglass weapon · Light the Lamp 6k/20k/15 shards.

### Deviations from the bible
- **Cloudsail Rigging** isn't taller than the screen: the camera only scrolls sideways, so masts, rope bridges and yardarms are stacked in four tiers up to the top of the screen (Mario's choice).
- **All Aboard comes after the Thesis** in the quest chain (quests are one line). The dock itself still works without the Thesis, and the quest completes as soon as you claim the Thesis if you have already flown.
- **Lamp:** the bible has both "the lamp blazes back to life" on the Colossus' defeat and quest 33 "relight it". Built as: it flickers on at the defeat, sputters, and you relight it at the top.
- **Light the Lamp hand-in:** Wren says the *Starling* needs a diving keel first, since Act 2 isn't built yet.
- **Quest EXP is much lower than the Archive's** (3k–20k vs 30k–120k). At the Archive's scale, quests alone would carry a player from Lv 30 to the high 50s. Act 1 quests together are worth about 6–7 levels.
- Kite Gull and Storm Jelly have no special frames yet (cry/dive/charge are drawn in code over the placeholder).

### Placeholders (until the 4b art arrives)
All new art keys fall back automatically; drop real files in with `tools/add_art.py <key> … --group harbor1` and they replace the placeholder.
| Art key | Placeholder now |
|---|---|
| `crab_walk` / `_wind` (guard) / `_slam` | recoloured Chalk Golem |
| `gull` | whitened Quill Bat |
| `automaton_walk` / `_wind` / `_slam` | recoloured Rune Sentinel |
| `jelly` | recoloured Mist Wisp |
| `colossus_idle` / `_walk` / `_wind` / `_leap` / `_slam` / `_hurt` | brass Gargoyle |
| `npc_wren`, `npc_ottilie` | recoloured Shopkeeper, Marlo |
| `pet_sparrow` | brass Lantern Moth |
| `kettle` | drawn in code |
| `ico_cog` | drawn in code |
| `bg_wharf_far`, `bg_docks_far`, `bg_rig_far`, `bg_light_far` | drawn in code (islands and airships, turning gears and cranes, masts and sails, storm lighthouse with rain) |
| `t_<area>_top`, `t_<area>_fill`, `p_<area>` for wharf / docks / rig / light | drawn in code (planks, rope bridges, iron gantries) |
| *Starling* airship, Stormglass lamp | drawn in code (no art key yet; tell me the keys when the art exists) |
| `ico_t9_*`, `ico_t10_*` | Tier 8 icons on the tier colour |
No new files, so page weight is unchanged. Placeholder sprites load the academy and lanternfall groups when you enter the Harbor.

### For the design side to decide
- **Quest EXP scale** for Regions 3–4 (see above): keep Act 1's lower values, or rebalance the Archive quests too?
- Regular monster gear drops outside the Harbor are capped at **tier 6** in code (Archive monsters drop 6, not 6–7 as the bible says). Raise it for the Archive?
- Art keys for the airship and the lamp.

### Tested
Headless Chromium at 1280×720 and iPhone 13 landscape: boarding, arrival, Ottilie and her shop, all three fields, gusts, lightning, Colossus through all phases, quests 25–33 including the Sparrow and lamp, flying home, World Map, Boss Rush Nightmare (all 7 waves), reload into a Harbor save, and an old save on Extra Credit (it now shows All Aboard). No console errors.

## 23 Nov 2026: Weapon upgrade glow (pixelfx) + new animation frames (merge bf91065; commits 2cd3560, cd63137)

No bible section: requested directly by Mario in the code chat.

### Weapon upgrade glow
- Replaces the old mask-based glow with Mario's pixelfx effects, drawn live in code: Blade line `enhance-sword`, Archer line `enhance-bow`, Mage line `enhance-staff`.
- Level 1 for +1–3, 2 for +4–6, 3 for +7–10; nothing at +0. Palette: the 7-colour ramp from the item's tier colour (pixelfx README formula).
- Follows the weapon every frame from a hand-marked weapon-point table (`WPTS` in `js/game.js`): 10 outfits × 5 animations, 116 frames, 87 with a weapon drawn. Flips with the character.
- Drawn above the character; 30% on the hurt frame; hidden while fainted. Same glow on the Equipment screen preview.
- pixelfx sources in `pixelfx/` (MIT; LICENSE and NOTICE.md kept); `js/pixelfx.js` bundles only the modules the glows use (`tools/bundle_pixelfx.py`). Credits line in Settings, on the title screen and in the README: "Effects use pixelfx (MIT), Patch and Hugo Duprez".
- Removed: the 50 `wm_*` weapon masks and the unused `fx_glow` arc art.
- **Deviations:**
  - The glow is computed on the game's own pixel grid (the sprite's points × its draw scale), not at the sprite's art-pixel size: sprites are drawn at half size on the 960×540 canvas, so art-pixel-sized glow lost most of its 1 px lines. Still nearest-neighbour, no smoothing.
  - No glow on frames where the art doesn't draw the weapon: Blade Cadet and Freshman walk frames 2–5, Knight walk (frames 2–5 are the ones played), Laureate walk, Gale Ranger attack frames 2–3, Spark Mage attack frames, and the slash/spell strike frames.

### New animation frames (Gemini, keyed from magenta)
| Key | Group | Change |
|---|---|---|
| `mage_idle` | core | new idle + blink (blink every 3–4 s; breathing bob kept) |
| `mage_walk` | core | new 4-frame walk with the staff (was 3 frames, staff missing) |
| `ranger_walk` | core | new 4-frame walk, bow in every frame (was 3 frames) |
| `boss_idle` | academy | new idle breathing pair (replaces idle + code bob) |
| `boss_walk` | academy | new frame 4 (colour-matched), full 5-frame loop restored |
| `mimic_walk` | archive | new 4-frame walk, driven by distance walked (disguise and attacks unchanged) |
| `npc_pets` | lanternfall | Pip idle + wave; waves every 4–6 s and when the player walks up |
| `frog` | lanternfall | new airborne frame 3: sit, crouch, airborne |
| `pet_moth` | core | new wings-down frame 3; flap loop 1-2-3-2 |
- Removed code stopgaps from the smoothness pass: Mage, Ranger, Gargoyle and Mimic frame skipping; the Mimic waddle; the frog stretch; the Gargoyle and Pip bob.

### For the design side
- Still worth redrawing with the weapon in every walk frame: Blade Cadet, Freshman, Bell Knight, Laureate. That brings the glow back while walking.

## 22 Nov 2026: Docs moved into the repo
- Added `docs/GAME_BIBLE.md`, `docs/ART_ASSET_LIST.md` and this file, plus `CLAUDE.md`.
- From now on Claude Code works in this repo and writes release notes here.

## 22 Nov 2026: GitHub Pages migration, steps 1–3 (commits bc7fff7, 6cfcc6d)
- Game moved from the claude.ai artifact to GitHub Pages; 336 images split into `art/<group>/`, `manifest.json`, game script in `js/game.js`, per-region loading with prefetch, save-code import note on the title screen, `tools/add_art.py` and `tools/stamp.py`.
