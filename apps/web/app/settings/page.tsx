"use client";

import { useEffect, useState } from "react";

type Settings = {
  telemetryEnabled: boolean;
  defaultVisibility: "public" | "unlisted";
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({ telemetryEnabled: true, defaultVisibility: "unlisted" });
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    fetch("/api/settings")
      .then(async (res) => {
        if (!res.ok) throw new Error("Please start a guest session first.");
        const payload = (await res.json()) as Settings;
        setSettings(payload);
        setMessage("Settings loaded");
      })
      .catch((err) => setMessage(err.message));
  }, []);

  async function save() {
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(settings)
    });
    setMessage(res.ok ? "Settings saved" : "Failed to save settings");
  }

  return (
    <main style={{ padding: 24, display: "grid", gap: 12, maxWidth: 420 }}>
      <h1>Settings</h1>
      <label>
        <input
          type="checkbox"
          checked={settings.telemetryEnabled}
          onChange={(e) => setSettings((s) => ({ ...s, telemetryEnabled: e.target.checked }))}
        />{" "}
        Telemetry enabled
      </label>
      <label>
        Default visibility
        <select
          value={settings.defaultVisibility}
          onChange={(e) => setSettings((s) => ({ ...s, defaultVisibility: e.target.value as Settings["defaultVisibility"] }))}
        >
          <option value="unlisted">Unlisted</option>
          <option value="public">Public</option>
        </select>
      </label>
      <button onClick={save}>Save</button>
      <small>{message}</small>
    </main>
  );
}
