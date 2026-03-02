"use client";

import { useState, useEffect } from "react";
import type { Fit, ItemDefinition, SlotKind } from "@efs/core";
import { seedDataPack } from "@efs/datapack-seed";

export function FitEditor({ initialFit, initialStats }: { initialFit: Fit, initialStats: any }) {
    const [fit, setFit] = useState<Fit>(initialFit);
    const [stats, setStats] = useState(initialStats);

    useEffect(() => {
        let cpu = 0;
        let pg = 0;
        const processSlot = (kind: SlotKind) => {
            for (const item of (fit.slots[kind] || [])) {
                const itemDef = seedDataPack.items[item.typeId];
                if (itemDef && itemDef.group === "module") {
                    cpu += itemDef.cpu || 0;
                    pg += itemDef.powergrid || 0;
                }
            }
        };
        processSlot("high");
        processSlot("mid");
        processSlot("low");
        processSlot("rig");

        setStats((prev: any) => ({
            ...prev,
            fitting: { ...prev.fitting, cpuUsed: cpu, powergridUsed: pg }
        }));
    }, [fit]);

    const hull = seedDataPack.items[fit.hullTypeId];
    if (!hull || hull.group !== "ship") return <div>Invalid Hull</div>;

    const layout = hull.slotLayout || { high: 0, mid: 0, low: 0, rig: 0, droneBay: 0 };
    const maxSlots = { high: 8, mid: 8, low: 8, rig: 3 };

    const [activeSlot, setActiveSlot] = useState<{ kind: SlotKind, index: number } | null>(null);

    // Filter modules based on active slot constraint
    const availableModules = Object.values(seedDataPack.items).filter(
        (item) => item.group === "module" && item.slot === activeSlot?.kind
    );

    const handleSlotClick = (kind: SlotKind, index: number) => {
        setActiveSlot({ kind, index });
    };

    const handleEquip = async (typeId: number) => {
        if (!activeSlot) return;

        // In a real app we'd mutate the fit and recalculate stats via the core engine.
        // For now we mutate local state to show it visually.
        const newFit = { ...fit, slots: { ...fit.slots } };
        const currentSlots = [...(newFit.slots[activeSlot.kind] || [])];

        // Ensure array is large enough
        while (currentSlots.length <= activeSlot.index) {
            currentSlots.push({ typeId: 0 }); // 0 means empty, though we should probably use a better representation
        }

        currentSlots[activeSlot.index] = { typeId, state: "online" };

        // Clean up trailing empty slots (0)
        // while (currentSlots.length > 0 && currentSlots[currentSlots.length - 1].typeId === 0) {
        //   currentSlots.pop();
        // }

        newFit.slots[activeSlot.kind] = currentSlots.filter(s => s.typeId !== 0);

        setFit(newFit);
        setActiveSlot(null);

        // Call API to save or simulate? MVP: just save to localStorage for continuity.
        const recentFits = JSON.parse(localStorage.getItem("efs_recent_fits") || "[]");
        const existingIdx = recentFits.findIndex((f: any) => f.id === fit.fitId);
        const localMeta = { id: fit.fitId, name: fit.name, hullTypeId: fit.hullTypeId, updatedAt: new Date().toISOString() };
        if (existingIdx >= 0) {
            recentFits[existingIdx] = localMeta;
        } else {
            recentFits.unshift(localMeta);
        }
        localStorage.setItem("efs_recent_fits", JSON.stringify(recentFits.slice(0, 10)));
    };

    const handleEmpty = () => {
        if (!activeSlot) return;
        const newFit = { ...fit, slots: { ...fit.slots } };
        const currentSlots = [...(newFit.slots[activeSlot.kind] || [])];
        if (currentSlots[activeSlot.index]) {
            currentSlots.splice(activeSlot.index, 1);
            newFit.slots[activeSlot.kind] = currentSlots;
            setFit(newFit);
        }
        setActiveSlot(null);
    }

    const renderSlotGroup = (kind: SlotKind, count: number) => {
        const fitted = fit.slots[kind] || [];
        const slots = [];
        for (let i = 0; i < maxSlots[kind]; i++) {
            if (i >= count) break; // Hull doesn't support this many slots
            const item = fitted[i];
            const itemDef = item ? seedDataPack.items[item.typeId] : null;
            slots.push(
                <div
                    key={i}
                    onClick={() => handleSlotClick(kind, i)}
                    style={{
                        padding: 8,
                        border: "1px dashed #cbd5e1",
                        borderRadius: 4,
                        cursor: "pointer",
                        background: itemDef ? "#f8fafc" : "transparent",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        minHeight: 40
                    }}
                >
                    <div style={{ width: 24, height: 24, background: "#e2e8f0", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>
                        {itemDef ? "⚙️" : "+"}
                    </div>
                    <span style={{ fontSize: 14, color: itemDef ? "#0f172a" : "#94a3b8" }}>
                        {itemDef ? itemDef.name : `Empty ${kind} slot`}
                    </span>
                </div>
            );
        }
        return (
            <div style={{ marginBottom: 24 }}>
                <h3 style={{ textTransform: "capitalize", fontSize: 16, marginBottom: 8, color: "#475569" }}>{kind} Slots ({fitted.length}/{count})</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {slots}
                </div>
            </div>
        );
    };

    return (
        <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
            {/* Fitting Layout Engine */}
            <div style={{ flex: 1, minWidth: 300 }}>
                {renderSlotGroup("high", layout.high)}
                {renderSlotGroup("mid", layout.mid)}
                {renderSlotGroup("low", layout.low)}
                {renderSlotGroup("rig", layout.rig)}
            </div>

            {/* Stats Panel */}
            <div style={{ width: 300, padding: 16, background: "#f8fafc", borderRadius: 8, border: "1px solid #e2e8f0" }}>
                <h3 style={{ margin: "0 0 16px 0" }}>Simulation Stats</h3>
                <div style={{ display: "grid", gap: 8, fontSize: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "#64748b" }}>CPU</span>
                        <span style={{ fontWeight: 500, color: stats.fitting.cpuUsed > stats.fitting.cpuMax ? "#ef4444" : "inherit" }}>
                            {stats.fitting.cpuUsed.toFixed(1)} / {stats.fitting.cpuMax.toFixed(1)}
                        </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "#64748b" }}>Powergrid</span>
                        <span style={{ fontWeight: 500, color: stats.fitting.powergridUsed > stats.fitting.powergridMax ? "#ef4444" : "inherit" }}>
                            {stats.fitting.powergridUsed.toFixed(1)} / {stats.fitting.powergridMax.toFixed(1)}
                        </span>
                    </div>
                    <hr style={{ border: "none", borderTop: "1px solid #e2e8f0", margin: "8px 0" }} />
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "#64748b" }}>Effective HP</span>
                        <span style={{ fontWeight: 500 }}>{stats.ehp.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {/* Hardware Browser Modal */}
            {activeSlot && (
                <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ background: "white", padding: 24, borderRadius: 8, width: 400, maxHeight: "80vh", overflowY: "auto" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                            <h2 style={{ margin: 0, textTransform: "capitalize" }}>Select {activeSlot.kind} Module</h2>
                            <button onClick={() => setActiveSlot(null)} style={{ border: "none", background: "none", cursor: "pointer", fontSize: 20 }}>×</button>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            <button
                                onClick={handleEmpty}
                                style={{ padding: 12, textAlign: "left", background: "#fef2f2", color: "#b91c1c", border: "1px solid #fecaca", borderRadius: 4, cursor: "pointer" }}
                            >
                                Clear Slot
                            </button>
                            {availableModules.length === 0 ? (
                                <p style={{ color: "#64748b", textAlign: "center", padding: 24 }}>No modules match this slot.</p>
                            ) : (
                                availableModules.map(mod => (
                                    <button
                                        key={mod.typeId}
                                        onClick={() => handleEquip(mod.typeId)}
                                        style={{ padding: 12, textAlign: "left", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 4, cursor: "pointer", display: "flex", justifyContent: "space-between" }}
                                    >
                                        <span>{mod.name}</span>
                                        <span style={{ color: "#64748b", fontSize: 12 }}>CPU: {mod.cpu || 0} PG: {mod.powergrid || 0}</span>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
