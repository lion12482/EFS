import React from "react";
import { Text, View } from "react-native";

export function SettingsScreen() {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ color: "white", fontSize: 18 }}>Settings</Text>
      <Text style={{ color: "#9ea7c4" }}>Datapack update checks + ESI login hooks planned.</Text>
    </View>
  );
}
