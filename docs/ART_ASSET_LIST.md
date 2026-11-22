# Starbell Academy — Art Asset List

Master checklist of every piece of art: what's in the game, what's still wanted, and the spec for making new art.
Snapshot: live game **version 1795346941-d0b7** (22 Nov 2026). Region 3, Thesis, passive and Boss Rush art is now real (2b12). **All 165 art keys from Regions 1–2 are your hand-made art.** Region 3 and the Lv 40 master outfits are running on **in-game recoloured placeholders**, so everything in sections 4–5 is ready to be replaced whenever you draw it.

**Size:** no limit any more. The game now runs on GitHub Pages with art as separate files loaded per region (since 22 Nov 2026). Use the size guide in section 8. Art can come from Gemini or PixelLab (see the *PixelLab Guide* doc).

---

## 0. Priority queue (updated after release 2b12)

**Done in 2b12:** queue items 1–8 plus most of Tier 3–4: the Shadow, all four Archive monsters, Quillon, Lumen, Candelabra, Sealed Stair, Little Grimoire, all Archive backgrounds (far + mid) and tiles, Boss Rush arena and icons, master outfits for all three classes, all Thesis skill effects, Tier 7/8 icons, all 17 passive icons, stun stars, meteor impact, star bolt, Knight slash, spinning coin, telegraph, shield bubble, enrage aura.


**Remaining, in order:**
1. ~~Principal portrait re-roll~~ (done with PixelLab in 36a6)
2. **Region 4 art** (section 4b): Act 1 first, then Act 2, in the order listed there
3. Optional: Lumen full-body sprite (the bust works fine as a ghost)
4. Optional: ink splash, violet shadow shockwave/arrow/meteor (code tints cover these)
5. Optional: Thesis extras (master badge, diploma), monster hurt frames

## 1. Spec for every sheet (send this to Gemini each time)

- **Background:** one flat solid colour that doesn't appear in the sprite. Magenta `#FF00FF` keys out cleanest. Avoid dark backgrounds behind dark sprites.
- **Layout:** all frames in **one row**, same size per frame, **clear gaps** between frames, no grid, no labels, no text.
- **Facing:** characters and monsters face **RIGHT** (the game mirrors them).
- **Consistency:** same scale and same ground line across every frame of an animation.
- **Size:** about **2× the in-game size**, and no bigger (section 8). Bigger art makes the single game file heavier for everyone.
- **Backgrounds:** far layer = full scene, 540 tall. Mid/near layers = leave the sky empty (flat colour) so the layer behind shows through.
- **Style:** cute chibi pixel art, soft outlines, school-fantasy. Palette anchors: navy `#1b1633`, parchment `#f6ecd2`, brass `#f2c14e`.

### Gemini prompt template
```
Pixel art sprite sheet, cute chibi school-fantasy RPG style, clean dark outlines,
soft shading. [SUBJECT DESCRIPTION]. [N] animation frames: [frame list], arranged
left to right in a single row with equal spacing and clear gaps. Character faces
right. Same size and same ground line in every frame. Solid flat magenta (#FF00FF)
background, no grid, no text, no labels, no shadows on the background.
```
For backgrounds: replace the frame part with "wide side-scrolling game background layer, 3:1 aspect, [far: full scene / mid: buildings only, empty magenta sky]".

**Saving Gemini credits:** batch related frames in one sheet (e.g. idle + walk together), and ask for icons 6–9 at a time in a single grid with gaps.

---

## 2. What's in the game (done ✅)

Elite (~9%) and shiny (~1%) monsters are live and use code tints of existing sprites, so they need no new art.

### Characters (idle 2 · walk · jump · attack · hurt each)
✅ Freshman · ✅ Blade Cadet · ✅ Wind Archer · ✅ Spark Mage (new idle + blink, 4-frame walk with staff, 23 Nov) · ✅ Bell Knight · ✅ Gale Ranger (4-frame walk with bow, 23 Nov) · ✅ Astral Scholar

### Monsters
| Monster | Frames |
|---|---|
| ✅ Dew Slime / Ink Slime | hop loop |
| ✅ Page Worm | crawl |
| ✅ Quill Bat | flap |
| ✅ Chalk Golem | walk, wind-up, slam |
| ✅ Gargoyle (boss) | idle (breathing pair, 23 Nov), walk (5 frames, new frame 4 on 23 Nov), wind-up, leap, slam, hurt |
| ✅ Bog Frog | sit, crouch, jump (new airborne frame, 23 Nov) |
| ✅ Mist Wisp | flutter 3 |
| ✅ Rune Sentinel | walk, wind-up, slam |
| ✅ Moonlit Chimera (boss) | idle, walk, wind-up, leap, slam, hurt |

