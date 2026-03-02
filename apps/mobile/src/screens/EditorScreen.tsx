import React, { useState, useEffect } from "react";
import { Text, View, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useFitStore } from "../store/useFitStore";
import type { SlotKind } from "@efs/core";
import { seedDataPack } from "@efs/datapack-seed";
import { HardwareBrowserModal } from "../components/HardwareBrowserModal";

const maxSlots = { high: 8, mid: 8, low: 8, rig: 3 };

export function EditorScreen() {
  const currentFit = useFitStore((s: any) => s.currentFit);
  const isDirty = useFitStore((s: any) => s.isDirty);
  const setCurrentFit = useFitStore((s: any) => s.setCurrentFit);
  const saveCurrentFit = useFitStore((s: any) => s.saveCurrentFit);

  const [nameInputValue, setNameInputValue] = useState(currentFit.name);
  const [activeSlot, setActiveSlot] = useState<{ kind: SlotKind, index: number } | null>(null);

  useEffect(() => {
    setNameInputValue(currentFit.name);
  }, [currentFit.name]);

  const handleNameChange = (newName: string) => {
    setNameInputValue(newName);
    setCurrentFit({ ...currentFit, name: newName });
  };

  const handleSave = () => {
    saveCurrentFit();
  };

  const handleEquip = (typeId: number) => {
    if (!activeSlot) return;

    const newFit = { ...currentFit, slots: { ...currentFit.slots } };
    const currentSlots = [...(newFit.slots[activeSlot.kind] || [])];

    while (currentSlots.length <= activeSlot.index) {
      currentSlots.push({ typeId: 0 });
    }

    currentSlots[activeSlot.index] = { typeId, state: "online" };
    newFit.slots[activeSlot.kind] = currentSlots.filter(s => s.typeId !== 0);

    setCurrentFit(newFit);
    setActiveSlot(null);
  };

  const handleClearSlot = () => {
    if (!activeSlot) return;

    const newFit = { ...currentFit, slots: { ...currentFit.slots } };
    const currentSlots = [...(newFit.slots[activeSlot.kind] || [])];

    if (currentSlots[activeSlot.index]) {
      currentSlots.splice(activeSlot.index, 1);
      newFit.slots[activeSlot.kind] = currentSlots;
      setCurrentFit(newFit);
    }
    setActiveSlot(null);
  };

  const hull = seedDataPack.items[currentFit.hullTypeId];
  if (!hull || hull.group !== "ship") {
    return <View style={styles.container}><Text>Invalid Hull</Text></View>;
  }
  const layout = hull.slotLayout || { high: 0, mid: 0, low: 0, rig: 0, droneBay: 0 };

  const renderSlotGroup = (kind: SlotKind, count: number) => {
    const fitted = currentFit.slots[kind] || [];
    const slots = [];
    for (let i = 0; i < maxSlots[kind]; i++) {
      if (i >= count) break;
      const item = fitted[i];
      const itemDef = item ? seedDataPack.items[item.typeId] : null;

      slots.push(
        <TouchableOpacity
          key={i}
          style={[styles.slotItem, itemDef ? styles.slotOccupied : styles.slotEmpty]}
          onPress={() => setActiveSlot({ kind, index: i })}
        >
          <View style={styles.slotIcon}>
            <Text style={{ fontSize: 16 }}>{itemDef ? "⚙️" : "+"}</Text>
          </View>
          <View style={styles.slotDetails}>
            <Text style={[styles.slotName, !itemDef && styles.slotNameEmpty]}>
              {itemDef ? itemDef.name : `Empty ${kind} slot`}
            </Text>
            {itemDef && (
              <Text style={styles.slotMeta}>CPU: {itemDef.cpu || 0} PG: {itemDef.powergrid || 0}</Text>
            )}
          </View>
        </TouchableOpacity>
      );
    }

    return (
      <View style={styles.slotGroup}>
        <Text style={styles.slotGroupTitle}>{kind} Slots ({fitted.length}/{count})</Text>
        {slots}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.nameInput}
          value={nameInputValue}
          onChangeText={handleNameChange}
          placeholder="Fit Name"
          placeholderTextColor="#666"
        />
        <TouchableOpacity
          style={[styles.saveButton, !isDirty && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={!isDirty}
        >
          <Text style={styles.saveButtonText}>{isDirty ? "Save*" : "Saved"}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollArea}>
        {renderSlotGroup("high", layout.high)}
        {renderSlotGroup("mid", layout.mid)}
        {renderSlotGroup("low", layout.low)}
        {renderSlotGroup("rig", layout.rig)}
        <View style={{ height: 40 }} />
      </ScrollView>

      {activeSlot && (
        <HardwareBrowserModal
          visible={!!activeSlot}
          activeSlotKind={activeSlot.kind}
          onClose={() => setActiveSlot(null)}
          onSelect={handleEquip}
          onClear={handleClearSlot}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f172a", padding: 16 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  nameInput: { flex: 1, color: "white", fontSize: 20, fontWeight: "bold", marginRight: 16, backgroundColor: "#1e293b", padding: 8, borderRadius: 4 },
  saveButton: { backgroundColor: "#2563eb", paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
  saveButtonDisabled: { backgroundColor: "#334155" },
  saveButtonText: { color: "white", fontWeight: "bold" },
  scrollArea: { flex: 1 },
  slotGroup: { marginBottom: 24 },
  slotGroupTitle: { color: "#94a3b8", fontSize: 16, fontWeight: "bold", textTransform: "capitalize", marginBottom: 12 },
  slotItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  slotEmpty: {
    borderColor: "#334155",
    borderStyle: "dashed",
    backgroundColor: "transparent",
  },
  slotOccupied: {
    borderColor: "#475569",
    backgroundColor: "#1e293b",
  },
  slotIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#334155",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  slotDetails: { flex: 1 },
  slotName: { color: "white", fontSize: 16 },
  slotNameEmpty: { color: "#64748b" },
  slotMeta: { color: "#94a3b8", fontSize: 12, marginTop: 4 },
});
