import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { API_BASE_URL, AUTH_COOKIE } from "../../../../lib/config";

export async function POST() {
  const response = await fetch(`${API_BASE_URL}/v1/auth/guest`, { method: "POST" });
  if (!response.ok) {
    return NextResponse.json({ error: "auth_failed" }, { status: 500 });
  }

  const payload = (await response.json()) as { token: string; userId: string };
  const store = await cookies();
  store.set(AUTH_COOKIE, payload.token, { httpOnly: true, sameSite: "lax", secure: false, path: "/" });

  return NextResponse.json({ userId: payload.userId }, { status: 201 });
}
