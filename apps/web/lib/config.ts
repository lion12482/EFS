const apiBase = process.env.API_BASE_URL ?? "http://localhost:4000";

if (!/^https?:\/\//.test(apiBase)) {
  throw new Error("API_BASE_URL must be an absolute http/https URL");
}

export const API_BASE_URL = apiBase;
export const AUTH_COOKIE = "efs_guest_token";
