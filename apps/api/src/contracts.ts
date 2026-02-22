import { z } from "zod";

export const createFitBody = z.object({
  fit: z.any(),
  visibility: z.enum(["public", "unlisted"]).default("unlisted")
});

export const batchPricesBody = z.object({ typeIds: z.array(z.number().int()).min(1) });

export const settingsBody = z.object({
  telemetryEnabled: z.boolean().default(true),
  defaultVisibility: z.enum(["public", "unlisted"]).default("unlisted")
});

export const settingsResponse = settingsBody.extend({
  userId: z.string(),
  updatedAt: z.string()
});

export const authGuestResponse = z.object({
  userId: z.string(),
  token: z.string()
});

// v1 obvious extensions: named presets and user profile metadata.
export const settingsV1Extension = z.object({
  profileName: z.string().min(1).optional(),
  preferredHullTypeId: z.number().int().optional()
});