### NPCs and objects
✅ Shopkeeper · ✅ Notice board · ✅ Fountain · ✅ Marlo the Outfitter · ✅ Pip the Pet Keeper (idle + wave, 23 Nov) · ✅ Lantern Well · ✅ Lantern Gate (4-frame swirl)

### Pets (3-frame loop)
✅ Pocket Chick · ✅ Mochi · ✅ Lantern Moth (new wings-down frame, 23 Nov) · ✅ Star Wisp

### Backgrounds and tiles (bg far/mid/near · ground top + fill · platform)
| Area | Layers |
|---|---|
| ✅ Starbell Courtyard | far, mid, tiles, platform |
| ✅ Moonpetal Gardens | far, mid, near, tiles, platform |
| ✅ Hall of Whispering Books | far, mid, tiles, platform |
| ✅ Old Bell Tower | far, mid, near, tiles, platform |
| ✅ Lanternfall Village | far, mid, tiles, platform |
| ✅ Mistveil Marsh | far, mid, near, tiles, platform |
| ✅ Sunken Observatory | far, mid, tiles, platform |
| ✅ Moonlit Dome | far, mid, near, tiles, platform |

### Effects
✅ Slash · ✅ Hit spark · ✅ Ember · ✅ Frost ring · ✅ Meteor · ✅ Comet · ✅ Shockwave · ✅ Arrow · ✅ Gale · ✅ Orb · ✅ Whirl (Blade + Ranger) · ✅ Volley · ✅ Tolling Guard aura · ✅ Level-up · ✅ Upgrade success / fail · ✅ Weapon upgrade glow (pixelfx, drawn in code since 23 Nov; the old glow art is retired)

### Icons
- ✅ Skills: 4 per course (12) + 3 advanced skills
- ✅ Items: coin, potion, ether, Star Shard, Re-study Scroll, Practice Sword, Saber, Longbow, Wand, Charm, Brooch, Pendant
- ✅ Top bar: Course (cap), Quests, Shop (coin bag), Stats (book), Bag (satchel), Map

---

## 3. Still wanted (polish, from Art List #4)

These would improve the existing game. None of them block anything.

- [x] **Stun stars**: small stars circling a stunned monster's head · 3 frames · ~64×32
- [x] **Comet impact**: blue-white explosion when Comet Seminar lands · 4–5 frames · ~256×192
- [x] **Astral star bolt**: blue star projectile for the Scholar's basic attack · 2–3 frames · ~64×64
- [x] **Bell Knight slash trail**: gold crescent arc · 3–4 frames · ~192×128
- [x] **Spinning gold coin** drop (the coin is a single frame now) · 4 frames · ~32×32
- [ ] **Walks with the weapon in every frame** for Blade Cadet, Freshman, Bell Knight and Laureate (the upgrade glow only shows on frames where the weapon is drawn)
- [ ] **Monster hurt/flash frames** for slimes, worm, bat, frog, wisp (optional; the game flashes them white now)

---

## 4. Region 3: The Forbidden Archive (LIVE, real art since 2b12)

The region is live using recoloured placeholders.

**What each placeholder is today** (from the release notes):
| Real art needed | Placeholder in the game now |
|---|---|
| Reading Room, Catacombs, Portraits backgrounds + tiles | recoloured Hall of Whispering Books |
| Sealed Vault background + tiles | recoloured Old Bell Tower |
| Blotling | recoloured Ink Slime |
| Inkwraith | recoloured Mist Wisp |
| Portrait Mimic, Cursed Armour | recoloured Rune Sentinel |
| Headmaster's Shadow | recoloured Gargoyle |
| Quillon / Lumen | recoloured Marlo / Pip |
| Everlit Candelabra | recoloured Lantern Well |
| Little Grimoire | recoloured Stats book icon |
| Lost Page | Re-study Scroll icon |
| Sealed Stair | Lantern Gate portal |
| Vault portrait frames | drawn in code (fine to keep) |

 Each item below replaces a placeholder. Design details are in the Game Bible, section 3.3. **Size budget for all Region 3 art: about 1 MB.**
Palette for this whole region: deep ink blue `#141a3a`, candle gold `#f2c14e`, old-paper cream `#e8d9b4`, cursed violet `#8a4ad6`.
Add this line to every Region 3 prompt: *"Dark candlelit magical library underground, deep ink blue and candle gold palette, with violet cursed magic accents."*

**Priority order** (what players notice most first):
1. Monsters + boss → 2. Town NPCs → 3. Backgrounds → 4. Tiles/platforms → 5. Icons, pet, effects.

### 4.1 Monsters (~100–150 px frames)
- [x] **Blotling**: round living ink blob with two big white eyes and a drip "tail" · hop loop 3 frames (squash, normal, stretch)
  - [ ] **Mini Blotling**: optional; the game can just shrink the Blotling
