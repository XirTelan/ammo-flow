export const helpDb = [
  {
    title: "Intro",
    content: `Welcome to the Game!

  We have a base and we need to defend it. But there's a catch.

The turrets? They're already chilling in place.
You can't build 'em, sell 'em, or slap upgrades on 'em.

You control the ammo!
Pick what gets produced, decide what and when gets loaded or unloaded , and watch the fireworks.

Your Role

 Turrets are pre-placed.
 You cannot build, sell,move or upgrade them.
 Instead, you influence them by choosing which types of ammo to produce and load into the turrets.
 Ammo Production

 On the right, you'll see four factories.
 At each factory, you can:

    Choose an ammo type to produce (you can choose the same type at multiple factories).

    Assign workers to start production (you need at least one worker for a factory to run)
        -You gain one worker per wave.
        -Each assigned worker increases the amount of ammo produced per cycle.
`,
  },
  {
    title: "Intro 2",
    content: `After production, ammo is sent to storage.
The STOCK section shows how much of the currently selected ammo type is available.
To view your full inventory, open the storage window at the bottom of the screen.
Enemies

The Enemy Info Panel shows:

    The types of enemies that will appear in the next wave

    How many of each type

The first few waves contain only light enemies.
Stronger enemies will appear in later waves.

You can revisit this information at any time by pressing the Database button.
Tips:

    Start with the machine gun's default ammo.

    Don’t forget: you can unload ammo from one turret and load it into another if you don’t have enough ammo.`,
  },
  {
    title: "Turrets",
    content: `Turret Types

The game features several turret types, each with a unique role and behavior. Their effectiveness depends on the type of ammo they are loaded with.
    -Machine Gun
     A versatile, all-purpose turret.
     Can be used against all enemy types with the appropriate ammo.
     AA (Anti-Air) - Specialized for targeting aerial enemies only.
     AP (Armor-Piercing) Designed to penetrate armored enemies.Ammo features an AP rating from 0 to 1, where 1 means 100% armor is ignored.
    -Artillery
     Long firing range, high damage, and splash damage.
     Cannot target air units.
    -Flak Cannon
     Effective only against air units.
     Compared to the machine gun, it has higher damage and deals splash damage to nearby flying enemies.
    -Railgun
     Extremely high damage with long range and low fire rate.
     Ammo production is slow, so manage resources carefully.
    -Plasma Cannon
     Medium-range turret that fires a continuous beam, damaging all enemies in its path.
     Has a long reload time, but excels at clearing lines of enemies.`,
    imageKey: "turretHelp",
  },
  {
    title: "Units",
    content: `Unit parameters:
      hp – unit health
      spd – movement speed
      rng – attack range
      arm – armor. Countered by the AP stat on ammo.
      dmg – damage dealt to the base
      type – unit type: air or ground. Turrets loaded with anti-air ammo cannot target ground units, and vice versa.`,
  },
];
