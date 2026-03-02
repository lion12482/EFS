import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Modal, StyleSheet } from "react-native";
import type { Fit, SlotKind } from "@efs/core";
import { seedDataPack } from "@efs/datapack-seed";

interface HardwareBrowserModalProps {
    visible: boolean;
    onClose: () => void;
    activeSlotKind: SlotKind | null;
    onSelect: (typeId: number) => void;
    onClear: () => void;
}

export function HardwareBrowserModal({ visible, onClose, activeSlotKind, onSelect, onClear }: HardwareBrowserModalProps) {
    if (!activeSlotKind) return null;

    const availableModules = Object.values(seedDataPack.items).filter(
        (item) => item.group === "module" && item.slot === activeSlotKind
    );

    return (
        <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Select {activeSlotKind} Module</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.moduleList}>
                        <TouchableOpacity style={styles.clearSlotItem} onPress={onClear}>
                            <Text style={styles.clearSlotText}>Clear Slot</Text>
                        </TouchableOpacity>

                        {availableModules.length === 0 && (
                            <Text style={styles.emptyText}>No modules found for {activeSlotKind} slot.</Text>
                        )}

                        {availableModules.map((mod) => (
                            <TouchableOpacity
                                key={mod.typeId}
                                style={styles.moduleItem}
                                onPress={() => onSelect(mod.typeId)}
                            >
                                <Text style={styles.moduleName}>{mod.name}</Text>
                                <Text style={styles.moduleStats}>CPU: {mod.cpu || 0} PG: {mod.powergrid || 0}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "flex-end",
    },
    modalContent: {
        backgroundColor: "#1e293b",
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        height: "75%",
        padding: 16,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#334155",
        paddingBottom: 16,
    },
    modalTitle: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
        textTransform: "capitalize",
    },
    closeButton: {
        padding: 8,
    },
    closeButtonText: {
        color: "#60a5fa",
        fontSize: 16,
    },
    moduleList: {
        flex: 1,
    },
    moduleItem: {
        padding: 16,
        backgroundColor: "#334155",
        borderRadius: 8,
        marginBottom: 8,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    moduleName: {
        color: "white",
        fontSize: 16,
    },
    moduleStats: {
        color: "#94a3b8",
        fontSize: 12,
    },
    clearSlotItem: {
        padding: 16,
        backgroundColor: "rgba(220, 38, 38, 0.2)",
        borderRadius: 8,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "rgba(220, 38, 38, 0.5)",
    },
    clearSlotText: {
        color: "#f87171",
        fontSize: 16,
        textAlign: "center",
        fontWeight: "bold",
    },
    emptyText: {
        color: "#94a3b8",
        textAlign: "center",
        marginTop: 24,
    }
});
