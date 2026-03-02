import { API_BASE_URL } from "./config";

export async function getFit(id: string) {
  const res = await fetch(`${API_BASE_URL}/v1/fits/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export async function forkFit(id: string) {
  const res = await fetch(`${API_BASE_URL}/v1/fits/${id}/fork`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ name: "Web fork" })
  });
  if (!res.ok) throw new Error("Fork failed");
  return res.json();
}

export async function getFits(token: string, q?: string, hull?: string) {
  const url = new URL(`${API_BASE_URL}/v1/fits`);
  if (q) url.searchParams.set("q", q);
  if (hull) url.searchParams.set("hull", hull);

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: { "authorization": `Bearer ${token}` },
    cache: "no-store"
  });
  if (!res.ok) throw new Error("Failed to fetch fits");
  return res.json();
}
