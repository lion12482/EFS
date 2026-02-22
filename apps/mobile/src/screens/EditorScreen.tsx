import React from "react";
import { Text, View } from "react-native";
import { useFitStore } from "../store/useFitStore";

export function EditorScreen() {
  const fit = useFitStore((s) => s.currentFit);
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ color: "white", fontSize: 18 }}>Fit Editor</Text>
      <Text style={{ color: "#9ea7c4", marginTop: 8 }}>{fit.name}</Text>
      <Text style={{ color: "#9ea7c4", marginTop: 8 }}>Search-first add/replace TODO in incremental UI passes.</Text>
    </View>
  );
}