- [x] **Inkwraith**: small hooded ghost made of flowing ink, glowing gold eyes, wispy ink trail · float 3 frames + swoop 1 frame
- [x] **Portrait Mimic**: a gilded picture frame with a painted face that comes alive · 4 frames: disguised (calm painting), eyes open (glowing), lunge (frame tilted forward, mouth open), hurt · plus a 4-frame walk (23 Nov)
- [x] **Cursed Armour**: empty suit of knight armour with violet light inside the helmet · walk 2, wind-up 1 (sword raised), sweep 1 (sword swung low)

### 4.2 Boss: The Headmaster's Shadow (~260×200 frames)
Tall silhouette in a headmaster's robe and mortarboard, made of ink with violet glowing edges, golden eyes, a cracked bell hanging from a chain.
- [x] idle 2 · walk 4 · wind-up 1 · leap 1 · slam 1 · hurt 1
- [x] **Cast pose** 1 (arms raised, for arrow rain and meteors)
- [x] **Teleport** 2–3 frames (dissolving into ink)
- [ ] Optional: **phase-3 version** with the bell crack glowing brighter (or the code can tint it)

### 4.3 NPCs (idle 2 frames, ~240×200)
- [x] **Archivist Quillon**: ghostly pale-blue owl librarian in round spectacles and a tiny cardigan, standing behind a desk stacked with books
- [x] **Prefect Lumen**: translucent ghost girl in an old-fashioned Starbell uniform with a prefect badge, cheerful and floating slightly

### 4.4 Objects
- [x] **Sealed Stair**: trapdoor in the Old Bell Tower floor with a glowing bell sigil · 2 frames (locked: dim, unlocked: glowing) · ~180×120
- [x] **Everlit Candelabra**: tall brass candelabra, healing glow · 3-frame flicker loop · ~150×230
- [x] **Moonstone Key**: item icon · 64×64

### 4.5 Backgrounds (far 540 tall · mid ~250–300 tall with empty sky · near optional)
Backgrounds are the heaviest art. To stay in budget, keep far layers about **1,600–2,000 px wide** and consider skipping near layers.
- [x] **Candlelit Reading Room**: far (warm library hall, tall shelves, reading tables, candles) + mid (shelves and ladders)
- [x] **Ink Catacombs**: far (stone tunnels, shelves sunk in ink pools, dripping ink) + mid (arches, chained books) + near (optional: hanging chains, ink drips)
- [x] **Hall of Living Portraits**: far (long gallery, rows of gilded portraits, red carpet, chandeliers) + mid (portrait frames and pillars)
- [x] **The Sealed Vault**: far (round stone vault, giant cracked bell seal glowing violet on the floor) + mid (pillars with chains) + near (optional: floating torn pages)

### 4.6 Tiles and platforms (per area: ground top strip + fill + floating platform)
- [x] Reading Room: polished wood floor · bookshelf-top platform
- [x] Ink Catacombs: cracked stone with ink puddles · stacked-books platform
- [x] Hall of Living Portraits: carpet over marble · balcony ledge platform
- [x] Sealed Vault: rune-carved stone · floating stone slab platform

### 4.7 Icons, pet and effects
- [x] **Little Grimoire** pet: small floating spellbook with a happy face and a ribbon bookmark tail · 3-frame flap loop · ~100×100
- [x] **Lost Page** item icon: torn yellowed page with faint writing · 64×64
- [x] **Inkbound** weapon icons (Saber, Longbow, Wand) + charm icon, blue-violet ink theme · 64×64 each
- [x] **Sealbreaker** weapon icons (Saber, Longbow, Wand) + charm icon, rose-pink with a broken-seal motif · 64×64 each
- [ ] **Ink splash** (Blotling death / split) · 3 frames · ~128×96
- [ ] **Shadow shockwave** (violet version of the shockwave) · 2 frames · ~129×77
- [ ] **Shadow arrow** and **shadow meteor** (violet/ink versions) · 1–2 frames each
- [x] **Telegraph marker**: glowing red-violet floor circle · 2-frame pulse · ~160×48

### 4.8 Ready-to-use Gemini prompts
Paste the template from section 1, then the subject line below.

