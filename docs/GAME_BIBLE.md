# Starbell Academy — Game Bible

Source of truth for *what* the game is. The code chat builds from this; the design chat keeps it up to date.
Snapshot of the live game: **version 1795346941-d0b7** (22 Nov 2026, QoL + Shadow Boss Rush wave; Archive art live in 2b12). Release history: see the project doc *Code Chat Release Notes*. Live: **https://marijo1012.github.io/starbell-academy/** (GitHub Pages, repo marijo1012/starbell-academy). The old artifact link stays up but is no longer updated.

Status tags: `LIVE` = in the published game · `PLANNED` = decided, ready to build · `IDEA` = not decided yet.

**Where numbers come from:** the bible's monster stats are design targets. The game's real numbers follow the code chat's level curve from its last balance pass, and those win. Where the live value is known, it's noted next to the target.

---

## 0. How we work

| Where | Owns | Doesn't do |
|---|---|---|
| **Claude Code** in the repo `marijo1012/starbell-academy` | The game code and art files, building features, testing, pushing to GitHub Pages, final balance numbers, `docs/RELEASE_NOTES.md` | Deciding content or writing lore without the design side |
| **Design chat** (Starbell Studio project) | This bible, the Art Asset List, art prompts, playtest triage, quest/NPC text, design targets | Editing the game code |

**Source of truth:** `docs/` in the repo (`docs/GAME_BIBLE.md`, `docs/ART_ASSET_LIST.md`, `docs/RELEASE_NOTES.md`). The Starbell Studio project keeps copies of the bible and art list so the design chat has them; the design chat keeps both in sync.

**Workflow**
1. Decide a change in the design chat, which updates the bible (marked `PLANNED`) in the repo and the project.
2. In Claude Code: "Implement section X of docs/GAME_BIBLE.md."
3. Claude Code builds it, pushes, adds an entry to `docs/RELEASE_NOTES.md`, and marks the items `LIVE` in the bible with the commit hash (recording any numbers it changed).
4. The design chat reads the release notes, syncs the project copies and updates the Art Asset List.

---

## 1. Pitch

A cosy, cheeky school-fantasy side-scroller in the spirit of Master of Fantasy (original world, original art). The academy's practice grounds have gone wild. You enrol as a Freshman, choose a course, graduate, then follow the trouble out into the wider world.

- **Scope (decided):** **6 regions, Lv 1–100** (Regions 4–6 are 20 levels each, in two acts), then a repeatable **Postgraduate** endgame at Lv 100 (section 12). Target length: about 25–35 hours to reach Lv 100 playing casually.
- **Shape of the game:** the academy is always home. Each new region is a "field trip" that starts from the academy and comes back to it, so the school vibe carries through even in the mountains or at sea.
- **Combat:** quick action. Hold to basic-attack, with cooldown skills that hit much harder.
- **Button rule:** a character never has more than 5 skill buttons (basic + 4). Later advancements **upgrade** existing skills instead of adding new buttons.
- **Core design rule:** everything (shop, potions, quests, map, pets) can be opened from the on-screen UI anywhere. NPCs exist for flavour and for region-only stock.
- **Platform:** browser, PC (keyboard) and phone (landscape touch buttons). HTML5 Canvas, vanilla JS, 960×540 canvas, hosted on GitHub Pages with art as separate files loaded per region. See section 13.
- **Visual identity:** night-ink navy `#1b1633`, parchment panels `#f6ecd2`, brass accent `#f2c14e`, font Pixelify Sans.

---

## 2. Classes

### 2.1 Path
Freshman (Lv 1) → **Course** at Lv 10 (Blade, Archer or Mage) → **Graduation** at Lv 20 (advanced title + 5th skill) → **Thesis** at Lv 40 (master title, all skills upgraded) `LIVE`.
Three advancements is the plan. A fourth is only considered if playtests show Lv 40–100 feels empty.

### 2.2 Class table `LIVE`

| Class | Main stat | Base HP / SP | Skills (basic, S1, S2, S3) | Cooldowns (s) | SP cost |
|---|---|---|---|---|---|
| Freshman | STR | 125 / 40 | Practice Swing, Rising Cut | 0, 3 | 0, 6 |
| Blade Cadet | STR | 140 / 40 | Slash, Rising Cut, Whirl Step (dash), Bell Breaker (stun slam) | 0, 3, 6, 14 | 0, 6, 12, 24 |
| Wind Archer | DEX | 110 / 45 | Shot, Twin Feather, Gale Shot, Arrow Shower | 0, 3, 6, 14 | 0, 6, 12, 24 |
| Spark Mage | INT | 95 / 60 | Spark, Ember Pop, Frost Lantern (slow), Starfall Lecture (meteors) | 0, 3, 7, 15 | 0, 7, 14, 28 |

**Course stat bonus** (doubled after Graduation): Blade +4 STR +3 VIT · Archer +4 DEX +2 STR · Mage +5 INT +2 DEX.
**Live since 1795330818-e31a:** all skill cooldowns are **halved** from the values above, and SP regen is +50%.

### 2.3 Advanced titles (Lv 20) `LIVE`

| Course | Title | 5th skill | CD / SP | Effect |
|---|---|---|---|---|
| Blade | Bell Knight | Tolling Guard | 22s / 30 | +30% ATK, −30% damage taken for 8s, stunning shockwave |
| Archer | Gale Ranger | Tempest Volley | 12s / 30 | Five piercing gale arrows |
| Mage | Astral Scholar | Comet Seminar | 16s / 36 | Three giant stunning meteors |

Graduation also gives ×1.12 ATK and ×1.1 max HP.

### 2.4 Master titles (Lv 40): the Thesis `LIVE`

**No new buttons.** Passing the Thesis Defence upgrades all five of your existing skills into superior versions. Each skill keeps its button, slot, cooldown, SP cost and skill-point level.

**Unlock:** quest 24, "Thesis Defence" (section 8). Reach Lv 40 and beat the Headmaster's Shadow, then defeat a **shadow copy of yourself** in the Sealed Vault. The copy uses your own sprite tinted dark and your own skills, so it needs no new art.

**Thesis bonuses (all classes):**
- ×1.1 ATK and +10% max HP, on top of Graduation's bonuses
- Course stat bonus tripled (was doubled at Graduation)
- Skill icons get a **gold border**, and the class name in the HUD gets a gold trim
- Upgraded skill effects currently **reuse the existing effect art** (no recoloured variants yet) until new art arrives

#### Blade line: Bell Knight → **Grand Bellwarden**

| Old skill | Upgraded skill | What changes |
|---|---|---|
| Slash | **Tolling Slash** | Every 3rd hit in a combo sends out a small ground shockwave |
| Rising Cut | **Skyrend Cut** | Launches enemies, then follows up with a second slash in the air |
| Whirl Step | **Cyclone Step** | The dash leaves a whirlwind trail that keeps hitting for 2s (the dash was already invulnerable) |
| Bell Breaker | **Great Bell Breaker** | 50% bigger area, two shockwaves instead of one, stun 2s → 3s |
| Tolling Guard | **Cathedral Guard** | Also heals 20% max HP when cast and pulls nearby enemies to you |

*Flavour:* "The last line of the Bell Wardens. When they ring, the whole academy hears it."

#### Archer line: Gale Ranger → **Tempest Laureate**

| Old skill | Upgraded skill | What changes |
|---|---|---|
| Shot | **Piercing Shot** | Basic arrows pass through the first enemy and hit the one behind |
| Twin Feather | **Triple Feather** | Three arrows, and they gently home in on enemies |
| Gale Shot | **Cyclone Shot** | Leaves a small vortex for 2s that pulls monsters together |
| Arrow Shower | **Arrow Storm** | 40% wider, lasts longer, and slows enemies hit by 30% |
| Tempest Volley | **Hurricane Volley** | Nine piercing arrows instead of five; the **centre** one explodes |

*Flavour:* "Honoured by the elven wind court. The wind itself takes notes when they draw."

#### Mage line: Astral Scholar → **Star Professor**

| Old skill | Upgraded skill | What changes |
|---|---|---|
| Spark | **Starspark** | Chains to two more nearby enemies at reduced damage |
| Ember Pop | **Nova Pop** | The explosion leaves burning ground for 3s |
| Frost Lantern | **Aurora Lantern** | Slows as before; an enemy hit by it three times freezes for 1.5s |
| Starfall Lecture | **Starfall Symposium** | **12 meteors + 1 big** finishing meteor |
| Comet Seminar | **Comet Dissertation** | Five comets instead of three; they leave a gravity well that pulls enemies in for 2s |

*Flavour:* "The youngest professor in Starbell's history, and still a very good boy."

**Balance note for the code chat:** aim for each upgraded skill doing roughly **+25–35% more total damage** than the old version, mostly from the new effect rather than raw numbers. Tune with the DPS readout once that's in.

### 2.5 Passive skills `LIVE` (1795334808-7764)

**Why:** active skills max at Lv 10, so the 5 actives soak up only 45 skill points. Players earn 1 point per level from Lv 10 plus 3 at Graduation and 3 at Thesis (about 47 by Lv 50, 67 by Lv 70), so points were piling up unused.

**The fix:** every course gets **5 class passives** plus **2 shared Electives**, each **max Lv 5**. That's **35 more points** to spend (80 in total per character).
- **No new buttons.** Passives are always on and live in a new **Passives** section of Stats → Skills.
- Each passive unlocks at a level or milestone (locked ones show greyed out with the requirement).
- Freshmen don't earn skill points, so passives start with the Course at Lv 10.

#### Blade line (Blade Cadet → Bell Knight → Grand Bellwarden)

| Unlocks | Passive | Per level (max 5) | At Lv 5 |
|---|---|---|---|
| Lv 10 | **Iron Uniform** | +3% max HP, +2 DEF | +15% HP, +10 DEF |
| Lv 15 | **Bell Rhythm** | +4% damage to stunned enemies | +20% |
| Lv 20 | **Second Wind** | Heal 0.6% max HP per kill | 3% per kill |
| Lv 30 | **Warden's Resolve** | While below 40% HP, take −4% damage | −20% |
| Lv 40 (Thesis) | **Resounding Toll** | Bell Breaker stuns +0.2s, shockwaves +5% size | +1s stun, +25% size |

#### Archer line (Wind Archer → Gale Ranger → Tempest Laureate)

| Unlocks | Passive | Per level (max 5) | At Lv 5 |
|---|---|---|---|
| Lv 10 | **Eagle Eye** | +1.5% crit chance | +7.5% |
| Lv 15 | **Fleet Foot** | +3% move speed | +15% |
| Lv 20 | **Far Shot** | +3% damage to enemies more than ~250 px away | +15% |
| Lv 30 | **Keen Edge** | +6% crit damage | crits ×1.9 instead of ×1.6 |
| Lv 40 (Thesis) | **Tailwind** | Each crit cuts the cooldown of Gale/Cyclone Shot and Arrow Shower/Storm by 0.1s (max twice per second) | 0.5s per crit |

#### Mage line (Spark Mage → Astral Scholar → Star Professor)

| Unlocks | Passive | Per level (max 5) | At Lv 5 |
|---|---|---|---|
| Lv 10 | **Deep Focus** | +4% max SP, +5% SP regen | +20% SP, +25% regen |
| Lv 15 | **Lingering Magic** | Slows, burns and freezes last 10% longer | +50% |
| Lv 20 | **Arcane Ward** | 4% of damage taken is paid from SP instead of HP | 20% |
| Lv 30 | **Overcharge** | +3% damage on skills (not the basic attack) | +15% |
| Lv 40 (Thesis) | **Constellation** | 3% chance per skill cast to refund its SP and cooldown | 15% |

