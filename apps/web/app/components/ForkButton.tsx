"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function ForkButton({ fitId }: { fitId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFork() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/fits/${fitId}/fork`, { method: "POST" });
      if (!response.ok) throw new Error("Unable to fork fit");
      const payload = (await response.json()) as { id: string };
      router.push(`/fit/${payload.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: "grid", gap: 8 }}>
      <button onClick={handleFork} disabled={loading} style={{ width: 150, padding: "8px 12px" }}>
        {loading ? "Forking..." : "Fork to edit"}
      </button>
      {error ? <small style={{ color: "#ff8080" }}>{error}</small> : null}
    </div>
  );
}
