# Starbell Academy

A cosy school-fantasy side-scroller in the spirit of classic academy MMOs: enrol as a Freshman, choose a course (Blade, Archer or Mage), graduate, and follow the trouble out into the wider world.

- **Play:** https://marijo1012.github.io/starbell-academy/
- **Tech:** HTML5 Canvas + vanilla JavaScript, no build step
- **Art:** original pixel art (Gemini and PixelLab)

## Status

Live on GitHub Pages. Regions 1–3 (Lv 1–40) are playable; Region 4 (Clocktide Harbor, Lv 40–60) is designed and next to build. The move from the old single-file artifact is described in [MIGRATION.md](MIGRATION.md).

## Layout

```
index.html          game page + boot loader (reads manifest.json, then starts js/game.js)
js/game.js          the game
tools/              add_art.py (add or replace one art key), stamp.py (cache-busting build id)
art/
  core/             UI, player classes, effects, pets (loaded at start)
  academy/          Region 1 art
  lanternfall/      Region 2 art
  archive/          Region 3 art
  harbor/           Region 4 art
  ...
audio/              music and sound effects (later)
manifest.json       art manifest: frames, sizes, anchors, group (core or region), version hash
```

## Docs

- [docs/GAME_BIBLE.md](docs/GAME_BIBLE.md): design source of truth
- [docs/ART_ASSET_LIST.md](docs/ART_ASSET_LIST.md): art checklist, sizes and prompts
- [docs/RELEASE_NOTES.md](docs/RELEASE_NOTES.md): what shipped
- [CLAUDE.md](CLAUDE.md): how Claude works in this repo