#### Electives (every class, unlock at Lv 25)

| Passive | Per level (max 5) | At Lv 5 |
|---|---|---|
| **Healthy Lunch** | Potions and ethers restore 5% more | +25% |
| **Pet Care** | Your pet's buff is 4% stronger | +20% |

**Respec:** free **Reset stats** and **Reset skills** buttons in Stats (they replaced the old Re-study Scroll). Reset skills refunds passives too.
**Icons (live):** code-drawn badges with the passive's initials in the course colour (gold for Electives) until real icons arrive.
**Balance note for the code chat:** passive values above are design targets; tune with the level curve and DPS readout. Keep any single passive from feeling mandatory.
**Art:** none required. The code can draw simple passive icons; optional real icons are in the Art Asset List.

### 2.6 Lore hooks
- Blade course = the Bell Wardens, who guard the academy bell.
- Archer course = elven wind archers. The Wind Archer is an elf.
- Mage course = Arcana, taught by a "very good boy": the Spark Mage is a puppy.
- The Thesis Defence is the academy's oldest tradition: to become a master, you must face the worst version of yourself. After the Headmaster's Shadow, it hits differently.

---

## 3. World

### 3.0 Region roadmap (final scope: 6 regions, Lv 1–100)

| # | Region | Levels | Big moment | Boss(es) | Status |
|---|---|---|---|---|---|
| 1 | Starbell Academy | 1–20 | Course at Lv 10, Graduation at Lv 20 | Gargoyle of the Old Bell | `LIVE` |
| 2 | Lanternfall | 20–30 | Pets, Moonstone Key | Moonlit Chimera | `LIVE` |
| 3 | **The Forbidden Archive** (beneath the academy) | 30–40 | Thesis at Lv 40 | The Headmaster's Shadow | `LIVE` |
| 4 | **Clocktide Harbor** (sky-port + cloud-sea), two acts | 40–60 | Skyward Dock, airships, descent below the clouds | Brass Colossus (Lv 50, mid) · Tidecaller Kraken (Lv 60) | `PLANNED` |
| 5 | Emberfrost Peaks (mountain trial), two acts | 60–80 | Graduation pilgrimage | mid-boss TBD · Twin Drake (Lv 80) | `IDEA` |
| 6 | Moonpetal Faewild (fairy court), two acts | 80–100 | Story finale, Postgraduate unlocks | mid-boss TBD · Thorn Queen (Lv 100) | `IDEA` |

**Shape from Region 4 on:** each region is **20 levels in two acts**, each act with its own hub town and boss (mid-boss at the act break, final boss at the end), about 18 quests and 4 gear tiers.
**Art:** no size budget any more (GitHub Pages, section 13). Each two-act region is roughly 60–80 pieces of art.

### 3.1 Region 1: Starbell Academy (Lv 1–20) `LIVE`

| Area | Lv | Monsters | Notes |
|---|---|---|---|
| Starbell Courtyard | safe | — | Healing fountain, notice board, Shopkeeper (Academy Shop). Lantern Gate (Lv 20+) at far left |
| Moonpetal Gardens | ~3 | Dew Slime, Page Worm | Starter field |
| Hall of Whispering Books | ~10 | Ink Slime, Quill Bat, Chalk Golem | |
| Old Bell Tower | ~16 | Quill Bat + **Gargoyle of the Old Bell** (Lv 18 boss) | Recommended Lv 15+ |

### 3.2 Region 2: Lanternfall (Lv 20–30) `LIVE`

| Area | Lv | Monsters | Notes |
|---|---|---|---|
| Lanternfall Village | safe | — | Lantern Well (heal), **Marlo the Outfitter** (Lv 25/30 gear, potion packs), **Pip the Pet Keeper** |
| Mistveil Marsh | 22 | Bog Frog, Mist Wisp | |
| Sunken Observatory | 26 | Mist Wisp, Rune Sentinel | |
| Moonlit Dome | 28 | Mist Wisp + **Moonlit Chimera** (Lv 30 boss) | Recommended Lv 28+ |

Travel: walk, Lantern Gate, or World Map (M) fast travel to any visited area.

### 3.3 Region 3: The Forbidden Archive (Lv 30–40) `LIVE`

All Region 3 art in the build is **placeholder**, made by recolouring existing sprites inside the game. The real art list is in the Art Asset List, section 4.

**Concept:** the academy's sealed library, hidden under the Old Bell Tower. Dark, candlelit, full of ink and moving portraits. It answers the question the game has been asking since the start: *why did the practice grounds go wild?*

**Palette:** deep ink blue `#141a3a`, candle gold `#f2c14e`, old-paper cream `#e8d9b4`, cursed violet `#8a4ad6` for the Shadow's magic.

**Getting there**
- When the Moonlit Chimera dies it drops the **Moonstone Key** (one-time story item).
- A new object in the Old Bell Tower, the **Sealed Stair** (a trapdoor with a bell sigil, at x≈5300), opens at **Lv 30 with the Moonstone Key**. It leads down to the Archive.
- The Sealed Stair works in both directions, and all Archive areas join the World Map once visited.

**Areas**

| Area | Lv | Monsters | Notes |
|---|---|---|---|
| **Candlelit Reading Room** | safe | — | Town hub. **Everlit Candelabra** (heals), **Archivist Quillon** (shop), **Prefect Lumen** (story + pet) |
| **Ink Catacombs** | 32 | Blotling, Inkwraith | Low ceilings, ink pools, short platforms |
| **Hall of Living Portraits** | 36 | Portrait Mimic, Cursed Armour, Inkwraith | A long gallery. Some "portraits" on the wall are monsters |
| **The Sealed Vault** | 38 | Inkwraith + **The Headmaster's Shadow** (Lv 40 boss) | Recommended Lv 38+. A round vault with a cracked bell seal on the floor. Also hosts the Thesis Defence |

**NPCs**
- **Archivist Quillon:** a ghostly owl librarian in round spectacles who has shelved books down here for 300 years. Dry, fussy, secretly kind. Sells Tier 7 and 8 gear, a Star Shard ×10 pack and potion/ether packs.
  - *Line:* "Quiet, please. And wipe your boots. The ink is load-bearing."
- **Prefect Lumen:** the ghost of a student prefect who went into the Archive a century ago and never came out. Cheerful, a bit lost, gives the region's story quests and the Little Grimoire pet. She also proposes the Thesis Defence.
  - *Line:* "Oh! A living student! Is the cafeteria still serving starbell pudding?"

### 3.4 Region 4: Clocktide Harbor (Lv 40–60) `PLANNED`

**Concept:** a floating sky-port of airships and brass clockwork moored above a sea of clouds, and the strange world *beneath* those clouds. Act 1 is bright, windy and bustling; Act 2 dives into a glowing, eerie cloud-sea of coral, shipwrecks and a storm that never ends. The Umbral Page has hidden in that storm and woken the Tidecaller Kraken.

**Palette:** Act 1: sky teal `#5ad1c6`, brass `#d9a441`, sail cream `#f3e7c9`. Act 2: deep cloud-sea indigo `#24205a`, coral pink `#ff8a7a`, bioluminescent cyan `#6ff2ff`. Storms: storm navy `#1d2a4a`, lightning yellow `#ffe45c`.

