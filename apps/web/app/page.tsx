"use client";

import { useState, useEffect } from "react";
import { getFits } from "../lib/api";

type SavedFit = {
  id: string;
  version: number;
  createdAt: string;
  fit: any;
};

type LocalFit = {
  id: string;
  name: string;
  hullTypeId: number;
  updatedAt: string;
};

export default function HomePage() {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("Click below to start a guest session.");
  const [fits, setFits] = useState<SavedFit[]>([]);
  const [localFits, setLocalFits] = useState<LocalFit[]>([]);
  const [search, setSearch] = useState("");
  const [hullFilter, setHullFilter] = useState("");

  const loadFits = async (currentToken: string, q?: string, hull?: string) => {
    try {
      const { fits } = await getFits(currentToken, q, hull);
      setFits(fits);
    } catch (e) {
      console.error(e);
      setStatus("Failed to load fits.");
    }
  };

  useEffect(() => {
    if (token) {
      loadFits(token, search, hullFilter);
    }
  }, [token, search, hullFilter]);

  useEffect(() => {
    // Load recently visited/local fits from localStorage
    try {
      const stored = localStorage.getItem("efs_recent_fits");
      if (stored) {
        setLocalFits(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load local fits", e);
    }
  }, []);

  async function startGuestSession() {
    setStatus("Starting guest session...");
    const res = await fetch("/api/auth/guest", { method: "POST" });
    if (!res.ok) {
      setStatus("Unable to create guest session");
      return;
    }
    const payload = (await res.json()) as { userId: string; token: string };
    setUserId(payload.userId);
    setToken(payload.token);
    setStatus("Guest session ready.");
  }

  const handleContinueLast = () => {
    if (fits.length > 0) {
      window.location.href = `/fit/${fits[0].id}`;
    } else if (localFits.length > 0) {
      window.location.href = `/fit/${localFits[0].id}`;
    }
  };

  return (
    <main style={{ padding: 24, display: "grid", gap: 24, maxWidth: "800px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <header>
        <h1 style={{ margin: "0 0 8px 0" }}>EFS Web Dashboard</h1>
        <p style={{ margin: 0, color: "#666" }}>Manage your fits and test settings.</p>
        <div style={{ marginTop: 12 }}>
          {!token ? (
            <button onClick={startGuestSession} style={{ padding: "8px 16px", background: "#2563eb", color: "white", border: "none", borderRadius: 4, cursor: "pointer" }}>
              Start Guest Session
            </button>
          ) : (
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <small style={{ padding: "4px 8px", background: "#e2e8f0", borderRadius: 4 }}>Signed in</small>
              <a href="/settings" style={{ color: "#2563eb", textDecoration: "none", fontSize: "14px" }}>Settings</a>
              {(fits.length > 0 || localFits.length > 0) && (
                <button onClick={handleContinueLast} style={{ padding: "6px 12px", background: "#10b981", color: "white", border: "none", borderRadius: 4, cursor: "pointer", marginLeft: "auto" }}>
                  Continue Last Fit
                </button>
              )}
            </div>
          )}
        </div>
        <small style={{ display: "block", marginTop: 8, color: "#666" }}>{status}</small>
      </header>

      {localFits.length > 0 && !token && (
        <section>
          <h2>Recent Fits (Local)</h2>
          <div style={{ display: "grid", gap: 12 }}>
            {localFits.map((f) => (
              <div key={f.id} style={{ padding: 16, border: "1px solid #e2e8f0", borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h3 style={{ margin: "0 0 4px 0" }}>{f.name}</h3>
                  <small style={{ color: "#666" }}>
                    Hull: {f.hullTypeId} • Local Edit • {new Date(f.updatedAt).toLocaleDateString()}
                  </small>
                </div>
                <a href={`/fit/${f.id}`} style={{ padding: "6px 16px", background: "#e2e8f0", color: "#334155", textDecoration: "none", borderRadius: 4, fontWeight: 500 }}>
                  Open
                </a>
              </div>
            ))}
          </div>
        </section>
      )}

      {token && (
        <section>
          <h2>Saved Fits</h2>
          <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            <input
              type="text"
              placeholder="Search fits..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ flex: 1, padding: "8px 12px", border: "1px solid #ccc", borderRadius: 4 }}
            />
            <input
              type="text"
              placeholder="Hull ID filter..."
              value={hullFilter}
              onChange={(e) => setHullFilter(e.target.value)}
              style={{ width: "150px", padding: "8px 12px", border: "1px solid #ccc", borderRadius: 4 }}
            />
          </div>

          <div style={{ display: "grid", gap: 12 }}>
            {fits.length === 0 ? (
              <p style={{ color: "#666", textAlign: "center", padding: 32, background: "#f8fafc", borderRadius: 8 }}>
                No fits found. Create or fork one to get started.
              </p>
            ) : (
              fits.map((f) => (
                <div key={f.id} style={{ padding: 16, border: "1px solid #e2e8f0", borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h3 style={{ margin: "0 0 4px 0" }}>{f.fit.name}</h3>
                    <small style={{ color: "#666" }}>
                      Hull: {f.fit.hullTypeId} • Version: {f.version} • {new Date(f.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                  <a href={`/fit/${f.id}`} style={{ padding: "6px 16px", background: "#e2e8f0", color: "#334155", textDecoration: "none", borderRadius: 4, fontWeight: 500 }}>
                    Open
                  </a>
                </div>
              ))
            )}
          </div>
        </section>
      )}
    </main>
  );
}
