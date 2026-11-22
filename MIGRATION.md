# Migration plan: artifact → GitHub Pages

Goal: move Starbell Academy from a single-file artifact (16 MB hard limit, ~6 MB now) to a normal multi-file site on GitHub Pages, so art size stops being a constraint and each region's art loads only when needed.

Live site (after step 0): https://marijo1012.github.io/starbell-academy/

## 0. One-time setup (Mario)
GitHub → this repo → **Settings → Pages** → *Build and deployment*: Source **Deploy from a branch**, Branch **main**, folder **/ (root)** → Save. The site appears at the address above within a minute or two after each push.

## 1. Move the game in unchanged (code chat)
- Commit the current artifact `index.html` as-is to `main` (single file, ~6 MB). This alone makes the game playable on GitHub Pages.
- Confirm it runs at the Pages address on PC and phone.
- Add a line to the in-game Settings / title screen: "Moved from the old link? Export a save code there and import it here."

## 2. Split the art out of the page
- Extract every embedded image (base64 WebP) into real files under `art/<group>/<key>.webp`.
- Groups: `core` (UI, icons, player classes and outfits, effects, pets, NPCs used everywhere), then one folder per region (`academy`, `lanternfall`, `archive`, later `harbor`, ...). Boss Rush arena in `core` or its own group.
- Move the art manifest (frames, frame size, anchors, scale) into `manifest.json`, with a `group` field per key.
- Optional: split the JavaScript into a few files under `js/` (engine, data, ui, save). Keep it build-free (plain `<script>` tags or ES modules).

## 3. Load art per region
- At start, load only `core` plus the region the player is in, behind a short loading screen with a progress bar.
- On travel (gate, stair, airship, world-map fast travel), load the destination's group first (show the fade/loading bar), then enter.
- Prefetch quietly: once the current region is loaded, load the next likely region in the background.
- Keep the in-game recolour placeholders as fallbacks if a file fails to load.

## 4. Saves
- `localStorage` is per website, so saves don't move automatically from claude.ai to github.io.
- Use the existing save codes: export on the artifact, import on GitHub Pages. Show the import option clearly on the title screen for the first few weeks.
- Optional: keep the artifact up with a banner pointing to the new address.

## 5. Art quality from now on
- No more 2 MB-per-region budget. Per-file guidance instead: sprites at ~2–3× in-game size, backgrounds up to ~3,000 px wide, WebP quality 75–85.
- Optional later: re-export older art that was downscaled for size (14.5) at higher quality.

## 6. Release flow
- Work on a branch, test, then merge/push to `main`; Pages redeploys automatically.
- Keep writing release notes to the Starbell Studio project (Code Chat Release Notes) with the commit hash and the Pages link.
