import type { DataPack, Fit } from "../model/types";
import { validateFit } from "./validation";

export interface FitStats {
  hp: { shield: number; armor: number; structure: number };
  ehp: number;
  capacitor: { capacity: number; rechargeSeconds: number; stable: boolean };
  mobility: { maxVelocity: number; alignTime: number };
  isk: { total: number; breakdown: Array<{ typeId: number; amount: number }> };
  fitting: ReturnType<typeof validateFit>;
}

export function computeFitStats(fit: Fit, dataPack: DataPack): FitStats {
  const hull = dataPack.items[fit.hullTypeId];
  const fitting = validateFit(fit, dataPack);

  const hp = {
    shield: hull?.hp?.shield ?? 0,
    armor: hull?.hp?.armor ?? 0,
    structure: hull?.hp?.structure ?? 0
  };

  const shieldResist = hull?.resists?.shield ?? 0;
  const armorResist = hull?.resists?.armor ?? 0;
  const structureResist = hull?.resists?.structure ?? 0;
  const ehp =
    hp.shield / Math.max(1 - shieldResist, 0.01) +
    hp.armor / Math.max(1 - armorResist, 0.01) +
    hp.structure / Math.max(1 - structureResist, 0.01);

  const cap = hull?.capacitor ?? { capacity: 0, rechargeSeconds: 0 };
  const mobility = hull?.mobility ?? { maxVelocity: 0, agility: 1, mass: 1 };

  const typeIds: number[] = [fit.hullTypeId];
  for (const slot of Object.values(fit.slots)) {
    for (const item of slot) {
      typeIds.push(item.typeId);
      if (item.chargeTypeId) typeIds.push(item.chargeTypeId);
    }
  }
  for (const drone of fit.drones) {
    for (let i = 0; i < drone.quantity; i += 1) {
      typeIds.push(drone.typeId);
    }
  }

  const breakdown = typeIds.map((typeId) => ({ amount: dataPack.items[typeId]?.price ?? 0, typeId }));

  return {
    hp,
    ehp: Math.round(ehp),
    capacitor: {
      capacity: cap.capacity,
      rechargeSeconds: cap.rechargeSeconds,
      stable: fitting.cpuUsed <= fitting.cpuMax && fitting.powergridUsed <= fitting.powergridMax
    },
    mobility: {
      maxVelocity: mobility.maxVelocity,
      alignTime: Math.round(mobility.agility * 10) / 10
    },
    isk: {
      total: breakdown.reduce((sum, entry) => sum + entry.amount, 0),
      breakdown
    },
    fitting
  };
}
