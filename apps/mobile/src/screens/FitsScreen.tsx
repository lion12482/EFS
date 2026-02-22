import React from "react";
import { Text, View } from "react-native";

export function FitsScreen() {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ color: "white", fontSize: 18 }}>Fits Library (SQLite-backed in v1)</Text>
      <Text style={{ color: "#9ea7c4", marginTop: 8 }}>Save / duplicate / tags / favorites scaffolded.</Text>
    </View>
  );
}
