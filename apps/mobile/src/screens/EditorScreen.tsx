import React from "react";
import { Button, Text, TextInput, View } from "react-native";
import { useFitStore } from "../store/useFitStore";

export function EditorScreen() {
  const fit = useFitStore((s) => s.currentFit);
  const renameCurrentFit = useFitStore((s) => s.renameCurrentFit);
  const addDefaultModule = useFitStore((s) => s.addDefaultModule);
  const removeLastModule = useFitStore((s) => s.removeLastModule);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ color: "white", fontSize: 18 }}>Fit Editor</Text>
      <Text style={{ color: "#9ea7c4", marginTop: 8 }}>Fit name</Text>
      <TextInput
        value={fit.name}
        onChangeText={renameCurrentFit}
        placeholder="My Kestrel"
        placeholderTextColor="#627196"
        style={{ marginTop: 8, color: "white", backgroundColor: "#1a233f", borderRadius: 8, padding: 10 }}
      />

      {(["high", "mid", "low", "rig"] as const).map((slot) => (
        <View key={slot} style={{ marginTop: 16, borderTopColor: "#2f3a5f", borderTopWidth: 1, paddingTop: 12 }}>
          <Text style={{ color: "#9ea7c4", marginBottom: 8 }}>
            {slot.toUpperCase()} slots: {fit.slots[slot].length}
          </Text>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <Button title={`Add ${slot}`} onPress={() => addDefaultModule(slot)} />
            <Button title={`Remove ${slot}`} onPress={() => removeLastModule(slot)} />
          </View>
        </View>
      ))}
    </View>
  );
}
