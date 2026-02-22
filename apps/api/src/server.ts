import { randomUUID } from "node:crypto";
import Fastify from "fastify";
import { z } from "zod";
import { FIT_SCHEMA_V1, computeFitStats, deserializeFit, serializeFit, type Fit } from "@efs/core";
import { seedDataPack } from "@efs/datapack-seed";
import { db } from "./db";

const app = Fastify({ logger: true });
const port = Number(process.env.PORT ?? 4000);

const createFitBody = z.object({
  fit: z.any(),
  visibility: z.enum(["public", "unlisted"]).default("unlisted")
});

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

app.post("/v1/fits", (req, reply) => {
  const parsed = createFitBody.parse(req.body);
  if (!isValidFitPayload(parsed.fit)) {
    return reply.code(400).send({ error: "invalid_fit_payload" });
  }
  const fit = parsed.fit;
  const id = fit.fitId;
  const now = new Date().toISOString();
  db.prepare(
    "INSERT INTO shared_fits(id,parent_id,version,visibility,fit_json,created_at) VALUES(?,?,?,?,?,?)"
  ).run(id, null, 1, parsed.visibility, serializeFit(fit), now);
  reply.code(201).send({ id, version: 1, url: `http://localhost:3000/fit/${id}` });
});

app.get("/v1/fits/:id", (req, reply) => {
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
});

app.post("/v1/fits/:id/fork", (req, reply) => {
  const id = (req.params as { id: string }).id;
  const src = db.prepare("SELECT * FROM shared_fits WHERE id = ?").get(id) as any;
  if (!src) return reply.code(404).send({ error: "not_found" });
  const fit = deserializeFit(src.fit_json);
  fit.fitId = randomUUID();
  fit.createdAt = new Date().toISOString();
  fit.updatedAt = fit.createdAt;
  db.prepare(
    "INSERT INTO shared_fits(id,parent_id,version,visibility,fit_json,created_at) VALUES(?,?,?,?,?,?)"
  ).run(fit.fitId, id, 1, src.visibility, serializeFit(fit), fit.createdAt);
  reply
    .code(201)
    .send({ id: fit.fitId, parentId: id, version: 1, url: `http://localhost:3000/fit/${fit.fitId}` });
});

const batchPricesBody = z.object({ typeIds: z.array(z.number().int()).min(1) });
app.post("/v1/prices/batch", (req) => {
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
  return { asOf: now.toISOString(), items };
});

app.listen({ port, host: "0.0.0.0" }).catch((err) => {
  app.log.error(err);
  process.exit(1);
});
