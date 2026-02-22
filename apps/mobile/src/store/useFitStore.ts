import { create } from "zustand";
import { computeFitStats, createEmptyFit, type Fit } from "@efs/core";
import { seedDataPack } from "@efs/datapack-seed";

const SLOT_DEFAULT_MODULES = {
  high: 10631,
  mid: 3841,
  low: 2048,
  rig: 31790
} as const;

interface FitState {
  currentFit: Fit;
  savedFits: Fit[];
  setCurrentFit: (fit: Fit) => void;
  createNewFit: () => void;
  renameCurrentFit: (name: string) => void;
  addDefaultModule: (slot: keyof Fit["slots"]) => void;
  removeLastModule: (slot: keyof Fit["slots"]) => void;
  saveCurrentFit: () => void;
  loadFit: (fitId: string) => void;
  deleteFit: (fitId: string) => void;
}

export const useFitStore = create<FitState>((set) => ({
  currentFit: createEmptyFit(603, "New Kestrel Fit"),
  savedFits: [],
  setCurrentFit: (fit) => set({ currentFit: fit }),
  createNewFit: () => set({ currentFit: createEmptyFit(603, "New Kestrel Fit") }),
  renameCurrentFit: (name) =>
    set((state) => ({
      currentFit: {
        ...state.currentFit,
        name,
        updatedAt: new Date().toISOString()
      }
    })),
  addDefaultModule: (slot) =>
    set((state) => ({
      currentFit: {
        ...state.currentFit,
        updatedAt: new Date().toISOString(),
        slots: {
          ...state.currentFit.slots,
          [slot]: [
            ...state.currentFit.slots[slot],
            {
              typeId: SLOT_DEFAULT_MODULES[slot],
              state: "online"
            }
          ]
        }
      }
    })),
  removeLastModule: (slot) =>
    set((state) => ({
      currentFit: {
        ...state.currentFit,
        updatedAt: new Date().toISOString(),
        slots: {
          ...state.currentFit.slots,
          [slot]: state.currentFit.slots[slot].slice(0, -1)
        }
      }
    })),
  saveCurrentFit: () =>
    set((state) => {
      const fitToSave = { ...state.currentFit, updatedAt: new Date().toISOString() };
      const exists = state.savedFits.some((fit) => fit.fitId === fitToSave.fitId);
      return {
        currentFit: fitToSave,
        savedFits: exists
          ? state.savedFits.map((fit) => (fit.fitId === fitToSave.fitId ? fitToSave : fit))
          : [fitToSave, ...state.savedFits]
      };
    }),
  loadFit: (fitId) =>
    set((state) => ({
      currentFit: state.savedFits.find((fit) => fit.fitId === fitId) ?? state.currentFit
    })),
  deleteFit: (fitId) =>
    set((state) => ({
      savedFits: state.savedFits.filter((fit) => fit.fitId !== fitId)
    }))
}));

export function useCurrentStats() {
  const fit = useFitStore((s) => s.currentFit);
  return computeFitStats(fit, seedDataPack);
}