| Asset | Subject line |
|---|---|
| Blotling | "a round living ink blob monster with two big white eyes and a drippy tail. 3 frames: squashed, normal, stretched upward mid-hop" |
| Inkwraith | "a small hooded ghost made of flowing black-blue ink with glowing gold eyes and a wispy ink trail. 4 frames: float, float, float, swooping forward" |
| Portrait Mimic | "a gilded gold picture frame holding a painted portrait of a stern noble that comes alive as a monster. 4 frames: calm painting, eyes glowing open, lunging forward with mouth open, recoiling hurt" |
| Cursed Armour | "an empty suit of dark steel knight armour with violet light glowing inside the helmet, holding a longsword. 4 frames: walk, walk, sword raised high, sword swung low" |
| Headmaster's Shadow | "a tall boss silhouette wearing a headmaster's robe and mortarboard, body made of black ink with violet glowing edges, golden eyes, a cracked bell hanging from a chain. 8 frames: idle, idle, walk, walk, walk, walk, crouch wind-up, leaping" (second sheet: "slam, hurt, arms raised casting, dissolving into ink, half dissolved") |
| Quillon | "a ghostly pale-blue owl librarian with round spectacles and a small cardigan, standing behind a wooden desk stacked with books. 2 idle frames, slight blink" |
| Lumen | "a translucent friendly ghost girl in an old-fashioned school uniform with a prefect badge, floating slightly, waving. 2 idle frames" |
| Little Grimoire | "a tiny floating spellbook pet with a happy face on the cover and a red ribbon bookmark tail. 3 frames flapping its pages like wings" |

---

## 4b. Region 4: Clocktide Harbor (two acts, Lv 40–60) `PLANNED`

Design in the Game Bible, sections 3.4 and 5.3–5.4. No size budget; follow the section 8 size guide.

**Act 1 is live with placeholders (c757fed).** Art group: `harbor1` (Act 2 will be `harbor2`). Keys waiting for art: `crab_walk/_wind/_slam`, `gull`, `automaton_walk/_wind/_slam`, `jelly`, `colossus_idle/_walk/_wind/_leap/_slam/_hurt`, `npc_wren`, `npc_ottilie`, `pet_sparrow`, `kettle`, `ico_cog`, `bg_wharf_far`, `bg_docks_far`, `bg_rig_far`, `bg_light_far`, `t_{wharf,docks,rig,light}_top/_fill`, `p_{wharf,docks,rig,light}`, `ico_t9_*`, `ico_t10_*`. The *Starling* and the lamp are drawn in code and still need keys. Each one replaces its placeholder as soon as it is added with `tools/add_art.py`.
Add the matching line to every Region 4 prompt:
- **Act 1:** *"Floating sky-port above a sea of clouds, airships and brass clockwork, bright teal and brass palette."* (Lighthouse: *"stormy night, rain, navy and lightning-yellow palette."*)
- **Act 2:** *"Glowing world beneath a sea of clouds, coral and shipwrecks, deep indigo with coral pink and bioluminescent cyan."*

**Priority order (≈ one Gemini/PixelLab request each)**

*Act 1 (needed first)*
1. **Brass Colossus**, sheet 1: idle 2, walk 2, piston wind-up, punch
2. **Brass Colossus**, sheet 2: steam-vent stomp, overcharge (coils crackling), furnace open, hurt
3. **Gear Crab + Kite Gull** (one row each)
4. **Rusted Automaton + Storm Jelly** (one row each)
5. **Captain Wren + Ottilie** (one row each)
6. **Brassbell Wharf** far background
7. **Cogwind Docks** far background
8. **Cloudsail Rigging** far background
9. **Stormglass Lighthouse** far background
10. **Act 1 tiles + platforms grid**
11. **Act 1 objects grid:** *Starling* airship at the dock, Teakettle Boiler, lighthouse lamp (off/on), Brass Cog, Clockwork Sparrow

*Act 2*
12. **Tidecaller Kraken**, body/head sheet (idle 2, lunge, hurt) + **tentacle** sheet (rise, slam, sweep)
13. **Reef Puffer + Siren Eel** (one row each)
14. **Ghost Deckhand + Barnacle Golem** (one row each)
15. **Old Barnaby + Nerissa** (one row each)
16. **Driftwood Outpost** far background
17. **Undertow Reef** far background
18. **Wreckers' Graveyard** far background
19. **The Maelstrom Eye** far background
20. **Act 2 tiles + platforms grid**
21. **Act 2 objects grid:** Shell Spring, storm anchor (unplanted / planted), bubble lift, Cloud Pearl, Nimbus the whale calf

*Both*
22. **Gear icons grid:** Tidebrass, Stormglass, Coralsteel, Leviathan × Saber/Longbow/Wand/Charm (16 icons, two grids)
23. Optional: mid background layers for all 8 areas; effects (lightning bolt, tidal wave, steam vent, electric ring, spine burst, spectral anchor, lullaby notes). Wind, fog, currents and telegraph marks stay code-drawn.

### 4b.1 Act 1 monsters (~2–3× in-game size)
- [ ] **Gear Crab**: chunky brass-and-copper crab with a gear-shaped shell · walk 2, **guard** 1 (claws raised), attack 1
- [ ] **Kite Gull**: seagull with patched kite-cloth wings and a tiny pilot scarf · flap 3 + dive 1
- [ ] **Rusted Automaton**: tall rusty clockwork sailor robot with a porthole face and steam pipes · walk 2, wind-up 1, punch/steam 1
- [ ] **Storm Jelly**: glowing translucent jellyfish with yellow lightning inside · float 2 + charged 1 (used in both acts)

