import { randomUUID } from "node:crypto";
import { FIT_SCHEMA_V1 } from "../model/constants";
import type { Fit } from "../model/types";

export function createEmptyFit(hullTypeId: number, name: string): Fit {
  const now = new Date().toISOString();
  return {
    schemaVersion: FIT_SCHEMA_V1,
    fitId: randomUUID(),
    createdAt: now,
    updatedAt: now,
    visibility: "unlisted",
    name,
    hullTypeId,
    slots: { high: [], mid: [], low: [], rig: [] },
    drones: [],
    skillMode: { mode: "all_v" }
  };
}

export function serializeFit(fit: Fit): string {
  return JSON.stringify(fit);
}

export function deserializeFit(input: string): Fit {
  const parsed = JSON.parse(input) as Fit;
  if (parsed.schemaVersion !== FIT_SCHEMA_V1) {
    throw new Error(`Unsupported fit schema: ${parsed.schemaVersion}`);
  }
  return parsed;
}
