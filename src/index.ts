import type { Worker } from "@notionhq/workers";
import { apiRegistry } from "./registry";
import type { PacerOptions, RateLimitConfig } from "./types";

export { apiRegistry } from "./registry";
export { validateRegistry } from "./validate";
export type { ValidationResult } from "./validate";
export * from "./types";

function parseEnvInt(value: string | undefined): number | undefined {
  if (value === undefined) return undefined;
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) ? undefined : parsed;
}

/**
 * Resolves the effective rate-limit config for a service.
 *
 * Precedence is applied per-field, so a partial override never clobbers the
 * other field:
 *   1. Env var override (PACER_<SERVICE>_REQUESTS / _INTERVAL)
 *   2. Registry entry for the service
 *   3. Caller-supplied fallback (defaults: 1 request / 1000ms)
 */
export function resolveRateLimit(
  serviceName: string,
  options: PacerOptions = {}
): RateLimitConfig {
  const normalizedKey = serviceName.toLowerCase();
  const prefix = options.envPrefix ?? "PACER";
  const envName = serviceName.toUpperCase();

  const envRequests = parseEnvInt(process.env[`${prefix}_${envName}_REQUESTS`]);
  const envInterval = parseEnvInt(process.env[`${prefix}_${envName}_INTERVAL`]);

  const registryConfig = apiRegistry[normalizedKey];

  const allowedRequests =
    envRequests ??
    registryConfig?.allowedRequests ??
    options.fallbackRequests ??
    1;

  const intervalMs =
    envInterval ??
    registryConfig?.intervalMs ??
    options.fallbackIntervalMs ??
    1_000;

  return { allowedRequests, intervalMs };
}

/**
 * Dynamically resolves and creates a Notion Worker pacer for a given service.
 *
 * Note: creating the pacer does not throttle anything on its own. Call
 * `await pacer.wait()` before each outbound request to enforce the limit.
 */
export function createDynamicPacer(
  worker: Worker,
  serviceName: string,
  options: PacerOptions = {}
) {
  const normalizedKey = serviceName.toLowerCase();
  const { allowedRequests, intervalMs } = resolveRateLimit(
    serviceName,
    options
  );

  return worker.pacer(`${normalizedKey}Pacer`, {
    allowedRequests,
    intervalMs,
  });
}
