import React from "react";
import { Text, View } from "react-native";
import { useCurrentStats } from "../store/useFitStore";

export function StatsScreen() {
  const stats = useCurrentStats();
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ color: "white", fontSize: 18 }}>Stats</Text>
      <Text style={{ color: "#9ea7c4" }}>CPU {stats.fitting.cpuUsed}/{stats.fitting.cpuMax}</Text>
      <Text style={{ color: "#9ea7c4" }}>PG {stats.fitting.powergridUsed}/{stats.fitting.powergridMax}</Text>
      <Text style={{ color: "#9ea7c4" }}>EHP {stats.ehp}</Text>
      <Text style={{ color: "#9ea7c4" }}>ISK {stats.isk.total.toLocaleString()}</Text>
    </View>
  );
}