### 4b.2 Act 1 boss: Brass Colossus
Towering brass giant made from a lighthouse storm engine: piston arms, glowing orange furnace belly, lightning coils on the shoulders, the dark lighthouse lamp as its head.
- [ ] idle 2 · walk 2 · piston wind-up 1 · punch 1 · vent stomp 1 · overcharge 1 (coils crackling) · furnace open 1 (weak point glowing) · hurt 1 (~300×300 frames)

### 4b.3 Act 2 monsters
- [ ] **Reef Puffer**: round spotted pufferfish floating in the cloud-sea, cute and grumpy · waddle-float 2, **puffed** 1 (spiky ball), spine burst 1
- [ ] **Siren Eel**: long glowing cyan eel with fin-frills and big eyes · swim 3 (wavy), lunge 1, sing 1 (mouth open, music notes optional)
- [ ] **Ghost Deckhand**: translucent ghostly sailor with a striped shirt, bandana and cutlass · walk 2, slash 1, throw 1, **spirit** 1 (small floating wisp of its soul)
- [ ] **Barnacle Golem**: hulking stone-and-coral golem crusted with barnacles and seaweed · walk 2, wind-up 1, slam 1, plus a **bare** version (walk 2) with the barnacles gone

### 4b.4 Act 2 boss: Tidecaller Kraken
Huge deep-sea kraken, barnacled teal skin, glowing yellow eyes, a black page stuck to its forehead.
- [ ] **Body/head** (~300×260): idle 2 (rising from clouds), lunge 1 (head forward, mouth open), hurt 1
- [ ] **Tentacle** (~120×300, drawn vertically): rise 1, slam 1 (curled on impact), sweep 1 (horizontal, ~300×100)

### 4b.5 NPCs (idle 2 frames)
- [ ] **Captain Wren Halloway**: airship captain with flight goggles, a long red scarf and a navy captain's coat with brass buttons, confident pose
- [ ] **Ottilie Spanner**: cheerful gnome tinkerer with a huge wrench, oil-smudged overalls and a backpack full of gears
- [ ] **Old Barnaby Finch**: old lighthouse keeper with a big white beard, yellow oilskin coat and a pipe blowing bubbles
- [ ] **Nerissa**: young cloud-diver girl in a brass diving helmet with the visor up and a patched diving suit, holding a lantern

### 4b.6 Objects
- [ ] **Skyward Dock / *Starling* airship**: small academy airship with a starry balloon, moored at a wooden dock · 2-frame bob (Courtyard right edge + all Harbor hubs)
- [ ] **Teakettle Boiler**: giant brass kettle with steam puffs (heals) · 3-frame loop
- [ ] **Lighthouse lamp**: big brass lantern, 2 frames (dark / lit)
- [ ] **Shell Spring**: giant open clamshell pool with a glowing pearl (heals) · 3-frame shimmer loop
- [ ] **Storm anchor**: big iron anchor with a glowing rune, 2 frames (floating loose / planted and glowing)
- [ ] **Bubble lift**: large shimmering bubble · 2 frames (float, pop)
- [ ] **Brass Cog** and **Cloud Pearl** item icons

### 4b.7 Backgrounds (far 540 tall, up to ~3,000 px wide · mid optional with empty sky)
*Act 1*
- [ ] **Brassbell Wharf**: busy dock town on floating islands, moored airships, sea of clouds, daytime
- [ ] **Cogwind Docks**: long piers, giant turning gears, cranes, cloud-sea
- [ ] **Cloudsail Rigging**: huge airship masts and billowing sails seen from among the rigging, bright sky
- [ ] **Stormglass Lighthouse**: tall glass-topped lighthouse in a storm, dark clouds, rain, lightning
*Act 2*
- [ ] **Driftwood Outpost**: a cosy camp built on a giant wrecked airship hull floating in a glowing indigo cloud-sea, lanterns and hammocks
- [ ] **Undertow Reef**: glowing coral forests and kelp drifting in cloud-sea, light rays from above
- [ ] **Wreckers' Graveyard**: broken ghost-ships tilted at odd angles, torn sails, green ghost-lights, mist
- [ ] **The Maelstrom Eye**: a huge spiralling storm wall around a calm centre, lightning in the clouds, wreckage circling

### 4b.8 Tiles and platforms
- [ ] Wharf: wooden boardwalk · crate-stack platform
- [ ] Docks: wet planks with iron bolts · hanging cargo platform
- [ ] Rigging: wooden deck · rope-bridge / yardarm platform
- [ ] Lighthouse: wet stone with brass trim · iron gantry platform
- [ ] Outpost: weathered hull planks · hammock-net platform
- [ ] Reef: coral rock · giant clam / coral shelf platform
- [ ] Graveyard: broken tilted deck planks · floating mast platform
- [ ] Maelstrom Eye: storm-worn wreck deck · drifting debris platform

