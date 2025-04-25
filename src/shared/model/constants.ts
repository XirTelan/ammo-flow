export const helpDb = [
  {
    title: "Intro",
    content: `Welcome to the game.\nTurrets are pre-placed. You cannot build, sell, upgrade, or interact with them in the usual ways.
      You influence them through the types of ammo you load into them and which types you choose to produce.
      The enemy info panel shows what types of enemies and how many will arrive in the next wave.
      On the right, you have 4 factories. At each factory, you choose which type of ammo to produce. If you want, you can produce the same type at all 4.
      Besides choosing the type of ammo, you also need to assign workers. You gain one worker per wave. Each assigned worker increases the amount of ammo produced per cycle.
      Ammo is sent to storage after production. The amount of ammo produced per cycle is shown directly under the STOCK section.
      You can view the entire inventory by opening the storage window at the bottom of the screen.
  
      You can also reopen this information during the game by pressing the "database" button.`,
  },
  {
    title: "Turrets",
    content: `The game features the following turret types:
      machine gun – a universal turret. Can be used against all enemies, provided the right type of ammo is loaded.
      aa – for aerial targets.
      ap – for armored targets. (from 0 to 1. where 1 - 100% armor ignore)
      artillery – large firing radius, high damage, splash damage. Cannot target air units.
      flak cannon – only against air. Unlike the machine gun, it has higher damage and deals splash damage to nearby enemies.
      railgun – high damage, long range, low fire rate, and low ammo production speed.
      plasma cannon – medium range, fires a straight beam, damaging everything in its path. Long reload time.`,
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
