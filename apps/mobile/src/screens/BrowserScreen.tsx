import React from "react";
import { Text, View } from "react-native";

export function BrowserScreen() {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ color: "white", fontSize: 18 }}>Browser</Text>
      <Text style={{ color: "#9ea7c4" }}>Shared URLs and import entrypoint.</Text>
    </View>
  );
}