### 4b.9 Pets and gear icons
- [ ] **Clockwork Sparrow**: little brass wind-up sparrow with a key on its back · 3-frame flap
- [ ] **Nimbus**: a tiny fluffy cloud-whale calf, white and pale blue, happy face, little water-spout puff · 3-frame float
- [ ] **Tidebrass** (Saber, Longbow, Wand, Charm): polished brass with sea-wave engravings
- [ ] **Stormglass** (Saber, Longbow, Wand, Charm): teal glass with trapped lightning
- [ ] **Coralsteel** (Saber, Longbow, Wand, Charm): coral-pink metal with shell inlays
- [ ] **Leviathan** (Saber, Longbow, Wand, Charm): deep-blue scaled metal with a glowing yellow eye gem

### 4b.10 Ready-to-use prompts
Paste the template from section 1, add the act line above, then the subject line.

| Asset | Subject line |
|---|---|
| Brass Colossus 1 | "a towering brass giant boss made from a lighthouse storm engine, piston arms, glowing orange furnace belly, lightning coils on its shoulders, a dark lighthouse lamp as its head. 6 frames: idle, idle, walk, walk, arm pulled back winding up, piston punch" |
| Brass Colossus 2 | "the same brass giant boss. 4 frames: stomping with steam blasting from the ground, shoulder coils crackling with lightning, furnace door open showing a glowing core, recoiling hurt" |
| Gear Crab + Kite Gull | "two monsters, one per row. Row 1: a chunky brass and copper crab with a gear-shaped shell, 4 frames: walk, walk, claws raised guarding, claw attack. Row 2: a seagull with patched kite-cloth wings and a tiny scarf, 4 frames: flap, flap, flap, diving downward" |
| Automaton + Storm Jelly | "two monsters, one per row. Row 1: a tall rusty clockwork sailor robot with a porthole face and steam pipes, 4 frames: walk, walk, arm wound back, punching with a steam burst. Row 2: a glowing translucent jellyfish with yellow lightning inside, 3 frames: float, float, charged and crackling" |
| Wren + Ottilie | "two NPCs, one per row, 2 idle frames each. Row 1: a confident airship captain woman with flight goggles, a long red scarf and a navy coat with brass buttons. Row 2: a cheerful gnome tinkerer with a huge wrench, oil-smudged overalls and a backpack of gears" |
| Kraken body | "a huge deep-sea kraken boss with barnacled teal skin, glowing yellow eyes and a black paper page stuck to its forehead, rising from clouds, only the head and upper body visible. 4 frames: idle, idle, lunging forward with mouth open, recoiling hurt" |
| Kraken tentacle | "a single giant teal kraken tentacle with suckers and barnacles. 3 frames: rising straight up, slammed down curled on the ground, sweeping horizontally low to the ground" |
| Puffer + Eel | "two monsters, one per row. Row 1: a cute grumpy spotted pufferfish floating in the air, 4 frames: float, float, puffed up into a spiky ball, spines bursting outward. Row 2: a long glowing cyan eel with fin frills and big eyes, 5 frames: swim, swim, swim (wavy body), lunging forward, mouth open singing" |
| Deckhand + Golem | "two monsters, one per row. Row 1: a translucent ghostly sailor with a striped shirt, bandana and cutlass, 5 frames: walk, walk, slash, throwing an anchor, a small floating soul wisp. Row 2: a hulking stone and coral golem crusted with barnacles and seaweed, 4 frames: walk, walk, arms raised, slam" |
| Barnaby + Nerissa | "two NPCs, one per row, 2 idle frames each. Row 1: an old lighthouse keeper with a big white beard and yellow oilskin coat, smoking a pipe that blows bubbles. Row 2: a young cloud-diver girl in a brass diving helmet with the visor up and a patched diving suit, holding a lantern" |
| Act 1 objects | "a grid of game objects with clear gaps: a small academy airship with a starry balloon moored at a wooden dock (2 frames bobbing), a giant brass teakettle puffing steam (3 frames), a big brass lighthouse lantern dark and lit (2 frames), a brass cog icon, a little brass wind-up sparrow with a key on its back (3 frames flapping)" |
| Act 2 objects | "a grid of game objects with clear gaps: a giant open clamshell pool with a glowing pearl (3 frames shimmering), a big iron anchor with a glowing rune loose and planted (2 frames), a large shimmering bubble floating and popping (2 frames), a glowing pearl icon, a tiny fluffy white and pale-blue cloud whale calf with a happy face (3 frames floating)" |

## 5. Lv 40 Thesis: master titles (LIVE, real art since 2b12)

