# Starbell Academy — Release Notes

Newest first. Written by Claude Code after each release (see CLAUDE.md). Releases before 23 Nov 2026 are in the Starbell Studio project doc *Code Chat Release Notes*; they are already reflected in `docs/GAME_BIBLE.md`.

---

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
