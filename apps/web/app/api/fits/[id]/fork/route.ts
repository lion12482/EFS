import { NextResponse } from "next/server";
import { API_BASE_URL } from "../../../../../lib/config";

export async function POST(_: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const response = await fetch(`${API_BASE_URL}/v1/fits/${id}/fork`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ name: "Web fork" })
  });

  if (!response.ok) {
    return NextResponse.json({ error: "fork_failed" }, { status: response.status });
  }

  const payload = await response.json();
  return NextResponse.json(payload, { status: 201 });
}
