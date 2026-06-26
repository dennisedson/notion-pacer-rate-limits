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
  // 5 requests/second per base (plus a 50/s cap across a token's traffic).
  airtable: {
    allowedRequests: 5,
    intervalMs: 1_000,
    sourceUrl: "https://airtable.com/developers/web/api/rate-limits",
  },
  // Tier 1 default of 50 requests/minute; scales up by usage tier, and
  // separate input/output token-per-minute limits also apply.
  anthropic: {
    allowedRequests: 50,
    intervalMs: 60_000,
    sourceUrl: "https://platform.claude.com/docs/en/api/rate-limits",
  },
  // Free-domain limit of 150/minute; paid domains get 1500/min, and some
  // endpoints (e.g. search at 60/min) are stricter.
  asana: {
    allowedRequests: 150,
    intervalMs: 60_000,
    sourceUrl: "https://developers.asana.com/docs/rate-limits",
  },
  // 60/minute on Free/Standard/Teams; Enterprise gets 120/min.
  calendly: {
    allowedRequests: 60,
    intervalMs: 60_000,
    sourceUrl:
      "https://developer.calendly.com/api-docs/edca8074633f8-api-rate-limits",
  },
  // 100/minute per token on Free/Unlimited/Business; higher on Business Plus
  // (1000/min) and Enterprise (10000/min).
  clickup: {
    allowedRequests: 100,
    intervalMs: 60_000,
    sourceUrl: "https://developer.clickup.com/docs/rate-limits",
  },
  // Global 1200 requests per 5-minute window per user, cumulative across
  // dashboard, API key, and token; some product APIs are stricter.
  cloudflare: {
    allowedRequests: 1_200,
    intervalMs: 300_000,
    sourceUrl:
      "https://developers.cloudflare.com/fundamentals/api/reference/limits/",
  },
  // Global 50 requests/second for a bot, independent of stricter per-route
  // limits; interaction endpoints are exempt.
  discord: {
    allowedRequests: 50,
    intervalMs: 1_000,
    sourceUrl: "https://docs.discord.com/developers/topics/rate-limits",
  },
  // 5,000 requests/hour on the REST API, expressed here as the per-minute
  // average (5000 / 60 ≈ 83). GitHub enforces the cap hourly, so real burst
  // capacity is higher than this smoothed figure implies.
  github: {
    allowedRequests: 83,
    intervalMs: 60_000,
    sourceUrl:
      "https://docs.github.com/rest/using-the-rest-api/rate-limits-for-the-rest-api",
  },
  // GitLab.com authenticated API: 2000 requests/minute per user. Self-managed
  // instances are configurable; some endpoints have lower limits.
  gitlab: {
    allowedRequests: 2_000,
    intervalMs: 60_000,
    sourceUrl:
      "https://docs.gitlab.com/user/gitlab_com/#rate-limits-on-gitlabcom",
  },
  // Per-user-per-project quota of 600/minute (per-project cap is 10000/min).
  googlecalendar: {
    allowedRequests: 600,
    intervalMs: 60_000,
    sourceUrl:
      "https://developers.google.com/workspace/calendar/api/guides/quota",
  },
  // Free/Starter private-app burst of 100 per 10 seconds; Pro/Enterprise get
  // 190/10s, the Search API is 5/s, and daily caps apply by tier.
  hubspot: {
    allowedRequests: 100,
    intervalMs: 10_000,
    sourceUrl:
      "https://developers.hubspot.com/docs/guides/apps/api-usage/usage-details",
  },
  // Default app-level limit of 10000 calls/minute (per-workspace cap is
  // 25000/min); can be raised on request.
  intercom: {
    allowedRequests: 10_000,
    intervalMs: 60_000,
    sourceUrl:
      "https://developers.intercom.com/docs/references/rest-api/errors/rate-limiting",
  },
  // 2500 requests/hour for API keys. The GraphQL API also enforces a
  // query-complexity budget, which often binds before the request count.
  linear: {
    allowedRequests: 2_500,
    intervalMs: 3_600_000,
    sourceUrl: "https://linear.app/developers/rate-limiting",
  },
  // No published per-second request rate; the documented constraint is 10
  // simultaneous connections per API key, interpreted here as 10/s.
  mailchimp: {
    allowedRequests: 10,
    intervalMs: 1_000,
    sourceUrl: "https://mailchimp.com/developer/marketing/docs/fundamentals/",
  },
  // Documented average of 3 requests/second per integration, with some bursts
  // allowed. Notion may add plan-specific limits later.
  notion: {
    allowedRequests: 3,
    intervalMs: 1_000,
    sourceUrl: "https://developers.notion.com/reference/request-limits",
  },
  // Conservative Tier 1 default of 500 requests/minute for GPT-4o-class
  // models; varies by usage tier and model, higher tiers reach 10000+/min.
  openai: {
    allowedRequests: 500,
    intervalMs: 60_000,
    sourceUrl: "https://developers.openai.com/api/docs/guides/rate-limits",
  },
  // Free Weather API tier: 60 calls/minute (and 1,000,000/month); paid plans
  // raise this substantially.
  openweather: {
    allowedRequests: 60,
    intervalMs: 60_000,
    sourceUrl: "https://openweathermap.org/price",
  },
  // Default 5 requests/second per team (shared across API keys); can be raised
  // for trusted senders, and separate email quotas apply by plan.
  resend: {
    allowedRequests: 5,
    intervalMs: 1_000,
    sourceUrl: "https://resend.com/docs/api-reference/rate-limit",
  },
  // Salesforce uses a per-org 24-hour call allocation rather than a per-second
  // rate; 100,000/24h is a conservative paid-edition floor that scales with
  // licenses (Developer Edition is 15,000/24h).
  salesforce: {
    allowedRequests: 100_000,
    intervalMs: 86_400_000,
    sourceUrl:
      "https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/resources_limits.htm",
  },
  // v3 Mail Send endpoint request rate; separate plan-based volume limits
  // govern how many emails you can actually send.
  sendgrid: {
    allowedRequests: 10_000,
    intervalMs: 1_000,
    sourceUrl:
      "https://www.twilio.com/docs/sendgrid/for-developers/sending-email/v3-mail-send-faq",
  },
  // Sentry publishes no universal limit — it's per caller+endpoint and
  // returned in X-Sentry-Rate-Limit-* headers. 40/s is a conservative default;
  // read the response headers at runtime for the real value.
  sentry: {
    allowedRequests: 40,
    intervalMs: 1_000,
    sourceUrl: "https://docs.sentry.io/api/ratelimits/",
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
  // Bot API default broadcast limit of 30 messages/second across all users;
  // tighter per-chat (~1/s) and per-group (20/min) limits also apply.
  telegram: {
    allowedRequests: 30,
    intervalMs: 1_000,
    sourceUrl: "https://core.telegram.org/bots/faq",
  },
  // REST API v2: 1000 requests per 15-minute window per token. The Sync API
  // has its own stricter limits.
  todoist: {
    allowedRequests: 1_000,
    intervalMs: 900_000,
    sourceUrl: "https://developer.todoist.com/rest/v2/",
  },
  // Per-token limit of 100 per 10 seconds; the per-API-key limit is higher
  // (300/10s) and some routes (e.g. /1/members) are stricter.
  trello: {
    allowedRequests: 100,
    intervalMs: 10_000,
    sourceUrl:
      "https://developer.atlassian.com/cloud/trello/guides/rest-api/rate-limits/",
  },
  // Default outbound SMS throughput of ~1 segment/second on US/Canada long
  // codes; varies widely by number type and country (REST API uses a
  // concurrency limit rather than a fixed per-second request cap).
  twilio: {
    allowedRequests: 1,
    intervalMs: 1_000,
    sourceUrl:
      "https://support.twilio.com/hc/en-us/articles/115002943027-Understanding-Twilio-Rate-Limits-and-Message-Queues",
  },
  // Conservative general default of 100/minute; varies by plan, the High
  // Volume add-on raises it to 2500/min, and some endpoints are stricter.
  zendesk: {
    allowedRequests: 100,
    intervalMs: 60_000,
    sourceUrl:
      "https://developer.zendesk.com/api-reference/introduction/rate-limits/",
  },
  // Account-level limits vary by plan and request-type label; 2/s is the
  // conservative Free-plan Medium-API figure (Pro Medium is 20/s).
  zoom: {
    allowedRequests: 2,
    intervalMs: 1_000,
    sourceUrl: "https://developers.zoom.us/docs/api/rate-limits/",
  },
};
