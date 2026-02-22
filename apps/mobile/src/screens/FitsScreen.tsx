import React from "react";
import { Button, ScrollView, Text, View } from "react-native";
import { useFitStore } from "../store/useFitStore";

export function FitsScreen() {
  const currentFit = useFitStore((s) => s.currentFit);
  const savedFits = useFitStore((s) => s.savedFits);
  const saveCurrentFit = useFitStore((s) => s.saveCurrentFit);
  const createNewFit = useFitStore((s) => s.createNewFit);
  const loadFit = useFitStore((s) => s.loadFit);
  const deleteFit = useFitStore((s) => s.deleteFit);

  return (
    <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 24 }}>
      <Text style={{ color: "white", fontSize: 18 }}>Fits Library</Text>
      <Text style={{ color: "#9ea7c4", marginTop: 8 }}>Current fit: {currentFit.name}</Text>
      <View style={{ marginTop: 12, flexDirection: "row", gap: 8 }}>
        <Button title="Save current" onPress={saveCurrentFit} />
        <Button title="New fit" onPress={createNewFit} />
      </View>

      <Text style={{ color: "white", marginTop: 20, marginBottom: 10 }}>Saved fits ({savedFits.length})</Text>
      {savedFits.map((fit) => (
        <View key={fit.fitId} style={{ backgroundColor: "#1a233f", borderRadius: 8, padding: 12, marginBottom: 10 }}>
          <Text style={{ color: "white" }}>{fit.name}</Text>
          <Text style={{ color: "#9ea7c4", marginTop: 4 }}>ID: {fit.fitId.slice(0, 8)}...</Text>
          <Text style={{ color: "#9ea7c4", marginTop: 4 }}>
            Slots H/M/L/R: {fit.slots.high.length}/{fit.slots.mid.length}/{fit.slots.low.length}/{fit.slots.rig.length}
          </Text>
          <View style={{ marginTop: 10, flexDirection: "row", gap: 8 }}>
            <Button title="Load" onPress={() => loadFit(fit.fitId)} />
            <Button title="Delete" color="#aa445f" onPress={() => deleteFit(fit.fitId)} />
          </View>
        </View>
      ))}
      {savedFits.length === 0 ? <Text style={{ color: "#9ea7c4" }}>No saved fits yet.</Text> : null}
    </ScrollView>
  );
}
