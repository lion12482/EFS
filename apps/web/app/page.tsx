"use client";

import { useState } from "react";

export default function HomePage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("Click below to start a guest session.");

  async function startGuestSession() {
    setStatus("Starting guest session...");
    const res = await fetch("/api/auth/guest", { method: "POST" });
    if (!res.ok) {
      setStatus("Unable to create guest session");
      return;
    }
    const payload = (await res.json()) as { userId: string };
    setUserId(payload.userId);
    setStatus("Guest session ready. Open an existing fit and fork it.");
  }

  return (
    <main style={{ padding: 24, display: "grid", gap: 12 }}>
      <h1>EFS Web MVP</h1>
      <p>Core flow: authenticate, fork a fit, review results, tune settings.</p>
      <button onClick={startGuestSession} style={{ width: 220, padding: "8px 12px" }}>
        Start Guest Session
      </button>
      <small>{status}</small>
      {userId ? <small>Signed in as {userId}</small> : null}
      <a href="/settings">Open Settings</a>
    </main>
  );
}
