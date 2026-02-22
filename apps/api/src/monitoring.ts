import { FastifyBaseLogger } from "fastify";
import { db } from "./db";

export function logAnalyticsEvent(eventName: string, payload: Record<string, unknown>, userId?: string) {
  db.prepare(
    "INSERT INTO analytics_events(event_name,user_id,payload_json,created_at) VALUES(?,?,?,?)"
  ).run(eventName, userId ?? null, JSON.stringify(payload), new Date().toISOString());
}

export function captureError(error: unknown, logger: FastifyBaseLogger, context: string) {
  const normalized = error instanceof Error ? error : new Error(String(error));
  logger.error({ err: normalized, context }, "Unhandled application error");
  db.prepare("INSERT INTO app_errors(context,message,stack,created_at) VALUES(?,?,?,?)").run(
    context,
    normalized.message,
    normalized.stack ?? null,
    new Date().toISOString()
  );
}
