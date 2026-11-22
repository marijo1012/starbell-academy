# Starbell Academy — notes for Claude

A cosy school-fantasy side-scroller (HTML5 Canvas, vanilla JS, no build step), published with GitHub Pages at https://marijo1012.github.io/starbell-academy/. The owner is Mario; he plays on PC and phone and makes the pixel art with Gemini and PixelLab.

## Read first
- `docs/GAME_BIBLE.md` — what the game is and what to build next. Section numbers are how work is requested ("implement section 17"). Status tags: `LIVE` · `PLANNED` · `IDEA`.
- `docs/ART_ASSET_LIST.md` — every art piece: done, wanted, sizes and prompts.
- `docs/RELEASE_NOTES.md` — what shipped, newest first.

## Layout
- `index.html` — page, HUD/panel markup and a small boot loader (holds `const BUILD='…'`).
- `js/game.js` — the whole game.
- `manifest.json` — one entry per art key: frames `n`, frame size `fw`/`fh`, anchor `ax`/`ay`, optional scale `ds`, `group`, content hash `v`.
- `art/<group>/<key>.webp` — art split by group: `core` (UI, icons, player outfits, effects, pets, shared NPCs), one folder per region (`academy`, `lanternfall`, `archive`, …) and `arena` (Boss Rush). `core` loads at start; a region's group loads when the player travels there, and neighbouring regions prefetch.
- `tools/add_art.py KEY strip.png --group <region> --n <frames> [--ax --ay --ds --q]` — add or replace one art key (strip = frames side by side). Run `tools/stamp.py` afterwards.
- `tools/stamp.py` — writes a new build id into `index.html` so browsers fetch fresh `js/game.js` and `manifest.json`. Run it after any change to either.

## Working rules
- **The design side decides content.** Build what the bible says. If something can't work as written, build the closest sensible version and record the deviation in the release notes rather than silently changing the design.
- **Balance numbers live in code.** Monster stats come from the level curve in `js/game.js`; the bible's numbers are targets. Report the live values you end up with.
- **Placeholders:** until Mario's art arrives, recolour existing sprites in code (as done for earlier regions). New region art goes in its own `art/<region>/` group.
- **Saves are precious.** Players' progress lives in `localStorage`; never break old saves. Add new save fields with defaults on load.
- **Test before pushing:** run the game in a headless browser (PC and phone-sized viewports) and check the console for errors, especially travel between regions, boss fights and saving/loading.
- **Git:** work on a branch, then merge/push to `main` when it's tested (Pages redeploys from `main`). Run `tools/stamp.py` before committing code or manifest changes.

## After every release
1. Add an entry at the top of `docs/RELEASE_NOTES.md`: date, commit hash, which bible sections it implements, what changed, deviations from the bible, new art keys and their groups, anything the design side needs to decide.
2. In `docs/GAME_BIBLE.md`, mark the shipped items `LIVE` with the commit hash and record changed numbers. Don't rewrite design text beyond that.
3. In `docs/ART_ASSET_LIST.md`, tick off art that went in.
4. Tell Mario in plain words what changed and what to test.

## Style
- Mario prefers short, plain answers and likes being asked clarifying questions before big choices.
- British spelling in game text and docs.
- Game text tone: cosy, cheeky, school-themed; keep NPC lines short.
