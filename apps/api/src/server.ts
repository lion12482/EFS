import { randomUUID } from "node:crypto";
import Fastify from "fastify";
import { FIT_SCHEMA_V1, computeFitStats, deserializeFit, serializeFit, type Fit } from "@efs/core";
import { seedDataPack } from "@efs/datapack-seed";
import { db } from "./db";
import { env } from "./config";
import { authGuestResponse, batchPricesBody, createFitBody, settingsBody } from "./contracts";
import { captureError, logAnalyticsEvent } from "./monitoring";

const app = Fastify({ logger: true });

type AuthContext = { userId: string; token: string };

function getAuth(req: { headers: Record<string, unknown> }): AuthContext | null {
  const raw = req.headers.authorization;
  if (typeof raw !== "string" || !raw.startsWith("Bearer ")) return null;
  const token = raw.slice("Bearer ".length);
  const session = db.prepare("SELECT user_id FROM user_sessions WHERE token = ?").get(token) as
    | { user_id: string }
    | undefined;
  if (!session) return null;
  return { userId: session.user_id, token };
}

function requireAuth(req: { headers: Record<string, unknown> }, reply: { code: (n: number) => any }) {
  const auth = getAuth(req);
  if (!auth) {
    reply.code(401).send({ error: "unauthorized" });
    return null;
  }
  return auth;
}

function isValidFitPayload(input: unknown): input is Fit {
  if (!input || typeof input !== "object") return false;
  const candidate = input as Partial<Fit>;
  return (
    candidate.schemaVersion === FIT_SCHEMA_V1 &&
    typeof candidate.fitId === "string" &&
    typeof candidate.hullTypeId === "number" &&
    !!candidate.slots
  );
}

app.post("/v1/auth/guest", (_req, reply) => {
  const userId = randomUUID();
  const token = randomUUID();
  const now = new Date().toISOString();
  db.prepare("INSERT INTO users(id,created_at) VALUES(?,?)").run(userId, now);
  db.prepare("INSERT INTO user_sessions(token,user_id,created_at) VALUES(?,?,?)").run(token, userId, now);
  logAnalyticsEvent("auth_guest_created", { source: "web" }, userId);
  reply.code(201).send(authGuestResponse.parse({ userId, token }));
});

app.post("/v1/fits", (req, reply) => {
  try {
    const auth = requireAuth(req, reply);
    if (!auth) return;
    const parsed = createFitBody.parse(req.body);
    if (!isValidFitPayload(parsed.fit)) {
      return reply.code(400).send({ error: "invalid_fit_payload" });
    }
    const fit = parsed.fit;
    const id = fit.fitId;
    const now = new Date().toISOString();
    db.prepare(
      "INSERT INTO shared_fits(id,parent_id,version,visibility,fit_json,created_at,owner_user_id) VALUES(?,?,?,?,?,?,?)"
    ).run(id, null, 1, parsed.visibility, serializeFit(fit), now, auth.userId);
    logAnalyticsEvent("fit_created", { fitId: id, visibility: parsed.visibility }, auth.userId);
    reply.code(201).send({ id, version: 1, url: `${env.WEB_BASE_URL}/fit/${id}` });
  } catch (error) {
    captureError(error, app.log, "POST /v1/fits");
    return reply.code(500).send({ error: "internal_error" });
  }
});

app.get("/v1/fits/:id", (req, reply) => {
  try {
    const id = (req.params as { id: string }).id;
    const row = db.prepare("SELECT * FROM shared_fits WHERE id = ?").get(id) as any;
    if (!row) return reply.code(404).send({ error: "not_found" });
    const fit = deserializeFit(row.fit_json);
    return {
      id: row.id,
      parentId: row.parent_id,
      version: row.version,
      visibility: row.visibility,
      fit,
      stats: computeFitStats(fit, seedDataPack)
    };
  } catch (error) {
    captureError(error, app.log, "GET /v1/fits/:id");
    return reply.code(500).send({ error: "internal_error" });
  }
});

