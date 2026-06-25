import type { ApiRegistry } from "./types";

/**
 * Conservative default rate limits for common APIs.
 *
 * These are intentionally cautious starting points, not exhaustive models.
 * Many APIs vary their limits by plan tier, endpoint, or use a cost-based
 * model that a single requests/interval pair cannot fully capture. Always
 * confirm against the linked `sourceUrl` for your specific plan, and override
 * via env vars or PacerOptions where you need something more precise.
 *
 * Keys are lowercase and kept in alphabetical order.
 */
export const apiRegistry: ApiRegistry = {
  // 5,000 requests/hour on the REST API, expressed here as the per-minute
  // average (5000 / 60 ≈ 83). GitHub enforces the cap hourly, so real burst
  // capacity is higher than this smoothed figure implies.
  github: {
    allowedRequests: 83,
    intervalMs: 60_000,
    sourceUrl:
      "https://docs.github.com/rest/using-the-rest-api/rate-limits-for-the-rest-api",
  },
  // REST Admin API leaky-bucket leak rate: 2/s on standard plans (Plus = 4/s).
  // The GraphQL Admin API uses a separate cost-based model entirely.
  shopify: {
    allowedRequests: 2,
    intervalMs: 1_000,
    sourceUrl: "https://shopify.dev/docs/api/usage/rate-limits",
  },
  // Limits are per-method and tiered (Tier 1 ~1/min through Tier 4 ~100+/min).
  // 50/min is a middle-of-the-road default; check the tier of the methods you call.
  slack: {
    allowedRequests: 50,
    intervalMs: 60_000,
    sourceUrl: "https://api.slack.com/docs/rate-limits",
  },
  // 100 read and 100 write operations/second in live mode (lower in test mode).
  stripe: {
    allowedRequests: 100,
    intervalMs: 1_000,
    sourceUrl: "https://docs.stripe.com/rate-limits",
  },
};
