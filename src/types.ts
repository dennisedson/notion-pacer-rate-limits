export interface RateLimitConfig {
  allowedRequests: number;
  intervalMs: number;
  /** Helpful for contributors to link to official API docs */
  sourceUrl?: string;
}

export type ApiRegistry = Record<string, RateLimitConfig>;

export interface PacerOptions {
  /** Fallback allowed requests if the target service is not found */
  fallbackRequests?: number;
  /** Fallback interval in ms if the target service is not found */
  fallbackIntervalMs?: number;
  /** Prefix for env-variable overrides, e.g. PACER_SHOPIFY_REQUESTS. Defaults to "PACER". */
  envPrefix?: string;
}
