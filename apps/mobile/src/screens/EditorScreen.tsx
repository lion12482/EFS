import React, { useState, useEffect } from "react";
import { Text, View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useFitStore, useCurrentStats } from "../store/useFitStore";

export function EditorScreen() {
  const currentFit = useFitStore((s: any) => s.currentFit);
  const isDirty = useFitStore((s: any) => s.isDirty);
  const setCurrentFit = useFitStore((s: any) => s.setCurrentFit);
  const saveCurrentFit = useFitStore((s: any) => s.saveCurrentFit);

  const [nameInputValue, setNameInputValue] = useState(currentFit.name);

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

      <Text style={{ color: "#9ea7c4", marginTop: 8 }}>Hull ID: {currentFit.hullTypeId}</Text>
      <Text style={{ color: "#9ea7c4", marginTop: 8 }}>Slots configured: {Object.keys(currentFit.slots).length}</Text>
      <Text style={{ color: "#9ea7c4", marginTop: 8 }}>Search-first add/replace TODO in incremental UI passes.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  nameInput: { flex: 1, color: "white", fontSize: 20, fontWeight: "bold", marginRight: 16, backgroundColor: "#1e293b", padding: 8, borderRadius: 4 },
  saveButton: { backgroundColor: "#2563eb", paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
  saveButtonDisabled: { backgroundColor: "#334155" },
  saveButtonText: { color: "white", fontWeight: "bold" },
});
