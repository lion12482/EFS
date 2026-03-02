import { FitEditor } from "../components/FitEditor";
import { seedDataPack } from "@efs/datapack-seed";
import type { Fit } from "@efs/core";

export default function TestFitPage() {
    // Create a dummy Kestrel fit based on the seed data
    const dummyFit: Fit = {
        fitId: "test-fit-1",
        name: "Test Kestrel",
        hullTypeId: 603, // Kestrel from seedDataPack
        slots: {
            high: [
                { typeId: 10631, state: "online" } // Rocket Launcher I
            ],
            mid: [],
            low: [],
            rig: []
        }
    };

    const dummyStats = {
        ehp: 1250,
        fitting: {
            cpuUsed: 18,
            cpuMax: 190,
            powergridUsed: 3,
            powergridMax: 38
        }
    };

    return (
        <main style={{ padding: 24, maxWidth: 1200, margin: "0 auto", fontFamily: "sans-serif" }}>
            <h1>Temporary Fit Testing Page</h1>
            <p style={{ marginBottom: 32 }}>Use this page to test the interactive slot assignment and hardware browser.</p>

            <div style={{ border: "1px solid #e2e8f0", padding: 24, borderRadius: 8, background: "white" }}>
                <FitEditor initialFit={dummyFit} initialStats={dummyStats} />
            </div>
        </main>
    );
}