app.post("/v1/fits/:id/fork", (req, reply) => {
  try {
    const auth = requireAuth(req, reply);
    if (!auth) return;
    const id = (req.params as { id: string }).id;
    const src = db.prepare("SELECT * FROM shared_fits WHERE id = ?").get(id) as any;
    if (!src) return reply.code(404).send({ error: "not_found" });
    const fit = deserializeFit(src.fit_json);
    fit.fitId = randomUUID();
    fit.createdAt = new Date().toISOString();
    fit.updatedAt = fit.createdAt;
    db.prepare(
      "INSERT INTO shared_fits(id,parent_id,version,visibility,fit_json,created_at,owner_user_id) VALUES(?,?,?,?,?,?,?)"
    ).run(fit.fitId, id, 1, src.visibility, serializeFit(fit), fit.createdAt, auth.userId);
    logAnalyticsEvent("fit_forked", { sourceFitId: id, fitId: fit.fitId }, auth.userId);
    reply.code(201).send({ id: fit.fitId, parentId: id, version: 1, url: `${env.WEB_BASE_URL}/fit/${fit.fitId}` });
  } catch (error) {
    captureError(error, app.log, "POST /v1/fits/:id/fork");
    return reply.code(500).send({ error: "internal_error" });
  }
});

app.get("/v1/settings", (req, reply) => {
  const auth = requireAuth(req, reply);
  if (!auth) return;
  const row = db.prepare("SELECT * FROM user_settings WHERE user_id = ?").get(auth.userId) as any;
  if (!row) {
    return { userId: auth.userId, telemetryEnabled: true, defaultVisibility: "unlisted", updatedAt: new Date().toISOString() };
  }
  return {
    userId: auth.userId,
    telemetryEnabled: Boolean(row.telemetry_enabled),
    defaultVisibility: row.default_visibility,
    updatedAt: row.updated_at
  };
});

app.put("/v1/settings", (req, reply) => {
  const auth = requireAuth(req, reply);
  if (!auth) return;
  const body = settingsBody.parse(req.body);
  const now = new Date().toISOString();
  db.prepare(
    "INSERT INTO user_settings(user_id,telemetry_enabled,default_visibility,updated_at) VALUES(?,?,?,?) ON CONFLICT(user_id) DO UPDATE SET telemetry_enabled=excluded.telemetry_enabled, default_visibility=excluded.default_visibility, updated_at=excluded.updated_at"
  ).run(auth.userId, body.telemetryEnabled ? 1 : 0, body.defaultVisibility, now);
  logAnalyticsEvent("settings_updated", body, auth.userId);
  return { userId: auth.userId, ...body, updatedAt: now };
});

app.post("/v1/prices/batch", (req, reply) => {
  try {
    const { typeIds } = batchPricesBody.parse(req.body);
    const now = new Date();
    const ttlMs = 6 * 60 * 60 * 1000;
    const items = typeIds.map((typeId) => {
      const cached = db.prepare("SELECT * FROM prices WHERE type_id = ?").get(typeId) as any;
      const stale = !cached || now.getTime() - new Date(cached.updated_at).getTime() > ttlMs;
      const upstreamPrice = seedDataPack.items[typeId]?.price ?? 0;
      if (stale) {
        db.prepare(
          "INSERT INTO prices(type_id,price,source,updated_at) VALUES(?,?,?,?) ON CONFLICT(type_id) DO UPDATE SET price=excluded.price, source=excluded.source, updated_at=excluded.updated_at"
        ).run(typeId, upstreamPrice, "stub-hub", now.toISOString());
      }
      const latest = db.prepare("SELECT * FROM prices WHERE type_id = ?").get(typeId) as any;
      return {
        typeId,
        price: latest?.price ?? upstreamPrice,
        currency: "ISK",
        source: latest?.source ?? "stub-hub",
        stale
      };
    });
    logAnalyticsEvent("prices_batch_requested", { count: typeIds.length });
    return { asOf: now.toISOString(), items };
  } catch (error) {
    captureError(error, app.log, "POST /v1/prices/batch");
    return reply.code(500).send({ error: "internal_error" });
  }
});

app.listen({ port: env.PORT, host: "0.0.0.0" }).catch((error) => {
  captureError(error, app.log, "startup");
  process.exit(1);
});
