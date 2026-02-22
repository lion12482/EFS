import { FIT_SCHEMA_V1 } from "./constants";

export type SlotKind = "high" | "mid" | "low" | "rig";

export type SkillMode =
  | { mode: "all_v" }
  | { mode: "character"; characterId: number }
  | { mode: "custom"; profile: Record<string, number> };

export interface FitSlotItem {
  typeId: number;
  chargeTypeId?: number;
  state?: "online" | "offline";
}

export interface FitDroneStack {
  typeId: number;
  quantity: number;
}

export interface FitV1 {
  schemaVersion: typeof FIT_SCHEMA_V1;
  fitId: string;
  createdAt: string;
  updatedAt: string;
  visibility: "public" | "unlisted";
  name: string;
  hullTypeId: number;
  skillMode?: SkillMode;
  slots: Record<SlotKind, FitSlotItem[]>;
  drones: FitDroneStack[];
  metadata?: {
    tags?: string[];
    favorite?: boolean;
    notes?: string;
  };
}

export type Fit = FitV1;

export interface ItemDefinition {
  typeId: number;
  name: string;
  group: "ship" | "module" | "charge" | "drone";
  slot?: SlotKind;
  size?: "small" | "medium" | "large";
  cpu?: number;
  powergrid?: number;
  calibration?: number;
  price?: number;
  hp?: { shield: number; armor: number; structure: number };
  resists?: {
    shield: number;
    armor: number;
    structure: number;
  };
  capacitor?: { capacity: number; rechargeSeconds: number };
  mobility?: { maxVelocity: number; agility: number; mass: number };
  slotLayout?: { high: number; mid: number; low: number; rig: number; droneBay: number };
  fitting?: { cpu: number; powergrid: number; calibration: number };
  allowedChargeGroups?: Array<ItemDefinition["group"]>;
  chargeSize?: ItemDefinition["size"];
  droneBandwidth?: number;
}

export interface DataPack {
  version: string;
  items: Record<number, ItemDefinition>;
}