**Getting there**
- After the Headmaster's Shadow is beaten, a **Skyward Dock** appears at the far right of the Starbell Courtyard, with the exchange airship *Starling* moored there (the first "academy-as-home" growth).
- It opens at **Lv 40** once the Shadow is defeated (the Thesis isn't required, but is strongly suggested). Talking to Captain Wren flies you to **Brassbell Wharf**.
- **Act 2** opens at **Lv 50** after the Brass Colossus and the lamp (quests 32–33): Wren takes the *Starling* down through the clouds to **Driftwood Outpost**.
- The airship works both ways between all three hubs; every Harbor area joins the World Map once visited.

#### Act 1: "The Sky-Port" (Lv 40–50)

| Area | Lv | Monsters | Notes |
|---|---|---|---|
| **Brassbell Wharf** | safe | — | Hub on the docks. **Teakettle Boiler** (giant brass kettle, heals with steam), **Captain Wren Halloway** (story, airship), **Ottilie Spanner** (shop: Tier 9–10) |
| **Cogwind Docks** | 42 | Gear Crab, Kite Gull | Wooden piers, cargo, giant gears turning in the background |
| **Cloudsail Rigging** | 46 | Kite Gull, Rusted Automaton, Storm Jelly | **Vertical platforming:** masts, sails and rope bridges stacked high. **Wind gusts** push you sideways |
| **Stormglass Lighthouse** | 48 | Storm Jelly, Rusted Automaton + **Brass Colossus** (Lv 50 mid-boss) | Rain and telegraphed **lightning strikes**. Boss on the lighthouse deck |

#### Act 2: "Beneath the Clouds" (Lv 50–60)

| Area | Lv | Monsters | Notes |
|---|---|---|---|
| **Driftwood Outpost** | safe | — | Second hub, built on a huge wrecked airship hull floating in the cloud-sea. **Shell Spring** (a giant clamshell pool that heals), **Old Barnaby Finch** (shop: Tier 11–12), **Nerissa** (quests, whale calf), Wren and the *Starling* |
| **Undertow Reef** | 52 | Reef Puffer, Siren Eel | Glowing coral in the cloud-sea. **Bubble lifts:** big bubbles drift upward and carry you to higher platforms |
| **Wreckers' Graveyard** | 56 | Ghost Deckhand, Barnacle Golem, Siren Eel | Broken ghost-ships tilted at odd angles. **Fog banks** drift through (code-drawn), hiding monsters until they're close |
| **The Maelstrom Eye** | 58 | Storm Jelly, Siren Eel, Barnacle Golem + **Tidecaller Kraken** (Lv 60 boss) | A storm hole spinning around a calm centre. A **current** pulls you toward the centre; planting the three storm anchors (quest 41) weakens it. Lightning strikes too |

**Region mechanics** (all code-drawn, no extra art)
- **Wind gusts** (Rigging): every ~8 s a gust blows left or right for 2 s; nudges you and your projectiles.
- **Lightning strikes** (Lighthouse, Maelstrom Eye): yellow mark, strike 1 s later; hurts monsters too.
- **Bubble lifts** (Reef): rising bubbles every few seconds; stand on one to ride up, it pops at the top.
- **Fog banks** (Graveyard): slow-drifting fog that dims a stretch of the screen; monsters inside show only glowing eyes until within ~200 px.
- **Maelstrom current** (Eye): constant gentle pull toward the arena centre; strong before the anchors are planted, mild after.

**NPCs**
- **Captain Wren Halloway:** brisk airship captain and Starbell alumna with flight goggles and a long red scarf. Runs the exchange program and the story.
  - *Line:* "Exchange student? Splendid. Hold on to your hat. And your lunch."
- **Ottilie Spanner:** gnome tinkerer with an enormous wrench and a backpack of gears. Act 1 shop: Tier 9–10, Star Shard ×10, potion/ether packs.
  - *Line:* "Everything here is perfectly safe. Mostly. Don't touch the blue lever."
- **Old Barnaby Finch:** the retired Stormglass lighthouse keeper, white beard, oilskin coat, a pipe that blows bubbles instead of smoke. Lives at the Outpost since the storm drove him out. Act 2 shop: Tier 11–12, Star Shard ×10, potion/ether packs.
  - *Line:* "Forty years I kept that lamp lit. Forty! And a squid ruins it in one night."
- **Nerissa:** a young cloud-diver in a brass diving helmet with the visor up, who looks after an orphaned cloud-whale calf. Gives the Act 2 side quests and the Nimbus pet.
  - *Line:* "Shh! Nimbus is sleeping. He's a whale. Sort of. A cloud whale. Don't make it weird."

### 3.5 Regions 5–6 (outline) `IDEA`

Both follow the Region 4 shape: 20 levels, two acts, two hubs, a mid-boss and a final boss, about 18 quests and 4 gear tiers. Full designs get written when we reach them.
- **5. Emberfrost Peaks (Lv 60–80):** a graduation pilgrimage up a mountain with a fire side and an ice side. Act 1 (60–70): Ashfall Slopes and the fire side, mid-boss TBD. Act 2 (70–80): Frostbloom Pass, the ice side and the Summit Shrine. Monsters: cinder imps, snow foxes, crystal golems and more. Final boss: **Twin Drake** (fire and ice phases). Pets: snow fox kit + one more.
- **6. Moonpetal Faewild (Lv 80–100):** a portal in Moonpetal Gardens opens into a giant mushroom fairy court, where you're bug-sized. Act 1 (80–90): Toadstool Market (town), Dewdrop Hollow. Act 2 (90–100): Thornbriar Court. Monsters: beetle knights, mushroom guards, pollen sprites and more. Final boss: **Thorn Queen** at Lv 100. Pets: tiny ladybug + one more. Ends the first story arc back where the game began and unlocks Postgraduate mode.

---

## 4. Story arc

The thread that ties the regions together. Region 1–2 text already in the game stays as is; this adds meaning to it.

- **Backstory:** Starbell's founder, **Headmaster Orrin Starbell**, cut his own ambition and pride out of himself with a forbidden spell, so he could teach without them. That cut-away part became a living **Shadow**. He sealed it in the Archive under the Old Bell, and the bell's ring kept the seal strong.
- **Region 1:** the old bell stopped ringing. Wild magic leaks from the weakened seal, and the practice grounds go wild. The Gargoyle was the bell's last guardian, half-mad from the leaking magic.
- **Region 2:** the Chimera was drawn to Lanternfall by the same magic and swallowed the **Moonstone Key**, the key to the Sealed Stair.
- **Region 3:** you go down into the Archive and learn the truth from Prefect Lumen, who saw the Shadow a century ago. You defeat the Shadow, but its heart, the **Umbral Page**, tears free and escapes into the sky. Lumen then asks you to take the Thesis Defence and face your own shadow, so the same thing never happens to you.
- **Region 4, Act 1:** after the Shadow falls, a Skyward Dock appears at the academy and the exchange airship *Starling* takes you to Clocktide Harbor. The Umbral Page's storm has twisted the Stormglass Lighthouse's storm engine into the **Brass Colossus**. You beat it and relight the lamp, and its beam pierces the clouds to reveal a giant eye far below.
- **Region 4, Act 2:** Wren takes the *Starling* down into the cloud-sea. At Driftwood Outpost you meet Old Barnaby, the lighthouse keeper the storm drove out, and Nerissa, who looks after a cloud-whale calf orphaned by the storms. You plant storm anchors in the Maelstrom Eye and beat the **Tidecaller Kraken**; the Page peels off its forehead and flies east toward the mountains.
- **Region 5 (Lv 60–80):** it flees to the Summit Shrine and splits the mountain's dragon into the Twin Drake.
- **Region 6:** it slips through a fae door in Moonpetal Gardens, the very first area of the game. You beat the Thorn Queen at Lv 100, recover the Page and ring the restored Old Bell. The first story arc ends at home, and the academy names you a **Postgraduate**.

**Academy-as-home idea** `IDEA`: each cleared region adds something back at the Courtyard, so the academy keeps growing. For example, Quillon opens an academy library branch after Region 3, and an airship dock appears after Region 4.

---

## 5. Monsters

Base stats below are **design targets**. The game scales monsters with the code chat's level curve, so live values differ. Known live values are listed where reported.

| Monster | Region | HP | ATK | EXP | Gold | Behaviour |
|---|---|---|---|---|---|---|
| Dew Slime | 1 | 40 | 8 | 12 | 2–6 | Hops |
| Ink Slime | 1 | 40 | 8 | 12 | 2–6 | Hops (purple variant) |
| Page Worm | 1 | 55 | 10 | 16 | 3–7 | Crawls |
| Quill Bat | 1 | 60 | 13 | 24 | 5–10 | Flies |
| Chalk Golem | 1 | 170 | 17 | 52 | 10–20 | Wind-up punch, slam. 16% gear drop |
| **Gargoyle of the Old Bell** | 1 boss | 9,000 | 62 | 1,600 | 250–350 | Leaps, charges, shockwaves, faster below 50% HP |
| Bog Frog | 2 | 1,400 | 115 | 260 | 30–60 | Slime AI, leaps |
| Mist Wisp | 2 | 1,100 | 125 | 280 | 35–65 | Bat AI, flies |
| Rune Sentinel | 2 | 3,600 | 150 | 650 | 60–110 | Golem AI. 16% gear drop |
| **Moonlit Chimera** | 2 boss | 50,000 | 220 | 14,000 | 1,500–2,200 | Boss AI (leap, slam, shockwaves). Drops the Moonstone Key once |
| Blotling `LIVE` | 3 | 4,200 target | 230 | tuned | 90–150 | Slime AI. **Splits into 2 mini-Blotlings** (25% HP each) when killed |
| Inkwraith `LIVE` | 3 | 3,600 target | 245 | tuned | 95–160 | Bat AI. **Fades through platforms** and swoops at you; briefly visible before each swoop |
| Portrait Mimic `LIVE` | 3 | 6,000 target | 280 | tuned | 130–220 | **"Mimic" AI:** sits still looking like a wall portrait; when you come close its eyes flash, then it lunges. 10% gear drop |
| Cursed Armour `LIVE` | 3 | 9,000 target | 300 | tuned | 160–260 | Golem AI with a sword sweep in place of the punch. 16% gear drop |
| **The Headmaster's Shadow** `LIVE` | 3 boss | **~120,000 live** (160,000 target) | 380 target | tuned | 5,000–7,000 | Three phases (below) |
| Gear Crab `PLANNED` | 4 · Act 1 | role: tanky walker | — | — | — | **"Guard" AI:** scuttles toward you; every few seconds raises its brass claws and **blocks frontal hits for 1.5 s** (hit it from behind or wait it out) |
| Kite Gull `PLANNED` | 4 · Act 1 | role: fragile flier | — | — | — | Bat AI. Circles above, then **dive-bombs** in a straight line (telegraphed by a cry and a pause) |
| Rusted Automaton `PLANNED` | 4 · Act 1 | role: heavy | — | — | — | Golem AI. Wind-up punch, and a **steam vent** burst from the ground in front of it. 16% gear drop |
| Storm Jelly `PLANNED` | 4 · both acts | role: slow floater | — | — | — | Floats slowly; every ~4 s pulses an **electric ring** (telegraphed glow). Touching it while charged stings |
| **Brass Colossus** `PLANNED` | 4 · Act 1 boss (Lv 50) | ~1.3× the Shadow on the level curve | — | — | — | Three phases (section 5.3) |
| Reef Puffer `PLANNED` | 4 · Act 2 | role: tanky walker | — | — | — | Waddles toward you; when hit hard (or every ~6 s) it **puffs up**: takes 50% less damage for 2 s, then **bursts spines** in a ring (telegraphed swell). Back off while it's puffed |
| Siren Eel `PLANNED` | 4 · Act 2 | role: fast swimmer | — | — | — | Swims through the air in a wavy line, then lunges. Every ~10 s sings a **lullaby** (visible music notes, 1 s warning): you're slowed 25% for 2 s if within range |
| Ghost Deckhand `PLANNED` | 4 · Act 2 | role: medium melee | — | — | — | Ghostly sailor with a cutlass. Slashes, and throws a **spectral anchor** that drops on a marked spot. On death it **rises again once** at 30% HP unless you hit its floating spirit within 3 s |
| Barnacle Golem `PLANNED` | 4 · Act 2 | role: heavy | — | — | — | Golem AI covered in barnacle armour (+40% DEF). Armour **chunks fall off** at 66% and 33% HP; it gets faster and weaker as it loses them. 16% gear drop |
| **Tidecaller Kraken** `PLANNED` | 4 · Act 2 boss (Lv 60) | ~2× the Brass Colossus on the level curve | — | — | — | Three phases (section 5.4) |
| **Your Shadow** (Thesis Defence) `LIVE` | 3 trial | 25× your max HP | **your ATK × 0.8 × 0.4** (≈32% of your ATK) | — | — | A dark copy of the player using the player's own class skills (pre-Thesis versions). One-time trial. The full ATK × 0.8 killed in 2–3 hits, so it was cut to 40% |

**Region 3 EXP (live):** tuned to about **11 kills per level at Lv 32**, matching the pacing target in section 6.
Zone HP/ATK multipliers (design targets): Academy ×1 / ×3.4 / ×6.5 (Gardens / Hall / Tower). Lanternfall ×1 / ×1.4 / ×1.6 (Marsh / Observatory / Dome). Archive ×1 / ×1.35 / ×1.6 (Catacombs / Portraits / Vault), monster DEF 30 / 38 / 46. Harbor (planned): the code chat's level curve with the roles listed; EXP tuned to ~15–20 kills per level in Act 1 and ~20–25 in Act 2.
**Monster gold (live):** 2 + 1.6×L + 0.05×L² per kill (L = monster level), so late regions pay more.
Regular monsters: ~7% gear drop, ~10% Star Shard drop. Bosses: guaranteed gear + 5 Shards, plus a **daily first-kill chest** (bonus gold, 5 Shards, 3 potions, an item).

**Rule for future regions:** the bible gives the *shape* (relative toughness, behaviour, pacing target); the code chat sets final HP/ATK/EXP from its level curve and reports them back.

### 5.1 The Headmaster's Shadow (Lv 40 boss)
A tall silhouette in a headmaster's robe and mortarboard, made of ink and violet light, with a cracked bell hanging from its chain. It fights with dark copies of the three courses' skills, so every class sees its own moves turned against it.

| Phase | HP | Attacks |
|---|---|---|
| 1 · "Detention" | 100–60% | **Shadow Bell Breaker:** leaps, slams, sends shockwaves both ways. **Ink Charge** across the room |
| 2 · "Pop Quiz" | 60–30% | Adds **Shadow Arrow Shower** (arrows rain down on marked spots) and **summons 2 Portrait Mimics** from the walls |
| 3 · "Final Exam" | below 30% | Adds **Shadow Starfall** (meteors on marked spots) and **teleports** between portrait frames. Moves faster |

- **Every big attack is telegraphed** (a red mark on the floor or a glowing outline first) so the fight is about dodging.
- *Defeat line:* "The Shadow shrieks as the bell seal flares… and a single black page tears free and flies upward."

### 5.3 The Brass Colossus (Lv 50 mid-boss) `PLANNED`
The Stormglass Lighthouse's storm engine, twisted by the Umbral Page's storm into a towering brass giant: piston arms, a furnace belly glowing orange, lightning coils on its shoulders and the dark lighthouse lamp as its head. Fought on the lighthouse deck in the rain.

| Phase | HP | Attacks |
|---|---|---|
| 1 · "Full Steam" | 100–60% | **Piston Punch** (telegraphed wind-up, long reach) and **Steam Vents**: three floor vents light up, then blast steam upward |
| 2 · "Overcharge" | 60–30% | Shoulder coils crackle: adds **lightning strikes** on marked spots and **summons 2 Rusted Automatons** |
| 3 · "Overheat" | below 30% | Vents erupt in a left-to-right sequence you have to time; every ~12 s its **furnace door opens** for 3 s (hits there deal double damage). Moves faster |

- Enrage after **6 min**.
- *Defeat line:* "The Colossus grinds to a halt. The lamp on its shoulders flickers… and with a click, the lighthouse lamp above it blazes back to life."

### 5.4 The Tidecaller Kraken (Lv 60 boss) `PLANNED`
A huge deep-sea kraken with barnacled teal skin, glowing yellow eyes and a black page stuck to its forehead, rising from the calm centre of the Maelstrom Eye. Its **body stays at the right edge of the arena**; the fight is against its **tentacles**, which slam onto the wreck you stand on, plus its head when it lunges.

| Phase | HP | Attacks |
|---|---|---|
| 1 · "Rough Seas" | 100–60% | **Tentacle Slam:** a tentacle rises, a red line marks where it'll land, then it slams down. **Deck Sweep:** a low tentacle sweeps the floor (jump over it). Its head dips low after a sweep: the best time to hit it |
| 2 · "Squall" | 60–30% | Adds **lightning strikes** on marked spots and **summons 2 Storm Jellies** |
| 3 · "Maelstrom" | below 30% | Adds **Whirlpool:** pulls you toward the Kraken for 3 s (walk against it), then a **Tidal Wave** rolls across the deck that you must jump. Moves faster |

- Enrage after **7 min**.
- *Defeat line:* "The Kraken sinks into the cloud-sea with a groan. The black page peels free, catches the storm wind… and flies east, toward the far mountains."

### 5.2 Thesis Defence trial
- Starts from Prefect Lumen; teleports you into the Sealed Vault alone (no other monsters, potions allowed).
- Your Shadow mirrors your class: a Blade copy dashes and slams, an Archer copy keeps distance and fires volleys, a Mage copy drops meteors and slows you. Its attacks are telegraphed like the Headmaster's Shadow's.
- Damage: 40% of (your ATK × 0.8), so it hurts but doesn't two-shot you.
- **Failing costs nothing**: you return to the Reading Room and can retry right away.
- *Lumen's line on success:* "Congratulations, Professor! …Can I call you Professor? I've never met one who wasn't scary."

---

## 6. Progression and formulas `LIVE`

- **Level cap:** `LIVE` a temporary **soft cap at Lv 100** for the beta (a message announces it), so new regions can be tested without hitting a wall. At Lv 100 the EXP bar stops at full and no more levels (or stat/skill points) are gained. **Decided 22 Nov 2026: Lv 100 becomes the final cap** (content now runs to Lv 100). EXP falloff and the map's level colours handle overlevelling.
- **EXP to next level:** 25 × Lv^1.7. All EXP rewards ×1.5.
- **Stat points:** 4 per level (STR / DEX / INT / VIT).
- **Skill points:** 1 per level from Lv 10, +3 at Graduation, +3 more at Thesis. Each active skill level (max 10) gives +8% damage and −3% cooldown. **Sinks:** 45 points for actives + 35 for passives (section 2.5) = 80. Supply: ~67 at Lv 70, 97 at Lv 100 (everything can be maxed around Lv 83; players choose before that).
- **Max HP:** class HP + 14×VIT + 12×Lv + charm HP (×1.1 advanced, × pet bonus, ×1.1 Thesis)
- **Max SP:** class SP + 3×INT + 3×Lv
- **ATK:** (6 + 2.2×Lv + 2.6×main stat + weapon ATK) × (advanced ×1.12, Tolling Guard ×1.3, pet bonus, Thesis ×1.1)
- **DEF:** 0.8×VIT + charm DEF
- **Crit:** 5% + 0.45×DEX (+ pet), cap 60%. Crit hits ×1.6
- **Damage:** ATK × skill multiplier × 0.9–1.1 (× crit) − monster DEF, minimum 1
- **Combo:** +1% damage per 5 hits in a streak, up to +30%
- **Starter boost:** ×1.3 EXP below Lv 20 for new students

**Pacing targets** (casual play, for each balance pass):

| Region | Levels | Target time | Kills per level |
|---|---|---|---|
| 1 Academy | 1–20 | 2–3 h | quick early, ~10 by Lv 15 |
| 2 Lanternfall | 20–30 | 2–3 h | ~10–15 |
| 3 Archive | 30–40 | 3–4 h | ~10–12 at Lv 30–35 (**live: ~11 at Lv 32**), 15–20 at Lv 35–40 |
| 4 Clocktide Harbor | 40–60 | 6–8 h | ~15–20 (Act 1), ~20–25 (Act 2) |
| 5 Emberfrost Peaks | 60–80 | 6–8 h | ~20–25 |
| 6 Faewild | 80–100 | 6–8 h | ~25 |
| **Total to Lv 100** | | **~25–35 h** | |

---

## 7. Items and economy

### 7.1 Gear tiers

Two tiers per 10 levels (four per two-act region), plus one Postgraduate-only tier at Lv 100.

| # | Tier | Colour | Req Lv | Shop price | Weapon ATK | Charm DEF / HP | Where | Status |
|---|---|---|---|---|---|---|---|---|
| 0 | Practice | `#c9c2dc` | 1 | — | 4 | 1 / 15 | Start | `LIVE` |
| 1 | Bronze | `#d98a4a` | 5 | **1,200** `LIVE` | 11 | 3 / 43 | Academy Shop | `LIVE` |
| 2 | Moonsilver | `#bfe9ff` | 10 | **4,000** `LIVE` | 18 | 5 / 71 | Academy Shop | `LIVE` |
| 3 | Starlit | `#ffd23f` | 15 | **9,000** `LIVE` | 25 | 8 / 99 | Academy Shop | `LIVE` |
| 4 | Bellforged | `#c98aff` | 20 | **18,000** `LIVE` | 32 | 10 / 127 | Academy Shop | `LIVE` |
| 5 | Lanternlight | `#ffb070` | 25 | **24,000** | 39 | 12 / 155 | Marlo | `LIVE` |
| 6 | Astral | `#9fe8ff` | 30 | **40,000** | 46 | 14 / 183 | Marlo | `LIVE` |
| 7 | **Inkbound** | `#7f8cff` | 35 | 70,000 | 53 | 16 / 211 | Quillon | `LIVE` |
| 8 | **Sealbreaker** | `#ff6a9a` | 40 | **110,000** `LIVE` | 60 | 19 / 239 | Quillon | `LIVE` |
| 9 | **Tidebrass** | `#d9a441` | 45 | 170,000 | 67 | 21 / 267 | Ottilie (Harbor Act 1) | `PLANNED` |
| 10 | **Stormglass** | `#5ad1c6` | 50 | 260,000 | 74 | 23 / 295 | Ottilie (Harbor Act 1) | `PLANNED` |
| 11 | **Coralsteel** | `#ff8a7a` | 55 | 380,000 | 81 | 25 / 323 | Barnaby (Harbor Act 2) | `PLANNED` |
| 12 | **Leviathan** | `#3a6df0` | 60 | 540,000 | 88 | 27 / 351 | Barnaby (Harbor Act 2) | `PLANNED` |
| 13–16 | Region 5 tiers | TBD | 65 / 70 / 75 / 80 | TBD | 95 / 102 / 109 / 116 | — | Region 5 | `IDEA` |
| 17–20 | Region 6 tiers | TBD | 85 / 90 / 95 / 100 | TBD | 123 / 130 / 137 / 144 | — | Region 6 | `IDEA` |
| 21 | **Summa** | TBD | 100 | not sold | 151 | 47 / 603 | **Postgraduate drops only** | `IDEA` |

ATK follows 4 + 7×tier; charm DEF 1 + 2.2×tier, HP 15 + 28×tier. Prices for tiers 9–15 get set in each region's balance pass. Live prices since 1795338185-2b12: 1,200 / 4,000 / 9,000 / 18,000 / 24,000 / 40,000 / 70,000 / 110,000 (Tiers 5–6 raised by the code chat so price never drops as tier rises). Tiers 9+ must keep rising from 110,000.
Drops roll ±20–25% around these numbers. Weapons are class-specific (Practice Sword / Saber / Longbow / Wand). Charms come as Charm, Brooch or Pendant.
Tiers 1–4 are sold at the Academy Shop, tiers 5–6 only by Marlo in Lanternfall, tiers 7–8 only by Archivist Quillon in the Archive. Archive monsters drop tier 6–7; the Shadow drops tier 8. Harbor: Act 1 monsters drop tier 8–9, the Brass Colossus tier 10; Act 2 monsters drop tier 10–11, the Kraken tier 12.

### 7.2 Upgrading (+1 to +10) `LIVE`
Each level adds +10% to the item's stats. Cost: (150 + 250×tier) × (next level) gold, plus (next level) Star Shards.
Success: 100% to +3, 75% to +6, 55% to +8, 40% to +10. Failing costs only the materials; gear never breaks.

### 7.3 Consumables
Potion (40% HP) 25g · Ether (50% SP) 40g · Star Shard 200g · Potion ×10 230g and Ether ×10 360g (Marlo). Respec is free via the Reset stats / Reset skills buttons (no scroll).
Quillon: **Star Shard ×10** for 1,800g, plus the same potion/ether packs `LIVE`.
Quest item: **Lost Page** (drops only while its quest is active, ~25% from Archive monsters) `LIVE`.

### 7.4 Pets

| Pet | Buff | How to get | Status |
|---|---|---|---|
| Pocket Chick | +4% max HP | Starter gift | `LIVE` |
| Mochi | +12% max HP | Pip, 3,000 | `LIVE` |
| Lantern Moth | +8% ATK | Pip, 5,000 | `LIVE` |
| Star Wisp | +6% crit, +15% gold | Pip, 8,000 | `LIVE` |
| **Little Grimoire** | +10% max SP, −5% skill cooldowns | Reward from Prefect Lumen's "Missing Pages" quest (shows as "Quest reward" in Pip's list) | `LIVE` |
| **Clockwork Sparrow** | +15% Star Shard drop rate, and a 50% bigger pickup range | Reward from Ottilie's "Spare Parts" quest (Harbor Act 1) | `PLANNED` |
| **Nimbus the Cloud-Whale Calf** | Restores 1% max HP every 4 s | Reward from Nerissa's "Lost at Sea" quest (Harbor Act 2) | `PLANNED` |
| Snow Fox Kit | TBD | Region 5 | `IDEA` |
| Tiny Ladybug | TBD | Region 6 | `IDEA` |

