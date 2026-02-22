import type { DataPack } from "@efs/core";

export const seedDataPack: DataPack = {
  version: "seed-2026.02",
  items: {
    603: {
      typeId: 603,
      name: "Kestrel",
      group: "ship",
      hp: { shield: 520, armor: 350, structure: 400 },
      resists: { shield: 0.2, armor: 0.35, structure: 0.33 },
      capacitor: { capacity: 300, rechargeSeconds: 180 },
      mobility: { maxVelocity: 345, agility: 3.1, mass: 1100000 },
      slotLayout: { high: 4, mid: 4, low: 2, rig: 3, droneBay: 0 },
      fitting: { cpu: 190, powergrid: 38, calibration: 400 },
      price: 420000
    },
    10631: {
      typeId: 10631,
      name: "Rocket Launcher I",
      group: "module",
      slot: "high",
      size: "small",
      chargeSize: "small",
      cpu: 18,
      powergrid: 3,
      price: 25000
    },
    2512: {
      typeId: 2512,
      name: "Mjolnir Rocket",
      group: "charge",
      size: "small",
      price: 120
    },
    3841: {
      typeId: 3841,
      name: "Small Shield Extender I",
      group: "module",
      slot: "mid",
      cpu: 20,
      powergrid: 8,
      price: 18000
    },
    2048: {
      typeId: 2048,
      name: "Ballistic Control System I",
      group: "module",
      slot: "low",
      cpu: 30,
      powergrid: 1,
      price: 50000
    },
    31790: {
      typeId: 31790,
      name: "Small Core Defense Field Extender I",
      group: "module",
      slot: "rig",
      calibration: 200,
      price: 75000
    },
    23707: {
      typeId: 23707,
      name: "Hornet I",
      group: "drone",
      price: 9000
    }
  }
};
