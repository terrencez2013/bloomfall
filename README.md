# Bloomfall

A standalone flower arena game inspired by orbiting-petal combat.

Open `dist/index.html` in a browser, or run `node serve.cjs` and visit http://127.0.0.1:4173.

- WASD / arrows: move
- Space: extend petals
- Shift: guard
- P: pause
- Touch: hold and drag toward your destination; petals extend automatically

Choose a slot under Orbit loadout, then equip a petal from Petal collection. Press C for Crafting. Select a stack, then combine five **unequipped** matching petals for a guaranteed higher rarity. Craft all processes every available batch. Research uses nectar. Rebirth unlocks at garden 4, keeping petals and research and granting permanent power and seed bonuses. Seeds passively increase nectar and XP rewards by 0.5% each. Progress is saved in this browser every five seconds.

Features nineteen petal types, eight rarities, six repeating boss patterns, twelve cycling garden themes, unlimited scaling gardens, twenty unlockable orbit slots, permanent research, and rebirths.

Run `node check.cjs` for a headless simulation check. Browser playtesting and long-term balance tuning are still recommended.

Press I or click Inventory to browse petals while combat pauses. Select a slot, then Equip. Inventory cards show damage per second and maximum health; orbit slots show live health and regrowth countdowns. Petals lose health from enemies and projectiles, regenerate slowly while intact, and regrow eight seconds after breaking. Swapping petals during a run also takes eight seconds.

New ability petals: Nightshade poisons for 3 seconds; Thunderbell chains through four enemies; Dandelion adds movement and orbit speed; Ramroot knocks back mobs; Broodbud summons friendly beetles. Each save receives one free copy of each. Base petal health has been reduced by roughly 55–60%. Free slots unlock every three levels using your permanent highest level, while Wider bloom research adds further slots to a total cap of 20. Rebirth keeps unlocked slots.


Balance update: passive flower healing is 6 HP/sec, Clover adds 3 HP/sec, and regeneration research adds 1.2 HP/sec per level. Petal health is halved again and regrowth / equipment swaps take 8 seconds. XP requirements are lower, rewards are larger, waves require fewer kills, and growing a random petal costs 25 nectar.

Mob gallery: press G or use the navigation tab. Each species unlocks after a kill; records and observed drop counts persist through rebirth. Existing boss discoveries carry over, while detailed kill counts begin with this update. The gallery and gameplay share one loot table. Regular mobs have a 65% petal drop chance; bosses roll three guaranteed petals. Each mob has five equally likely types. All 18 petals have at least one mob source.

Additional petals: Ember spreads burning damage nearby, Lodestone attracts distant nectar, Aegis reduces incoming player damage, Bloodroot heals on contact damage, and Starburst releases an area nova. Each save receives one of each.


Starburst now emits a visible expanding shockwave from its orbiting petal, hitting each reached enemy once for 350% petal power and repeating every 2.5 seconds while enemies are in range. Whirligig adds 35% orbit speed per active copy plus 5% per rarity, with its combined bonus capped at 300%; one copy is given to existing saves. Loadouts support 20 petals over two rings, with free slots every three highest-ever levels.

Elite variants have 3.5x health, 1.7x contact damage, and lunging attacks. Champions have 6x health, 2.4x contact damage, and triple projectiles. Elite loot gains +1 rarity; champion loot gains +2 and two guaranteed rolls. Bosses guarantee at least Rare petals, gain rarity with gardens, and drop 3–6 petals. The gallery shows the corresponding rarity floors and probabilities.


Automatic equipment upgrades: collecting or crafting a higher-rarity version of an equipped petal replaces the lowest-rarity matching slot, one slot per acquired copy. Old petals remain in inventory, and swapped petals retain the normal 8-second regrowth requirement. Regular, elite, and champion XP rewards are reduced by 40%; nectar and boss XP are unchanged. Elite drop chance is now 80% (was 90%) and bonus-rarity chance is 18% (was 25%); champion and boss loot profiles are unchanged.


Equipment cap: a maximum of 20 petals can be equipped. Older saves with larger loadouts keep their first 20 equipped petals; the rest become available in inventory, with no owned petals lost. Slot research stops at the cap.


Difficulty increase: all enemies have 50% more health and 20% more movement speed. Contact and projectile damage are higher, elites charge faster and more often, champions fire faster and more often, and bosses attack more frequently with faster projectiles. Petal loot tables, rarity chances, quantities, nectar, and XP rewards are unchanged by this difficulty update.


Progressive challenge: enemy health grows by 85% per garden and 10% per wave; damage grows by 32% per garden and 6% per wave. Movement and special-attack frequency also rise, capped at 2.25x and 2.5x respectively. Bloomfall now appears as the large main page title. Loot tables and reward formulas are unchanged.


Contact-triggered specials: Thunderbell starts its lightning chain on the enemy physically hit by the petal (1.2-second cooldown). Starburst releases its expanding shockwave at the petal contact point (2.5-second cooldown). Neither activates just because a mob is nearby, and broken petals cannot trigger either effect.


Thunderbell now has no lightning cooldown and can trigger on every petal contact. Whirligig has infinite health, cannot break from mobs or projectiles, and shows ∞ HP with a full health bar. The normal equipment-swap delay still applies.


Cache refresh: Pages deployments now stamp JavaScript and stylesheet URLs with the deployed commit, so browsers fetch fresh code after each update. The heading confirms Thunderbell's no-cooldown lightning and Whirligig's infinite health.

Starburst now triggers on every hit without a special cooldown, and has exactly 1 HP at every rarity. The normal petal regrowth timer still applies.
Starburst now has 100 base HP with normal rarity scaling and a 10% chance to release its shockwave on contact.
Starburst now has a 20% explosion chance on hit. Each wave rolls one modifier: Horde, Armored, Rush, Frenzy, or Elite Surge. The current modifier is saved with progress and shown next to the wave objective.