All pets fly to drops and pick them up, and level up (+10% buff per level).

### 7.5 Starter help `LIVE`
- Welcome pack: essentials + Pocket Chick.
- Free Lv 10 gear set on choosing a course.

---

## 8. Quest line

| # | Quest | Goal | Key reward | Status |
|---|---|---|---|---|
| 1 | First Lesson | 8 Dew Slimes | 3 potions | `LIVE` |
| 2 | Bookworms | 6 Page Worms | 2 ethers | `LIVE` |
| 3 | Getting Stronger | Reach Lv 5 | Bronze charm | `LIVE` |
| 4 | Course Selection | Lv 10, choose a course | Bronze weapon | `LIVE` |
| 5 | Library Duty | 10 Quill Bats | 5 potions | `LIVE` |
| 6 | Ink Spill | 10 Ink Slimes | 3 ethers | `LIVE` |
| 7 | Chalk Dust | 5 Chalk Golems | Moonsilver weapon | `LIVE` |
| 8 | The Old Bell | Gargoyle | Starlit charm | `LIVE` |
| 9 | Graduation | Reach Lv 20 | Advanced title + Starlit weapon | `LIVE` |
| 10 | Field Trip | Reach Lanternfall | 5 potions | `LIVE` |
| 11 | Bog Hoppers | 15 Bog Frogs | 3 ethers | `LIVE` |
| 12 | A Friend for the Road | Adopt a pet from Pip | 5 potions | `LIVE` |
| 13 | Will-o'-Wisps | 15 Mist Wisps | Lanternlight charm | `LIVE` |
| 14 | Ruin Sentries | 8 Rune Sentinels | Lanternlight weapon | `LIVE` |
| 15 | The Moonlit Chimera | Chimera | Astral charm + **Moonstone Key** | `LIVE` (key `LIVE`) |
| 16 | **Below the Bell** | Reach Lv 30, open the Sealed Stair in the Old Bell Tower | 5 potions, 5 ethers | `LIVE` |
| 17 | **Shhh!** | Talk to Archivist Quillon in the Candlelit Reading Room | 5 Star Shards | `LIVE` |
| 18 | **Spilled Ink** | 20 Blotlings in the Ink Catacombs (minis don't count) | Astral weapon | `LIVE` |
| 19 | **Missing Pages** | Collect 10 Lost Pages for Prefect Lumen | **Little Grimoire** pet | `LIVE` |
| 20 | **Lights Out** | 15 Inkwraiths | Inkbound charm | `LIVE` |
| 21 | **Don't Blink** | 12 Portrait Mimics in the Hall of Living Portraits | 10 Star Shards | `LIVE` |
| 22 | **Hollow Guard** | 8 Cursed Armours | Inkbound weapon | `LIVE` |
| 23 | **The Headmaster's Shadow** | Defeat the Shadow (recommended Lv 38+) | Sealbreaker charm | `LIVE` |
| 24 | **Thesis Defence** | Reach Lv 40, then defeat Your Shadow in the Sealed Vault | **Master title** (all skills upgraded) + Sealbreaker weapon | `LIVE` |
| 25 | **All Aboard** | Defeat the Shadow, reach Lv 40, and board the *Starling* at the Skyward Dock | 10 potions, 10 ethers | `PLANNED` |
| 26 | **Mind the Gears** | Talk to Ottilie Spanner in Brassbell Wharf | 10 Star Shards | `PLANNED` |
| 27 | **Pinch Points** | 20 Gear Crabs in Cogwind Docks | Sealbreaker charm | `PLANNED` |
| 28 | **Gull-ible** | 20 Kite Gulls | 10 potions, 5 ethers | `PLANNED` |
| 29 | **Spare Parts** | Collect 12 Brass Cogs for Ottilie (quest-only drop, ~25% from Act 1 monsters) | **Clockwork Sparrow** pet | `PLANNED` |
| 30 | **Rust Bucket** | 10 Rusted Automatons in Cloudsail Rigging | Tidebrass weapon | `PLANNED` |
| 31 | **Shock Value** | 15 Storm Jellies | Tidebrass charm | `PLANNED` |
| 32 | **Engine Trouble** | Defeat the Brass Colossus on the lighthouse deck (recommended Lv 48+) | Stormglass weapon | `PLANNED` |
| 33 | **Light the Lamp** | Relight the Stormglass lamp (interact object at the top of the lighthouse) | 15 Star Shards | `PLANNED` |
| 34 | **Going Down** | Reach Lv 50 and ride the *Starling* down to Driftwood Outpost | 10 potions, 10 ethers | `PLANNED` |
| 35 | **Old Salt** | Talk to Old Barnaby Finch at Driftwood Outpost | 10 Star Shards | `PLANNED` |
| 36 | **Puffed Up** | 25 Reef Puffers in Undertow Reef | Stormglass charm | `PLANNED` |
| 37 | **Eel Be Back** | 20 Siren Eels | 15 potions, 10 ethers | `PLANNED` |
| 38 | **Lost at Sea** | Collect 12 Cloud Pearls for Nerissa (quest-only drop, ~25% from Act 2 monsters) | **Nimbus** pet | `PLANNED` |
| 39 | **All Hands Lost** | 20 Ghost Deckhands in the Wreckers' Graveyard (risen-again ones count once) | Coralsteel weapon | `PLANNED` |
| 40 | **Scrape the Hull** | 10 Barnacle Golems | Coralsteel charm | `PLANNED` |
| 41 | **Drop Anchor** | Plant the 3 storm anchors in the Maelstrom Eye (interact objects; weakens the current) | 20 Star Shards | `PLANNED` |
| 42 | **The Tidecaller** | Defeat the Tidecaller Kraken (recommended Lv 58+) | Leviathan charm | `PLANNED` |
| 43+ | Regions 5–6 quest lines | Written when each region is designed | | `IDEA` |
| Final | **Ring the Bell** | Beat the Thorn Queen and ring the restored Old Bell | **Postgraduate** status (section 12) | `IDEA` |
| ∞ | Extra Credit | 40 monsters anywhere (repeatable) | 300 gold × your level, 10 potions, 5 ethers | `LIVE` |

All quests also give EXP and gold. Extra Credit stays last and repeatable.

**Story beats in Region 4 quests:**
- Quest 25 (boarding scene): Wren: "Professor Lumen's letter said you'd come. A ghost writing letters! Starbell never changes."
- Quest 29: Ottilie explains the Brass Cogs come from the lighthouse's storm engine, "which has started walking around, by the way."
- Quest 32 (Colossus defeated): the lamp on its shoulders flickers and the lighthouse lamp blazes back to life (defeat line).
- Quest 33: the relit beam pierces the clouds and shows a giant yellow eye far below. Wren: "That's no seagull. We're going down there."
- Quest 35: Barnaby: "Forty years I kept that lamp lit. Forty! And a squid ruins it in one night." He tells you the storm started the night "a black page fell out of the sky."
- Quest 38: Nimbus's mother was swept away by the Kraken's storms; Nerissa asks you to look after him "until the sky's safe."
- Quest 41: with all three anchors planted, the current calms and the Kraken surfaces.
- Quest 42 hand-in: Wren offers to fly you east "whenever you're ready for mountains" (Region 5 hook). Barnaby decides to go home and keep the lamp again.

**Story beats in Region 3 quests** (shown in the quest text or as Lumen/Quillon lines):
- Quest 16: "Under the old bell, a stair you've never noticed. The Moonstone Key fits perfectly."
- Quest 19: Lumen explains the pages are torn from Headmaster Starbell's diary, and they tell the backstory in pieces.
- Quest 23 hand-in: Lumen explains the Thesis Defence, Starbell's oldest tradition.
- Quest 24 hand-in: Lumen can finally rest, and leaves the player her prefect badge (cosmetic, `IDEA`).

---

## 9. Systems in the live game `LIVE`

World map and fast travel · auto-potion and auto-ether thresholds · autosave every 3s · 3 save slots plus save codes · loot filter · damage-number and overlay toggles · sound effects and music with mute · combo counter · daily boss chests · pet levels · skill points · gear upgrading.

**Added in 1795330818-e31a:**
- **Boss Rush** (Normal / Hard / Nightmare): waves ending in Gargoyle + Chimera together ("Final Exam"), timer, best times, pre-upgraded top-tier reward (+2 Hard, +4 Nightmare), double gold on first daily clear, no EXP loss on failure.
- Data-driven regions · level-curve balance pass · boss attack telegraphs · hit-stop.
- **Elite (~9%) and shiny (~1%) monsters** · frog leaps, wisp dives · ~40% denser, faster spawns.
- Stat buttons +1 / +5 / All · ✕ close and tap-outside close · 100-slot bag · better-gear popup · charms add ATK · cooldowns halved, SP regen +50%.

**Added in 1795331292-7025:** ✕ close button stays pinned while scrolling.

**Added in 1795346941-d0b7:** DPS readout in Stats (estimated basic DPS + real DPS over the last 10 s; crit multiplier shown) · Bag filters (All / Weapons / Charms / Usable / Upgrades ▲) and sort (Newest / Tier / Power), green ▲ on upgrades · tap-to-compare gear (before → after) · quest tracker arrow with distance and target marker (toggle in Settings) · **Boss Rush now 6 waves**: wave 5 is the Headmaster's Shadow at 60% HP, teleporting between three arena spots.

---

## 10. Code chat work

### 10.0 Earlier suggestions `LIVE`
DPS readout, bag sorting/filters, gear comparison, quest arrow, oversized-sheet downscaling and the Boss Rush Shadow wave are all live (d0b7, 3c5c).

### 10.1 Region 3: The Forbidden Archive `LIVE` (1795333391-6ce8)
Shipped with in-game recoloured placeholder art (page was ~4.1 MB; 3.42 MB after 14.5).
- Moonstone Key drop (once; old saves that beat the Chimera get it automatically); Sealed Stair at x≈5300, Lv 30 + key, works both ways; Archive areas join the World Map.
- Reading Room with Everlit Candelabra, Quillon (Tier 7–8, Shard ×10 1,800g, potion/ether ×10; talking plays his line), Lumen (story lines, starts the Thesis).
- Blotling split (minis don't count for quests) · Inkwraith translucent, turns solid before each dive · Portrait Mimic sits in a gold frame with no contact damage, red eyes flash then lunges (hitting it also wakes it), then fights like a golem · Cursed Armour wider telegraphed sweep.
- Headmaster's Shadow: phase 1 leap-slam + charge; phase 2 (<60%) 2 Mimics + arrow rain on red marks; phase 3 (<30%) meteors on marks + teleport between three portrait frames. ~120k HP from the level curve.
- Quests 16–24 with collect, talk and Thesis quest types; saves on Extra Credit continue into quest 16. EXP tuned to ~11 kills per level at Lv 32.
- Lazy-loading dropped: the game must stay a single file (section 13).

### 10.2 Lv 40 Thesis `LIVE` (1795333391-6ce8)
- Talk to Lumen at Lv 40 on quest 24 → solo Thesis Defence in a copy of the Sealed Vault.
- Your Shadow: your sprite tinted dark, 25× your max HP, class-mirrored AI (Blade: telegraphed slash + dash; Archer: keeps distance, arrows + arrow rain; Mage: keeps distance, orbs + slowing frost meteors). Basic hits at ATK × 0.8 × 0.4; telegraphed skills hit harder. "Try again" on failure, no penalty.
- On passing: `P.thesis`, master title, ×1.1 ATK, ×1.1 max HP, tripled course bonus, +3 skill points, gold skill buttons, gold HUD trim, gold-tinted outfit, Sealbreaker weapon.
- All 15 upgraded skills as in section 2.4. Upgraded effects reuse existing effect art for now.
- No level cap existed, so nothing needed raising.

### 10.4 Passives and beta level cap `LIVE` (1795334808-7764)
- Lv 100 soft cap: levelling stops, EXP bar stays full, no points past 100 (a Lv 100 Thesis character has 97 skill points).
- `P.pas` passive levels; Passives section in Stats → Skills sharing the skill-point pool; locked passives greyed with "Unlocks at Lv N" / "Unlocks after the Thesis"; each row shows current and next-level effect. Freshmen see none.
- All 17 passives wired as in 2.5 (Keen Edge = +0.06 crit multiplier per level; Tailwind applies to skills 2 and 3).
- Reset skills refunds passives; old saves get `P.pas` on load.
- Code-drawn passive badges.

### 10.3 What the endgame needs from the code (build after Region 6)
Not to be built yet; listed so earlier work doesn't block it.
1. A `P.postgrad` flag set by the final quest. Final level cap is Lv 100 (already the soft cap).
2. **Postgraduate toggle per region** on the World Map: scales monsters to Lv 100, swaps the drop table to tiers 20–21, more Star Shards.
3. **Boss Rush expansion** to every boss (including mid-bosses), plus Nightmare best-time tracking.
4. **Boss Relics:** a rare drop type (section 12.3) with unique perks.
5. **Weekly Exam** with rotating modifiers, reset by the device's date.
6. **Monster Log**, titles, and Tenure points (section 12.5–12.6).
7. **Friend leaderboards** with no server: a short "result code" players can paste to compare Boss Rush times.

---

## 11. Open design decisions

- [x] **Region 3:** The Forbidden Archive, Lv 30–40 (decided 22 Nov 2026).
- [x] **Region order:** Archive → Clocktide Harbor → Emberfrost Peaks → Moonpetal Faewild.
- [x] **Third advancement at Lv 40:** yes, the Thesis. Titles: Grand Bellwarden, Tempest Laureate, Star Professor (decided 22 Nov 2026).
- [x] **Final scope:** 6 regions, Lv 1–100, Postgraduate endgame at Lv 100 (updated 22 Nov 2026; was Lv 70).
- [x] **Passive skills:** 5 per course + 2 Electives, max Lv 5 each (decided 22 Nov 2026).
- [x] **Beta level cap:** soft cap at Lv 100 for testing (decided 22 Nov 2026).
- [x] **Pre-Region 4 polish plan:** feedback loop, economy/overlevelling pass, story delivery, elite affixes/Monster Log/achievements/enrage, file-size cleanup (section 14, decided 22 Nov 2026).
- [x] **Tier prices:** Bronze 1,200 · Moonsilver 4,000 · Starlit 9,000 · Bellforged 18,000 · Lanternlight 24,000 · Astral 40,000 · Inkbound 70,000 · Sealbreaker 110,000 (live in 2b12).
- [x] **Size budget:** no longer applies after the GitHub Pages move (section 13).
- [x] **Player experience pass:** student name + HUD, look options, tutorial hints, attendance card, mobile control settings (section 18; music deferred) (decided 22 Nov 2026).
- [x] **Hosting:** move to GitHub Pages, repo marijo1012/starbell-academy (section 19, decided 22 Nov 2026).
- [x] **Longer regions:** Regions 4–6 are 20 levels each in two acts (40–60, 60–80, 80–100) (decided 22 Nov 2026).
- [x] **Final level cap:** Lv 100; endgame moves to Lv 100 (decided 22 Nov 2026).
- [x] **Region 4 (two acts):** Clocktide Harbor Lv 40–60 with the Brass Colossus mid-boss and the Kraken final boss (decided 22 Nov 2026).
- [ ] **Skill points at Lv 83–100:** with the cap at 100, players have ~17 spare points after maxing everything. Add a few Region 5–6 passives (or raise Electives to max Lv 10) when those regions are designed.
- [ ] **Regions 5–6 details:** acts, mid-bosses, monsters, quests, pets, tier names and prices.
- [ ] **Fourth advancement?** Only if Lv 40–100 feels empty in playtests.
- [ ] **Names still needed:** current Principal (in-game today), faculty for each course, a rival student.
- [ ] **Sharing:** stays free for friends? Result-code leaderboard enough, or a real online one later?

---

## 12. Endgame: Postgraduate mode (Lv 100) `PLANNED` (build after Region 6)

### 12.1 Unlock
Beat the Thorn Queen and complete **Ring the Bell**. The Principal names you a **Postgraduate** in front of the whole academy (a short Courtyard scene). From then on a **Postgraduate** tab appears in the World Map.

### 12.2 The loop

| Activity | What it is | Main reward |
|---|---|---|
| **Boss Rush (full)** | Every boss back to back: Gargoyle, Chimera, Headmaster's Shadow, Brass Colossus, Kraken, the Region 5–6 bosses. Normal / Hard / Nightmare | Pre-upgraded Tier 21 gear, best times, titles |
| **Postgraduate regions** | Replay any region with monsters scaled to Lv 100 | Tier 20–21 drops, lots of Star Shards, Boss Relics |
| **Daily boss chests** | Already live; extended to Postgraduate bosses | Gold, Shards, potions |
| **Weekly Exam** | One run per week with a rotating rule, e.g. "No potions", "Monsters move 50% faster", "Skills only, no basic attack", "One hit = 20% HP" | Big chest + a Weekly Exam stamp (counts toward titles) |
| **Collections** | Monster Log, max-level pets, titles | Cosmetic titles, small permanent bonuses |

### 12.3 Boss Relics
A rare (~2%) drop from each **Postgraduate** boss. A Relic is a charm with a unique perk on top of normal charm stats.

| Relic | From | Perk |
|---|---|---|
| Bell Shard | Gargoyle | Your stuns last 50% longer |
| Moonstone Fang | Chimera | +10% damage to bosses |
| Umbral Quill | Headmaster's Shadow | −10% skill cooldowns |
| Lighthouse Cog | Brass Colossus | +10% damage while above 80% HP |
| Kraken's Pearl | Tidecaller Kraken | Heal 1% max HP per kill |
| Twinflame Scale | Twin Drake | Basic attacks have a 10% chance to burn |
| Thorncrown Seed | Thorn Queen | +15% gold and Star Shard drops |

### 12.4 Gear chase
Tier 21 **Summa** only drops in Postgraduate content. Combined with +10 upgrades and Relics, a fully geared character is a long-term goal.

### 12.5 Collections and titles
- **Monster Log:** kill counts for every monster, with milestone rewards at 100 / 500 / 1,000 kills.
- **Titles** shown under your name:
  - *Honour Roll*: clear every Postgraduate region
  - *Pet Whisperer*: every pet at max level
  - *Speed Reader*: Boss Rush Normal under a target time
  - *Summa Cum Laude*: a full Tier 21 +10 set
  - **Valedictorian**: clear Boss Rush on Nightmare (the top title)

### 12.6 Tenure points `IDEA`
The final cap is Lv 100 (decided 22 Nov 2026). EXP earned at Lv 100 keeps filling the bar; each full bar gives **1 Tenure point** (1 stat point), up to 30. 

### 12.7 Design guardrails
- No energy, stamina or pay walls. Everything stays playable for free with friends.
- Every endgame activity reuses existing regions and bosses, so the endgame needs very little new art: mostly icons for Relics and titles.
- If people finish everything, the next step is a **second story arc** (new regions 7+), not more grind.

---

## 13. Technical constraints (from the code chat)

- **Hosting (live since 22 Nov 2026):** GitHub Pages, repo marijo1012/starbell-academy. `index.html` + boot loader, game code in `js/game.js`, art as separate files in `art/<group>/<key>.webp` with `manifest.json`.
- **Loading:** `core` art loads at start; each region's art loads when you travel there (loading bar), and neighbouring regions prefetch in the background. Recoloured placeholders stand in if a file fails.
- **No size budget any more.** Per-file guidance: sprites ~2–3× in-game size, backgrounds up to ~3,000 px wide, WebP q75–85. Tell the code chat which group (region) each new art key belongs to.
- **Placeholders are made in-game** by recolouring existing sprites until real art arrives.
- **Tools in the repo:** `tools/add_art.py` (add or replace one art key) and `tools/stamp.py` (new build id so browsers fetch fresh code).
- **Saves** are per website: players moving from the old artifact link export a save code there and import it on the title screen.
- **Balance numbers live in code.** The code chat's level curve sets final HP/ATK/EXP. The bible keeps design targets and records live values when reported.
- **Level cap:** Lv 100 (final).
- *History:* until 22 Nov 2026 the game was a single-file artifact with a 16 MB hard limit (peak ~6.2 MB); sections 14.5 and 16.1 come from that period.

## 14. Pre-Region 4 polish plan `LIVE` (1795335752-3c5c)

14.1–14.5 shipped with no new art. 14.6 (Region 4 design) is design-chat work and still to do. Live details are noted under each part.

Art is the bottleneck, so before Region 4 the code chat polishes what's already there using **no new art**, while the design chat writes Region 4 so art production never idles.
**Build order:** 14.1 + 14.2 first (cheap, fix real problems) → 14.3 → 14.4 + 14.5. Region 4 design (14.6) runs in parallel.

### 14.1 Playtest feedback loop `LIVE`
**Live:** Settings → **Playtest report** shows a one-line code with a Copy button plus the beta checklist. Format starts `SBR1 | v=… | class=… | lv=… | area=… | play=…m | deaths=…` and includes gold, weapon/charm tier+upgrade, pet, skill points (active/passive/free), free stat points, quest, Boss Rush times, elite/shiny kills, Thesis and achievements. New save stats: play time, deaths, elite kills, shiny kills.

**Report button** (in the Bag or Settings): copies a short text code to the clipboard that testers paste to Mario, who pastes it to the design chat.
- Contents: game version · class / title · level · current area · play time · deaths · gold · equipped gear (tier + upgrade) · pet + level · skill and passive points spent / free · quest number · Boss Rush best times · elite and shiny kills.
- Format: readable one-liner or a short base64 code; the design chat can decode either.

**Beta checklist** for testers:
1. Start a new Freshman and note how long Lv 10, 20, 30 and 40 take.
2. Try all three courses to at least Lv 20; note which feels weakest.
3. Beat each boss; note deaths and how long the fight took.
4. Try Boss Rush Normal and Hard.
5. Report any spot where you had nothing useful to spend gold, stat or skill points on.
6. Send a Report code at Lv 20, 30, 40 and whenever something feels off.

### 14.2 Economy and overlevelling pass `LIVE`
**Live:** Extra Credit = 300 × level gold, 10 potions, 5 ethers · EXP falloff exactly as below (bosses exempt) · World Map level chips: grey "too low for you" (8+ above), green "good for you", red "dangerous" (5+ below) · new gold curve 2 + 1.6L + 0.05L².

**Gold check result (code chat estimate, ~15 kills/min, monster gold only):**
| Tier | Price | Region monster Lv | Time to afford |
|---|---|---|---|
| 1–4 | 250–6,000 | 3–16 | 2–5 min (too fast) |
| 5 Lanternlight | 14,000 | 22 | ~17 min |
| 6 Astral | 32,000 | 26 | ~30 min |
| 7 Inkbound | 70,000 | 32 | ~40 min |
| 8 Sealbreaker | 150,000 | 36–38 | ~65 min (too slow) |

**Decided (22 Nov 2026), build in 15.1:** Bronze 1,200 · Moonsilver 4,000 · Starlit 9,000 · Bellforged 18,000 (Academy tiers ~10–20 min each), keep Tiers 5–7, and trim Sealbreaker to 110,000 (~45 min). Quests, boss chests and selling drops make all of these faster in practice.

**Original plan:**
- **Extra Credit reward:** 50,000 gold flat is too much (three runs buy a Tier 8 weapon). Change to **gold = 300 × player level** (Lv 20 → 6,000 · Lv 40 → 12,000), keep potions/ethers but scale down to 10 / 5. Target: one Extra Credit ≈ 10% of the current tier's shop price.
- **EXP falloff:** when you out-level a monster by 8 or more, its EXP drops: ×(1 − 0.15 × (gap − 7)), minimum ×0.1. At a gap of 10 that's ×0.55; at 13+ it's ×0.1. Bosses exempt.
- **Gold check:** with the level-curve gold and denser spawns, sanity-check that tier prices still take roughly 20–40 minutes of farming in that region.
- **World Map:** show each area's recommended level, coloured by your level (grey = too low to matter, green = right, red = dangerous).

### 14.3 Make the story visible `LIVE`
**Live:** dialogue box with NPC portrait, name tag, tap/Space/Enter/F to advance, Skip, and choice buttons (Lumen's Begin / Not yet); pauses the game. All 8 scenes play once each (first-login scene for new characters only). Quillon and Lumen talks use the box; hand-in dialogues for quests 16, 19, 23, 24 (prefect badge is mentioned but not implemented). Bag → **Diary** shows Lost Pages as they're found; saves past Missing Pages get all 10.

**Dialogue box:** a parchment panel at the bottom with the NPC's sprite as a portrait (scaled from existing art), name tag, tap/click to advance, **Skip** button. Used for NPC talks and quest hand-ins instead of one-line messages.

**Scenes** (short, skippable, dialogue + camera only):
| When | Who | Gist |
|---|---|---|
| First login | Principal (text only for now) | Welcome; the practice grounds have gone wild |
| Gargoyle defeated | narration | The bell cracks but doesn't ring |
| Moonstone Key drops | narration | A key glows with the bell's sigil |
| Sealed Stair opens | narration | A stair under the old bell |
| Meeting Quillon / Lumen | NPCs | Their intro lines (section 3.3) |
| Shadow defeated | narration + Lumen | The Umbral Page escapes; Lumen explains the Thesis |
| Thesis passed | Lumen | "Congratulations, Professor!" |

**Lost Pages diary:** collected pages appear as a readable diary in the Bag. Text (Headmaster Orrin Starbell's diary):
1. "Day one as Headmaster. The bell rang true this morning. Starbell will teach every child who knocks."
2. "The board wants trophies. I want students. Lately I'm not sure which part of me is speaking."
3. "Found an old spell in the Restricted Section: *to cut away what you would not be.* Quillon disapproves. Quillon disapproves of everything."
4. "My ambition whispers at every faculty meeting. I am so tired of it."
5. "It is done. I feel lighter. Kinder. The thing that came out of me stood up and smiled with my face."
6. "It wants the academy. It wants the bell. It wants to be Headmaster."
7. "Sealed it beneath the tower. As long as the bell rings each dawn, the seal holds."
8. "A prefect wandered too close to the vault today. She will not leave. I've asked Quillon to keep her company."
9. "If you are reading this, the bell has gone quiet. I'm sorry. I left you my worst homework."
10. "Don't face it alone, and don't face it unready. Face your own shadow first. Then ring the bell, student."

### 14.4 Depth from existing art `LIVE`
**Live differences:** Hasty also makes contact hits faster; Vampiric heals from contact damage; Splitting copies have 30% HP; Thorny never kills you. Monster Log in Bag or Map; milestone gold = 50 / 200 / 500 × monster level, Shards 3 / 10 / 25, +1% damage to that monster each. Achievements in Map; each gives 1,000 gold + 2 Shards and a wearable title shown as «Title» above the character. Honour Student = each of the three bosses beaten at least once without fainting in that fight. Boss bar shows "enrage in m:ss" then "ENRAGED".

**Elite affixes:** each elite (~9%) rolls one trait, shown as a coloured tag above its name. Shinies get two.
| Affix | Effect | Tint/tag |
|---|---|---|
| Shielded | Blocks the first 20% of its HP as a shield bubble | blue |
| Hasty | +40% move and attack speed | yellow |
| Vampiric | Heals 15% of the damage it deals | red |
| Splitting | Splits into 2 half-size copies on death | purple |
| Thorny | Reflects 5% of damage taken back to you | green |
| Frenzied | Below 50% HP: +30% ATK | orange |

**Monster Log** (pulled forward from the endgame): every monster's kill count, with rewards at 100 / 500 / 1,000 kills (gold, Star Shards, and +1% damage to that monster type per milestone). Reachable from the Map or Bag.

**Achievements** (titles shown under your name; small one-time rewards):
First Lesson Learned (finish quest 1) · Course Declared (pick a course) · Bell Ringer (beat the Gargoyle) · Moonstruck (beat the Chimera) · Below the Bell (enter the Archive) · Defended (pass the Thesis) · Shiny Hunter (kill 10 shinies) · Elite Slayer (kill 100 elites) · Fully Upgraded (any +10 item) · Pet Lover (any pet at max level) · Exam Season (clear Boss Rush Hard) · Honour Student (all three bosses without dying).

**Boss enrage timers:** if a fight runs long, the boss speeds up (+30% speed and ATK) with a red aura and a warning line.
| Boss | Enrage after |
|---|---|
| Gargoyle | 3 min |
| Chimera | 4 min |
| Headmaster's Shadow | 6 min |
Boss Rush uses the same timers per wave.

### 14.5 Free up file size `LIVE`
**Live:** 4.13 MB → **3.42 MB**. Downscaled Bog Frog (×0.6), Mist Wisp (×0.5), all four pets, Marsh platform and 8 oversized icons (max 96 px); per-sheet scale keeps on-screen size the same. All art re-encoded lighter.

Ask the code chat to downscale oversized embedded sheets to about 2× their in-game size (Bog Frog ~515 px frames, Mist Wisp ~380 px, and any others it finds), re-encode as WebP, and report the new page size. Goal: claw back space before Region 4 art arrives (budget: ~8 MB at Region 6, section 13).

### 14.6 In parallel: design Region 4 (Clocktide Harbor) `PLANNED` (design chat, not started)
The design chat writes Region 4 to the same level as the Archive (areas, monsters, NPCs, quests, gear, pet, boss, art list with Gemini prompts), so Mario can start drawing Harbor art while the code chat does 14.1–14.5.

### 14.7 Code checklist `LIVE` (all 5 done)
1. Report button + code format (14.1)
2. Extra Credit scaling, EXP falloff, gold check, map level colours (14.2)
3. Dialogue box, scenes, Lost Pages diary (14.3)
4. Elite affixes, Monster Log, achievements/titles, boss enrage (14.4)
5. Downscale oversized sheets and report the page size (14.5)

## 15. Tier price rebalance `LIVE` (1795338185-2b12)

| Tier | Old | Live |
|---|---|---|
| 1 Bronze | 250 | 1,200 |
| 2 Moonsilver | 900 | 4,000 |
| 3 Starlit | 2,500 | 9,000 |
| 4 Bellforged | 6,000 | 18,000 |
| 5 Lanternlight | 14,000 | **24,000** (code chat: keeps prices rising) |
| 6 Astral | 32,000 | **40,000** (code chat: keeps prices rising) |
| 7 Inkbound | 70,000 | 70,000 |
| 8 Sealbreaker | 150,000 | 110,000 |

Still worth a follow-up: time-to-afford per tier at the new prices (the release didn't report it), and whether selling gear became a gold farm.

## 16. Next steps (after d0b7) `PLANNED`

### 16.1 Page weight recovery `OPTIONAL`
Not needed now (decision 22 Nov 2026): phones load ~6 MB fine. Only run a shrink pass if the file passes the **14 MB warning line** (section 13). Method when needed: downscale sheets to ~2× in-game size with the per-sheet scale trick, cap far backgrounds at ~1,800 px wide, re-encode at q60, remove unused frames, report the largest 15 items.

### 16.2 Small art fixes
- **Principal portrait:** re-roll (the last sheet had a strip over his face). Needed for the first-login scene.
- **fx_bolt** (sliced but unused): assign to **Starspark**'s chain between enemies, which is what it was meant for.
- **Lumen:** bust works as a ghost; full-body sprite optional.

### 16.3 Beta round before Region 4
Everything in Regions 1–3 now has real art and the feedback tools are live, so this is the moment for a real playtest:
- Send the game to testers with the beta checklist (14.1); ask for Report codes at Lv 20, 30 and 40.
- Paste codes into the design chat; review pacing, deaths, gold and point spending; then do one balance pass before Region 4.

### 16.4 Region 4 design (design chat) `DONE`
Written in full as a two-act region (Lv 40–60): section 3.4, 5, 5.3–5.4, 7, 8 (quests 25–42) and the build list in section 17. Art list in the Art Asset List, section 4b.

## 17. Region 4 build list `PLANNED`

Two-act region, Lv 40–60. Build Act 1 and Act 2 as two releases if that's easier (Act 1 first). Use recoloured placeholders until Mario's art arrives (Art Asset List section 4b). New art goes in a `harbor` group (or `harbor1` / `harbor2` if the code chat prefers splitting by act).

**Act 1 (Lv 40–50)**
1. **Skyward Dock** in the Courtyard (appears after the Shadow is defeated; opens at Lv 40) and *Starling* airship travel; Harbor areas on the World Map.
2. **Brassbell Wharf:** Teakettle Boiler (heal), Captain Wren (dialogue + story), Ottilie (dialogue, then shop: Tier 9–10, Shard ×10, potion/ether packs).
3. **Fields:** Cogwind Docks (Lv 42), Cloudsail Rigging (Lv 46, tall vertical layout), Stormglass Lighthouse (Lv 48).
4. **Mechanics:** wind gusts (Rigging); telegraphed lightning strikes (Lighthouse).
5. **Monsters:** Gear Crab (frontal block), Kite Gull (dive-bomb), Rusted Automaton (steam vent), Storm Jelly (electric pulse).
6. **Brass Colossus** (Lv 50 mid-boss, section 5.3): piston punch, steam vents, phase 2 lightning + 2 Automatons, phase 3 vent sequence + furnace weak point, 6 min enrage, defeat scene that relights the lamp.
7. **Quests 25–33** (collect: Brass Cogs; talk: Ottilie; interact: lighthouse lamp; boss). Scenes: boarding, arrival, Colossus defeated, lamp beam reveals the eye.
8. **Gear:** Tier 9 Tidebrass (Lv 45, 170,000g), Tier 10 Stormglass (Lv 50, 260,000g). **Pet:** Clockwork Sparrow.

**Act 2 (Lv 50–60)**
9. *Starling* route down to **Driftwood Outpost** (after quest 33, Lv 50): Shell Spring (heal), Old Barnaby (shop: Tier 11–12, Shard ×10, packs), Nerissa (quests, pet), Wren.
10. **Fields:** Undertow Reef (Lv 52), Wreckers' Graveyard (Lv 56), the Maelstrom Eye (Lv 58).
11. **Mechanics:** bubble lifts (Reef), fog banks (Graveyard), Maelstrom current toward the centre, weakened by the 3 storm anchors (quest 41); lightning strikes in the Eye.
12. **Monsters:** Reef Puffer (puff-up + spine burst), Siren Eel (wavy swim, lunge, lullaby slow), Ghost Deckhand (anchor throw, rises once unless its spirit is hit), Barnacle Golem (armour chunks fall off at 66% / 33%).
13. **Tidecaller Kraken** (Lv 60, section 5.4): tentacle slam / sweep, head-dip window, phase 2 lightning + 2 Storm Jellies, phase 3 whirlpool + jumpable tidal wave, 7 min enrage, defeat scene.
14. **Quests 34–42** (collect: Cloud Pearls; talk: Barnaby; interact: 3 storm anchors; boss). Scenes: descent through the clouds, meeting Nerissa and Nimbus, anchors planted, Kraken defeated.
15. **Gear:** Tier 11 Coralsteel (Lv 55, 380,000g), Tier 12 Leviathan (Lv 60, 540,000g). **Pet:** Nimbus (1% max HP every 4 s).

**Both acts**
16. Drops: Act 1 monsters tier 8–9, Colossus tier 10; Act 2 monsters tier 10–11, Kraken tier 12.
17. EXP ~15–20 kills per level (Act 1), ~20–25 (Act 2).
18. Boss Rush: add the Brass Colossus and the Kraken as waves before the Final Exam.
19. Quest arrow, Monster Log, Report code updated; new achievements: **"Full Steam"** (beat the Colossus), **"Sea Legs"** (beat the Kraken), **"Whale Whisperer"** (Nimbus at max level).
20. Report the new art groups and sizes in the release notes.

## 18. Player experience pass `PLANNED`

No new art needed. **Build order (decided 22 Nov 2026):** 18.1 + 18.2 together (they share the ID card screen) → 18.3 → 18.4 → 18.5. Music/SFX with PixelLab is deferred (18.6).

### 18.1 Student name and HUD
**Naming on enrolment**
- Right after **Enroll**, a parchment **Student ID card** pops up: "Name your student".
- Rules: 2–12 characters; letters, numbers and single spaces; trimmed; no blank names. A 🎲 button suggests a random academy-style name (e.g. "Pip Ashwick", "Mira Quill", "Tobin Starling", "Juno Brightbell": a short first-name list × surname list).
- **Old saves:** on first load after the update, the ID card appears once so existing players can name their student (default suggestion pre-filled).
- Saved as `P.name`.

**HUD (top left)**
```
Mira Quill                 ← name, largest text
Grand Bellwarden · Lv 47   ← class/title + level (gold trim after Thesis)
[HP bar]
[SP bar]
[EXP bar]
```
- **Nameplate:** the name floats above the character in small white text with a dark outline; a worn «Title» sits under it (titles already show there today).
- **Also show the name** in save slots, the Playtest Report code (`name=…`), dialogue where NPCs address you ("Welcome back, Mira!" in Lumen/Quillon/Wren lines where it fits) and the Thesis scene ("Congratulations, Professor Quill!" uses the surname or the full name).
- **Rename:** Settings → Rename. First rename free, after that **10,000 gold** each.

### 18.2 Look options on the ID card
- Same ID card screen: **hair colour** and **uniform accent colour**, 8 swatches each, with a live preview of the character.
- Code recolours the player's sprites at load time (same per-pixel tint approach as the Freshman uniform and elite tints), so no new art and almost no file size.
- Applies to every outfit (Freshman, course, advanced, master); stored as `P.look = {hair, accent}`. Your Shadow in the Thesis Defence keeps its dark tint.
- Changeable later from Settings → Appearance (free).
- Suggested swatches: hair (default, black, chestnut, blonde, silver, pink, teal, violet); accent (default, crimson, royal blue, forest green, gold, plum, teal, charcoal).

### 18.3 First 10 minutes: tutorial hints
One-time hint bubbles (stored in `P.hints`), each dismissed by doing the thing or tapping it:

| Trigger | Hint |
|---|---|
| First spawn | "Move with ◀ ▶ (A/D). Jump with Jump (W/Space)." |
| First monster on screen | "Hold Attack to keep swinging." |
| First skill unlocked | "Skills hit harder but need a cooldown and SP." |
| First level-up | "You have stat points! Open Stats to spend them." |
| Near an NPC | "Tap Talk (F / ↓) to chat." |
| HP below 40% first time | "Drink a potion, or turn on auto-potion in the Bag." |
| First quest ready | "Quest complete! Claim it in Quests." |
| Lv 10 | "Choose your course with the Course button." |
| First skill point | "Skill points: open Stats → Skills to power up skills and passives." |

Settings → **Tutorial hints** on/off (new characters on, existing saves off).

### 18.4 Attendance card
- Map or Bag → **Attendance**. One stamp per calendar day you play (device date), claimed with a tap.
- 30-stamp card, then it starts over (keeping a lifetime count).

| Stamp | Reward |
|---|---|
| Every day | 5 potions + 3 ethers |
| Every 5th | 5 Star Shards |
| 10th | 300 × level gold |
| 20th | 10 Star Shards + 500 × level gold |
| 30th | Title **«Perfect Attendance»** (first card only) + 25 Star Shards |

- Missing days doesn't reset the card; it just takes longer.
- Add "Perfect Attendance" to achievements; show stamps in the Report code (`stamps=…`).

### 18.5 Mobile control settings
Settings → **Controls** (touch devices):
- **Button size:** 80% / 100% / 120% / 140%.
- **Button opacity:** 30–100% slider.
- **Layout:** right-handed (default) / left-handed (mirrors movement and action clusters).
- **Reset to default** button. Saved per device.

### 18.6 Music and sound effects `IDEA` (later)
PixelLab can generate music and sound effects. Later: one theme per region (Courtyard, Lanternfall, Archive, Harbor), a boss theme, and new SFX for hits, level-ups and skills. Check credit cost before committing.

### 18.7 Code checklist
1. Student ID card (name + hair + accent, live preview, 🎲 names), shown on Enroll and once for old saves (18.1, 18.2)
2. HUD name/class block, nameplate, name in saves/Report/dialogue, Rename (first free, then 10,000g), Appearance in Settings
3. Tutorial hints + toggle (18.3)
4. Attendance card + achievement + Report field (18.4)
5. Controls settings: size, opacity, left-handed layout (18.5)
6. Report the new page size and any deviations in the release notes

## 19. Move to GitHub Pages `LIVE` (steps 1–3, 22 Nov 2026: commits bc7fff7, 6cfcc6d)

**Decision (22 Nov 2026):** move the game from the single-file artifact to a GitHub repo published with GitHub Pages, so art size stops being a constraint.
- **Repo:** https://github.com/marijo1012/starbell-academy (public). README and `MIGRATION.md` are in place.
- **Live address:** https://marijo1012.github.io/starbell-academy/
- **Live details:** 336 images split into `art/<group>/` (core 220 files ~2.6 MB; academy ~0.5 MB; lanternfall ~1.1 MB; archive ~0.9 MB; arena), `manifest.json` with group + version hash, game script in `js/game.js`, per-region loading with a loading bar, background prefetch of neighbouring regions, placeholder fallback, save-code import note on the title screen, `tools/add_art.py` and `tools/stamp.py`.
- **Plan:** see `MIGRATION.md` in the repo. In short: (0) Mario turns on Pages (Settings → Pages → Deploy from branch `main`, root); (1) code chat commits the current `index.html` unchanged; (2) split embedded art into `art/<group>/` files + `manifest.json`; (3) load `core` + current region at start, load other regions on travel with a loading bar, prefetch the next region; (4) players move saves with the existing save codes; (5) new art guidance: sprites ~2–3× in-game size, backgrounds up to ~3,000 px, WebP q75–85.
- **Effect on section 13:** once step 3 ships, the 16 MB limit and the ~2 MB-per-region budget no longer apply.
- **Release flow:** branch → test → push to `main` (Pages redeploys); release notes still go to the project with the commit hash.

---

## Changelog
- 22 Nov 2026: Bible created from live game v1795326782-de58.
- 22 Nov 2026: Region roadmap decided. Region 3 (The Forbidden Archive) fully designed; story arc, Tier 7–8 gear, Little Grimoire pet, quests 16–23 and code build order added.
- 22 Nov 2026: Lv 40 Thesis advancement added (Grand Bellwarden, Tempest Laureate, Star Professor). Skill upgrades, Thesis Defence trial, quest 24, button rule and code build order 10.2 added.
- 22 Nov 2026: Final scope set: 6 regions, tuned to Lv 70. Postgraduate endgame (section 12), gear tiers 9–15 outline, pacing targets and code list 10.3 added.
- 22 Nov 2026: Synced with the code chat. Region 3 and Thesis marked `LIVE` (placeholder art). Recorded single-file constraint (no lazy-loading), ~4.1 MB page, live Shadow HP ~120k, ~11 kills/level at Lv 32, Your Shadow damage at 40%, no level cap. Added section 13 and the ~8 MB page budget.
- 22 Nov 2026: Read Code Chat Release Notes. Live version 1795333391-6ce8: 10.1 Region 3 and 10.2 Thesis marked `LIVE`; Boss Rush and the e31a batch moved to section 9; release-note details recorded (Sealed Stair position, Hurricane centre explosion, Symposium 12+1 meteors, halved cooldowns, Extra Credit reward).
- 22 Nov 2026: Passive skills added (section 2.5: 5 per course + 2 Electives, max Lv 5, 35-point sink) and a beta soft cap at Lv 100; build list 10.4 added; per-region caps deferred until after the beta.
- 22 Nov 2026: Pre-Region 4 polish plan added (section 14): Report code and beta checklist, Extra Credit scaling and EXP falloff, dialogue box, scenes and the Lost Pages diary text, elite affixes, Monster Log, achievements, boss enrage timers, sheet downscaling, and Region 4 design in parallel.
- 22 Nov 2026: Read Code Chat Release Notes. Live 1795334808-7764: 10.4 passives + Lv 100 cap marked `LIVE` (respec is free buttons, not a scroll). Live 1795335752-3c5c: section 14 (14.1–14.5, 14.7) marked `LIVE` with live details; page now 3.42 MB; gold curve recorded; tier price rebalance proposal added as an open decision.
- 22 Nov 2026: Tier price rebalance locked (Bronze 1,200, Moonsilver 4,000, Starlit 9,000, Bellforged 18,000, Sealbreaker 110,000); build task 15.1 added.
- 22 Nov 2026: Read releases 2b12 and d0b7. Tier prices live (Tier 5 = 24,000, Tier 6 = 40,000 per code chat); 10.0 items and Boss Rush Shadow wave live; page now ~6.2 MB after Region 3 art; section 16 next steps added (page weight recovery, Principal re-roll, fx_bolt, beta round, Region 4 design).
- 22 Nov 2026: Size budget relaxed (~2 MB per region, 14 MB warning, 16 MB hard limit; 16.1 optional). Region 4 Clocktide Harbor designed in full: areas, mechanics, NPCs, 4 monsters, Kraken boss, Tier 9–10, Clockwork Sparrow, quests 25–33, story beats, build list section 17.
- 22 Nov 2026: Section 18 player experience pass added (name + HUD, appearance tints, tutorial hints, attendance card, mobile controls; music/SFX deferred).
- 22 Nov 2026: Section 19 added: move to GitHub Pages (repo created, migration plan in the repo).
- 22 Nov 2026: GitHub Pages move marked `LIVE` (section 19); section 13 rewritten (no size budget). Scope extended to Lv 100: Regions 4–6 are 20 levels in two acts. Region 4 rewritten as Clocktide Harbor Lv 40–60 (Act 1 sky-port + Brass Colossus mid-boss; Act 2 cloud-sea with Driftwood Outpost, Undertow Reef, Wreckers' Graveyard, Maelstrom Eye + Kraken at Lv 60), 4 new monsters, Barnaby and Nerissa, Nimbus pet, Tiers 11–12, quests 25–42, build list 17 by act. Gear tiers extended to Tier 21 Summa at Lv 100; endgame and pacing moved to Lv 100.
- 22 Nov 2026: Docs moved into the repo (`docs/`); section 0 rewritten for Claude Code + design chat; added CLAUDE.md.
