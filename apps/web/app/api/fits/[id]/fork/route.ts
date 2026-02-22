import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { API_BASE_URL, AUTH_COOKIE } from "../../../../../lib/config";

export async function POST(_: Request, context: { params: Promise<{ id: string }> }) {
  const token = (await cookies()).get(AUTH_COOKIE)?.value;
  if (!token) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const response = await fetch(`${API_BASE_URL}/v1/fits/${id}/fork`, {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
    body: JSON.stringify({ name: "Web fork" })
  });

  if (!response.ok) {
    return NextResponse.json({ error: "fork_failed" }, { status: response.status });
  }

  const payload = await response.json();
  return NextResponse.json(payload, { status: 201 });
}
