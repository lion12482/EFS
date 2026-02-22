import { describe, expect, it } from "vitest";
import type { DataPack } from "../src/model/types";
import { createEmptyFit, deserializeFit, serializeFit } from "../src/serialization/fitSchema";
import { computeFitStats } from "../src/engine/stats";
import { validateFit } from "../src/engine/validation";

const dataPack: DataPack = {
  version: "seed-1",
  items: {
    1: {
      typeId: 1,
      name: "Seed Frigate",
      group: "ship",
      slotLayout: { high: 2, mid: 2, low: 2, rig: 2, droneBay: 0 },
      fitting: { cpu: 100, powergrid: 50, calibration: 400 }
    },
    100: { typeId: 100, name: "Seed Gun", group: "module", slot: "high", cpu: 20, powergrid: 10 },
    200: { typeId: 200, name: "Seed Drone", group: "drone", price: 1000 }
  }
};

describe("fit validation", () => {
  it("flags slot overflow", () => {
    const fit = createEmptyFit(1, "overflow");
    fit.slots.high.push({ typeId: 100 }, { typeId: 100 }, { typeId: 100 });

    const result = validateFit(fit, dataPack);
    expect(result.valid).toBe(false);
    expect(result.warnings.some((w) => w.code === "slot_overflow")).toBe(true);
  });

  it("round-trips serialization", () => {
    const fit = createEmptyFit(1, "serialize");
    fit.slots.high.push({ typeId: 100 });
    const raw = serializeFit(fit);
    const parsed = deserializeFit(raw);
    expect(parsed.name).toEqual("serialize");
    expect(parsed.slots.high[0].typeId).toEqual(100);
  });

  it("counts drone quantities for ISK and drone bay validation", () => {
    const fit = createEmptyFit(1, "drones");
    fit.drones.push({ typeId: 200, quantity: 5 });

    const validation = validateFit(fit, dataPack);
    expect(validation.warnings.some((w) => w.code === "drone_bay_exceeded")).toBe(true);

    const stats = computeFitStats(fit, dataPack);
    expect(stats.isk.total).toEqual(5000);
  });
});
