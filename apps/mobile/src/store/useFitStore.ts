import { create } from "zustand";
import { computeFitStats, createEmptyFit, type Fit } from "@efs/core";
import { seedDataPack } from "@efs/datapack-seed";
import { saveFitInDb, getFitByIdFromDb } from "../db/repository";

interface FitState {
  currentFit: Fit;
  isDirty: boolean;
  setCurrentFit: (fit: Fit) => void;
  loadFit: (id: string, newFitIfMissing?: boolean) => void;
  saveCurrentFit: (tags?: string, isFavorite?: boolean) => void;
}

export const useFitStore = create<FitState>((set, get) => ({
  currentFit: createEmptyFit(603, "New Kestrel Fit"),
  isDirty: false,
  setCurrentFit: (fit: Fit) => set({ currentFit: fit, isDirty: true }),
  loadFit: (id: string, newFitIfMissing: boolean = false) => {
    const loaded = getFitByIdFromDb(id);
    if (loaded) {
      set({ currentFit: loaded, isDirty: false });
    } else if (newFitIfMissing) {
      set({ currentFit: createEmptyFit(603, "New Kestrel Fit"), isDirty: false });
    }
  },
  saveCurrentFit: (tags?: string, isFavorite: boolean = false) => {
    const { currentFit } = get();
    saveFitInDb(currentFit, tags, isFavorite);
    set({ isDirty: false });
  }
}));

export function useCurrentStats() {
  const fit = useFitStore((s: FitState) => s.currentFit);
  return computeFitStats(fit, seedDataPack);
}
