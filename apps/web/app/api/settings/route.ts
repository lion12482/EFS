import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { API_BASE_URL, AUTH_COOKIE } from "../../../lib/config";

function unauthorized() {
  return NextResponse.json({ error: "unauthorized" }, { status: 401 });
}

export async function GET() {
  const token = (await cookies()).get(AUTH_COOKIE)?.value;
  if (!token) return unauthorized();

  const response = await fetch(`${API_BASE_URL}/v1/settings`, {
    headers: { authorization: `Bearer ${token}` },
    cache: "no-store"
  });
  return NextResponse.json(await response.json(), { status: response.status });
}

export async function PUT(req: Request) {
  const token = (await cookies()).get(AUTH_COOKIE)?.value;
  if (!token) return unauthorized();

  const response = await fetch(`${API_BASE_URL}/v1/settings`, {
    method: "PUT",
    headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
    body: await req.text()
  });

  return NextResponse.json(await response.json(), { status: response.status });
}
