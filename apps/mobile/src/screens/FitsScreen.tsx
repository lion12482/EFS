import React, { useState, useCallback } from "react";
import { Text, View, FlatList, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { type Fit } from "@efs/core";
import { getFitsFromDb } from "../db/repository";
import { useFitStore } from "../store/useFitStore";

export function FitsScreen() {
  const [fits, setFits] = useState<(Fit & { isFavorite: boolean })[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigation = useNavigation<any>();
  const loadFit = useFitStore(s => s.loadFit);

  const loadFitsFromDb = useCallback(() => {
    try {
      const allFits = getFitsFromDb();
      setFits(allFits);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadFitsFromDb();
    }, [loadFitsFromDb])
  );

  const handleOpenFit = (id: string) => {
    loadFit(id);
    navigation.navigate("Editor");
  };

  const handleCreateNew = () => {
    loadFit(`new-${Date.now()}`, true);
    navigation.navigate("Editor");
  };

  const filteredFits = fits.filter(fit => {
    if (searchQuery && !fit.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Fits Library</Text>
        <TouchableOpacity style={styles.newButton} onPress={handleCreateNew}>
          <Text style={styles.newButtonText}>+ New</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Search fits..."
        placeholderTextColor="#666"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        data={filteredFits}
        keyExtractor={item => item.fitId}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => handleOpenFit(item.fitId)}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardSubtitle}>
              Hull ID: {item.hullTypeId} • {new Date(item.updatedAt).toLocaleDateString()}
              {item.isFavorite ? " • ★" : ""}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No fits found.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  title: { color: "white", fontSize: 24, fontWeight: "bold" },
  newButton: { backgroundColor: "#2563eb", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  newButtonText: { color: "white", fontWeight: "bold" },
  searchInput: { backgroundColor: "#1e293b", color: "white", padding: 12, borderRadius: 8, marginBottom: 16 },
  card: { backgroundColor: "#1e293b", padding: 16, borderRadius: 8, marginBottom: 8 },
  cardTitle: { color: "white", fontSize: 16, fontWeight: "600" },
  cardSubtitle: { color: "#9ea7c4", fontSize: 12, marginTop: 4 },
  emptyText: { color: "#9ea7c4", textAlign: "center", marginTop: 32 }
});