Design details are in the Game Bible, section 2.4. The game currently uses gold-tinted advanced outfits and code-drawn gold skill buttons, and **the upgraded skills reuse the existing effect art as-is**, so the effects in 5.2 are the most visible gap.

**Priority order:** 1. Master outfits → 2. Upgraded skill effects → 3. Thesis Defence extras.

### 5.1 Master outfits (idle 2 · walk 4–5 · jump 1 · attack 3 · hurt 1 each, ~100×150 frames)
Each one is the advanced outfit "graduated": same character, same silhouette, richer clothes with gold trim. Keep the face and hair identical to the advanced version so players recognise their character.
- [x] **Grand Bellwarden** (from Bell Knight): heavier white-and-gold plate, a short cape with a bell emblem, a small golden bell on the sword hilt
- [x] **Tempest Laureate** (from Gale Ranger): flowing green-and-gold elven robes, a laurel circlet of silver leaves, a bow with wind ribbons
- [x] **Star Professor** (from Astral Scholar): the puppy mage in a deep navy professor's gown with gold star trim, a mortarboard with a star tassel, a star-tipped staff

### 5.2 Upgraded skill effects (currently reusing the old effect art unchanged)
| Skill | New art | Size |
|---|---|---|
| Tolling Slash | small gold ground shockwave on the 3rd hit | 2 frames · ~128×48 |
| Skyrend Cut | upward gold crescent slash | 3 frames · ~128×192 |
| Cyclone Step | spinning whirlwind left behind on the ground | 3-frame loop · ~96×128 |
| Great Bell Breaker | larger double shockwave with a ghostly bell outline | 3 frames · ~256×96 |
| Cathedral Guard | gold aura with light pillars + a green heal sparkle | 2–3 frames · ~280×260 |
| Piercing Shot | arrow with a sharp white streak | 1 frame · ~64×16 |
| Cyclone Shot | small green vortex | 3-frame loop · ~128×128 |
| Arrow Storm | storm-cloud with falling arrows (optional; current shower can be scaled) | 3 frames · ~256×128 |
| Hurricane Volley | final-arrow green explosion | 4 frames · ~160×160 |
| Starspark | blue-gold lightning chain between enemies | 2 frames · ~128×32 (stretched by code) |
| Nova Pop | burning ground patch | 3-frame loop · ~160×48 |
| Aurora Lantern | ice-crystal freeze on an enemy (green-blue aurora) | 2 frames · ~96×96 |
| Starfall Symposium | big finishing meteor | 1–2 frames · ~200×200 |
| Comet Dissertation | swirling violet-blue gravity well | 3-frame loop · ~192×96 |

### 5.3 Thesis Defence extras (optional)
- [ ] **Gold icon frame**: a single 64×64 gold border to lay over skill icons (or keep the code-drawn one)
- [ ] **Master badge** icon for the HUD/class name · 32×32
- [ ] **Diploma** item icon (Thesis reward flavour) · 64×64
- Your Shadow (the mirror opponent) needs **no art**: the code tints your own sprite dark.

### 5.4 Ready-to-use Gemini prompts
Tip: attach a screenshot of the advanced outfit's idle frame to Gemini so the face and hair stay the same.

| Asset | Subject line |
|---|---|
| Grand Bellwarden | "the same silver-haired knight from the reference image, now in heavier white and gold plate armour with a short cape bearing a bell emblem, a small golden bell on the sword hilt. 12 frames: idle, idle, walk ×5, jump, attack ×3, hurt" (split into two sheets if Gemini squashes them) |
| Tempest Laureate | "the same elven archer from the reference image, now in flowing green and gold elven robes with a silver-leaf laurel circlet, holding a bow trailing wind ribbons. 12 frames: idle, idle, walk ×5, jump, attack ×3, hurt" |
| Star Professor | "the same puppy mage from the reference image, now wearing a deep navy professor's gown with gold star trim and a mortarboard with a star tassel, holding a star-tipped staff. 12 frames: idle, idle, walk ×5, jump, attack ×3, hurt" |
| Effects batch (Blade) | "four separate magic effect animations for a sword knight, gold and white: small ground shockwave (2 frames), upward crescent slash (3 frames), spinning whirlwind (3 frames), double shockwave with a ghostly bell outline (3 frames). Each effect on its own row" |
| Effects batch (Archer) | "four separate wind magic effect animations, green and silver: small swirling vortex (3 frames), storm cloud raining arrows (3 frames), round wind explosion (4 frames), arrow with a sharp white streak (1 frame). Each effect on its own row" |
| Effects batch (Mage) | "four separate star magic effect animations, blue, violet and gold: lightning chain (2 frames), burning ground patch (3 frames), ice crystal freeze (2 frames), swirling gravity well (3 frames). Each effect on its own row" |

*Note:* for effect batches, "each effect on its own row" breaks the one-row rule on purpose to save credits. Tell the code chat which row is which when you send it.

