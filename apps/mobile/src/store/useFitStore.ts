import { create } from "zustand";
import { computeFitStats, createEmptyFit, type Fit } from "@efs/core";
import { seedDataPack } from "@efs/datapack-seed";

interface FitState {
  currentFit: Fit;
  setCurrentFit: (fit: Fit) => void;
}

export const useFitStore = create<FitState>((set) => ({
  currentFit: createEmptyFit(603, "New Kestrel Fit"),
  setCurrentFit: (fit) => set({ currentFit: fit })
}));

export function useCurrentStats() {
  const fit = useFitStore((s) => s.currentFit);
  return computeFitStats(fit, seedDataPack);
}
