# Starbell Academy

A cosy school-fantasy side-scroller in the spirit of classic academy MMOs: enrol as a Freshman, choose a course (Blade, Archer or Mage), graduate, and follow the trouble out into the wider world.

- **Play:** https://marijo1012.github.io/starbell-academy/ (once GitHub Pages is on and the game has been moved in)
- **Tech:** HTML5 Canvas + vanilla JavaScript, no build step
- **Art:** original pixel art (Gemini and PixelLab)

## Status

The game is being moved here from its original single-file Claude artifact so that art no longer has to be packed into one page (the artifact limit is 16 MB). See [MIGRATION.md](MIGRATION.md) for the plan.

## Planned layout

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

## Design docs

Game design lives in the Starbell Studio project (Game Bible, Art Asset List, Code Chat Release Notes).