---

## 5b. Passive skill icons (optional)

Passives are live (Game Bible 2.5) with code-drawn initial badges, so these are polish only. **64×64 each**, ideally one grid of 6–9 per Gemini request.
- [x] Blade: Iron Uniform (shield on a uniform) · Bell Rhythm (bell with music notes) · Second Wind (green swirl and heart) · Warden's Resolve (cracked shield glowing) · Resounding Toll (big bell with rings)
- [x] Archer: Eagle Eye (eagle eye with crosshair) · Fleet Foot (winged boot) · Far Shot (arrow with long trail) · Keen Edge (sharp gleaming arrowhead) · Tailwind (feather in a gust)
- [x] Mage: Deep Focus (glowing blue crystal) · Lingering Magic (hourglass with sparkles) · Arcane Ward (blue bubble shield) · Overcharge (crackling wand tip) · Constellation (star map)
- [x] Electives: Healthy Lunch (bento box with a potion) · Pet Care (paw print with a heart)

Prompt line: "a grid of 6 square RPG skill icons with gold frames, cute pixel art, clear gaps between icons, solid magenta background: [list]".

---

## 6. Boss Rush (LIVE since 1795330818-e31a, using existing art)
- [x] Boss Rush arena background (far + mid), e.g. the academy's exam hall at night
- [x] Boss Rush icon for the top bar or map · ~64×64
- [x] Difficulty badges: Normal / Hard / Nightmare · 3 small icons
- [ ] Victory banner / trophy icon (optional)

---

## 7. Later regions (outline only)
Full lists get written when each region is designed. From Region 4 on, each region is two acts (about 60–80 pieces of art).
- **Emberfrost Peaks (Lv 60–80):** fire slopes, ice pass, summit shrine · cinder imp, snow fox, crystal golem + more · mid-boss TBD · Twin Drake · snow fox kit + one more pet
- **Moonpetal Faewild (Lv 80–100):** mushroom market town, dewdrop hollow, thorn court · beetle knight, mushroom guard, pollen sprite + more · mid-boss TBD · Thorn Queen · ladybug + one more pet
- **Endgame:** Boss Relic icons (one per boss) and a few title badges (64×64 / 32×32), very light

---

## 8. Size guide

Since 22 Nov 2026 the game runs on GitHub Pages with each region's art in its own folder, loaded only when you go there. There's **no size budget** any more, but sensible sizes keep sprites crisp and loading quick:

| Thing | Target frame size |
|---|---|
| Player characters | ~100–150 × 150–225 (2–3× in-game) |
| Regular monsters | ~100–200 px |
| Bosses | ~260–400 px |
| Pets | ~100–150 px |
| NPCs | ~240×200 or larger |
| Icons | 64–128 px |
| Background far layer | up to ~3,000 × 540 |
| Effects | 2–3× the size listed in each request |

*History:* while the game was a single file (until 22 Nov 2026), some sheets were downscaled to save space (14.5). Those can be re-exported at higher quality any time.

---

## Changelog
- 22 Nov 2026: List created. All 165 keys done; polish wishlist and next-up sections added.
- 22 Nov 2026: Region 3 (The Forbidden Archive) full art list and Gemini prompts added; later-region outlines added.
- 22 Nov 2026: Lv 40 Thesis section added: three master outfits, 14 upgraded skill effects, extras and Gemini prompts.
- 22 Nov 2026: Synced with the code chat: Region 3 and Thesis are built on in-game placeholders; single-file ~8 MB budget (~1 MB per region) and background width target added.
- 22 Nov 2026: Read Code Chat Release Notes (live 1795333391-6ce8). Region 3, Thesis and Boss Rush marked live; placeholder map added; noted upgraded skills reuse old effect art.
- 22 Nov 2026: Optional passive skill icons (17) added.
- 22 Nov 2026: Priority queue (section 0) added: 20 Gemini requests in 4 tiers.
- 22 Nov 2026: Synced with release 1795335752-3c5c: page 3.42 MB, oversized sheets already downscaled, passive badges live.
- 22 Nov 2026: Synced with 2b12 and d0b7: ticked all delivered art, queue rewritten (Principal re-roll first), page ~6.2 MB, Region 4 cap 1.2 MB.
- 22 Nov 2026: Budget relaxed to ~2 MB per region (16 MB limit, 14 MB warning). Region 4 Clocktide Harbor art list, priority order and Gemini prompts added (section 4b).
- 22 Nov 2026: Size limits removed (GitHub Pages). Section 4b rewritten for the two-act Harbor (Lv 40–60): Brass Colossus, 4 Act 2 monsters, Barnaby and Nerissa, Act 2 objects and backgrounds, Nimbus, Tier 9–12 icons, 23-step priority order and prompts. Principal re-roll marked done.
