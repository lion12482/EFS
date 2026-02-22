import type { DataPack, Fit, SlotKind } from "../model/types";

export interface ValidationWarning {
  code:
    | "slot_overflow"
    | "missing_item"
    | "cpu_exceeded"
    | "pg_exceeded"
    | "calibration_exceeded"
    | "incompatible_charge"
    | "wrong_slot"
    | "drone_bay_exceeded";
  message: string;
}

export interface FitValidationResult {
  valid: boolean;
  cpuUsed: number;
  cpuMax: number;
  powergridUsed: number;
  powergridMax: number;
  calibrationUsed: number;
  calibrationMax: number;
  warnings: ValidationWarning[];
}

const slotKinds: SlotKind[] = ["high", "mid", "low", "rig"];

export function validateFit(fit: Fit, dataPack: DataPack): FitValidationResult {
  const hull = dataPack.items[fit.hullTypeId];
  const warnings: ValidationWarning[] = [];

  if (!hull || hull.group !== "ship") {
    return {
      valid: false,
      cpuUsed: 0,
      cpuMax: 0,
      powergridUsed: 0,
      powergridMax: 0,
      calibrationUsed: 0,
      calibrationMax: 0,
      warnings: [{ code: "missing_item", message: "Invalid hull type." }]
    };
  }

  let cpuUsed = 0;
  let powergridUsed = 0;
  let calibrationUsed = 0;

  for (const slot of slotKinds) {
    const fitted = fit.slots[slot] ?? [];
    const cap = hull.slotLayout?.[slot] ?? 0;
    if (fitted.length > cap) {
      warnings.push({
        code: "slot_overflow",
        message: `${slot} slots exceeded (${fitted.length}/${cap}).`
      });
    }

    for (const mod of fitted) {
      const moduleDef = dataPack.items[mod.typeId];
      if (!moduleDef) {
        warnings.push({ code: "missing_item", message: `Missing type ${mod.typeId}.` });
        continue;
      }
      if (moduleDef.slot !== slot) {
        warnings.push({
          code: "wrong_slot",
          message: `${moduleDef.name} cannot be fitted to ${slot} slot.`
        });
      }
      cpuUsed += moduleDef.cpu ?? 0;
      powergridUsed += moduleDef.powergrid ?? 0;
      calibrationUsed += moduleDef.calibration ?? 0;

      if (mod.chargeTypeId) {
        const charge = dataPack.items[mod.chargeTypeId];
        if (!charge || charge.group !== "charge") {
          warnings.push({
            code: "incompatible_charge",
            message: `Charge ${mod.chargeTypeId} not valid.`
          });
        }
        if (moduleDef.chargeSize && charge?.size && moduleDef.chargeSize !== charge.size) {
          warnings.push({
            code: "incompatible_charge",
            message: `Charge size mismatch for ${moduleDef.name}.`
          });
        }
      }
    }
  }

  const droneBayCap = hull.slotLayout?.droneBay ?? 0;
  const droneCount = fit.drones.reduce((sum, entry) => sum + entry.quantity, 0);
  if (droneCount > droneBayCap) {
    warnings.push({
      code: "drone_bay_exceeded",
      message: `Drone bay exceeded (${droneCount}/${droneBayCap}).`
    });
  }

  for (const drone of fit.drones) {
    const droneDef = dataPack.items[drone.typeId];
    if (!droneDef) {
      warnings.push({ code: "missing_item", message: `Missing drone type ${drone.typeId}.` });
      continue;
    }
    if (droneDef.group !== "drone") {
      warnings.push({
        code: "missing_item",
        message: `${droneDef.name} is not a drone and cannot be in drone bay.`
      });
    }
  }

  const cpuMax = hull.fitting?.cpu ?? 0;
  const powergridMax = hull.fitting?.powergrid ?? 0;
  const calibrationMax = hull.fitting?.calibration ?? 0;

  if (cpuUsed > cpuMax) warnings.push({ code: "cpu_exceeded", message: "CPU exceeded." });
  if (powergridUsed > powergridMax) warnings.push({ code: "pg_exceeded", message: "Powergrid exceeded." });
  if (calibrationUsed > calibrationMax) {
    warnings.push({ code: "calibration_exceeded", message: "Calibration exceeded." });
  }

  return {
    valid: warnings.length === 0,
    cpuUsed,
    cpuMax,
    powergridUsed,
    powergridMax,
    calibrationUsed,
    calibrationMax,
    warnings
  };
}
