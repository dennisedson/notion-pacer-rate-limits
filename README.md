# notion-runner-rate-limits

[![CI](https://github.com/dennisedson/notion-runner-rate-limits/actions/workflows/ci.yml/badge.svg)](https://github.com/dennisedson/notion-runner-rate-limits/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./CONTRIBUTING.md)

A community-maintained reference of common API rate limits, for people building
[Notion Workers](https://developers.notion.com/workers/get-started/overview).

Notion Workers already give you a built-in pacer to throttle outbound calls —
you just need the right numbers. That's what this repo is: a curated, sourced
list of those numbers so you don't have to dig through each API's docs. **Grab a
value and drop it into your `worker.pacer(...)` call. No install required.**

## The limits

Every value links to the official docs it came from. These are **conservative
defaults**; see the [caveats](#caveats) below.

| Service        | Allowed requests | Interval                | Source                                                                                                                |
| -------------- | ---------------- | ----------------------- | --------------------------------------------------------------------------------------------------------------------- |
| airtable       | 5                | 1,000 ms (per sec)      | [docs](https://airtable.com/developers/web/api/rate-limits)                                                           |
| anthropic      | 50               | 60,000 ms (per min)     | [docs](https://platform.claude.com/docs/en/api/rate-limits)                                                           |
| asana          | 150              | 60,000 ms (per min)     | [docs](https://developers.asana.com/docs/rate-limits)                                                                 |
| calendly       | 60               | 60,000 ms (per min)     | [docs](https://developer.calendly.com/api-docs/edca8074633f8-api-rate-limits)                                         |
| clickup        | 100              | 60,000 ms (per min)     | [docs](https://developer.clickup.com/docs/rate-limits)                                                                |
| cloudflare     | 1,200            | 300,000 ms (per 5 min)  | [docs](https://developers.cloudflare.com/fundamentals/api/reference/limits/)                                          |
| discord        | 50               | 1,000 ms (per sec)      | [docs](https://docs.discord.com/developers/topics/rate-limits)                                                        |
| github         | 83               | 60,000 ms (per min)     | [docs](https://docs.github.com/rest/using-the-rest-api/rate-limits-for-the-rest-api)                                  |
| gitlab         | 2,000            | 60,000 ms (per min)     | [docs](https://docs.gitlab.com/user/gitlab_com/#rate-limits-on-gitlabcom)                                             |
| googlecalendar | 600              | 60,000 ms (per min)     | [docs](https://developers.google.com/workspace/calendar/api/guides/quota)                                             |
| hubspot        | 100              | 10,000 ms (per 10 sec)  | [docs](https://developers.hubspot.com/docs/guides/apps/api-usage/usage-details)                                       |
| intercom       | 10,000           | 60,000 ms (per min)     | [docs](https://developers.intercom.com/docs/references/rest-api/errors/rate-limiting)                                 |
| linear         | 2,500            | 3,600,000 ms (per hour) | [docs](https://linear.app/developers/rate-limiting)                                                                   |
| mailchimp      | 10               | 1,000 ms (per sec)      | [docs](https://mailchimp.com/developer/marketing/docs/fundamentals/)                                                  |
| notion         | 3                | 1,000 ms (per sec)      | [docs](https://developers.notion.com/reference/request-limits)                                                        |
| openai         | 500              | 60,000 ms (per min)     | [docs](https://developers.openai.com/api/docs/guides/rate-limits)                                                     |
| openweather    | 60               | 60,000 ms (per min)     | [docs](https://openweathermap.org/price)                                                                              |
| resend         | 5                | 1,000 ms (per sec)      | [docs](https://resend.com/docs/api-reference/rate-limit)                                                              |
| salesforce     | 100,000          | 86,400,000 ms (per day) | [docs](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/resources_limits.htm)                 |
| sendgrid       | 10,000           | 1,000 ms (per sec)      | [docs](https://www.twilio.com/docs/sendgrid/for-developers/sending-email/v3-mail-send-faq)                            |
| sentry         | 40               | 1,000 ms (per sec)      | [docs](https://docs.sentry.io/api/ratelimits/)                                                                        |
| shopify        | 2                | 1,000 ms (per sec)      | [docs](https://shopify.dev/docs/api/usage/rate-limits)                                                                |
| slack          | 50               | 60,000 ms (per min)     | [docs](https://api.slack.com/docs/rate-limits)                                                                        |
| stripe         | 100              | 1,000 ms (per sec)      | [docs](https://docs.stripe.com/rate-limits)                                                                           |
| telegram       | 30               | 1,000 ms (per sec)      | [docs](https://core.telegram.org/bots/faq)                                                                            |
| todoist        | 1,000            | 900,000 ms (per 15 min) | [docs](https://developer.todoist.com/rest/v2/)                                                                        |
| trello         | 100              | 10,000 ms (per 10 sec)  | [docs](https://developer.atlassian.com/cloud/trello/guides/rest-api/rate-limits/)                                     |
| twilio         | 1                | 1,000 ms (per sec)      | [docs](https://support.twilio.com/hc/en-us/articles/115002943027-Understanding-Twilio-Rate-Limits-and-Message-Queues) |
| zendesk        | 100              | 60,000 ms (per min)     | [docs](https://developer.zendesk.com/api-reference/introduction/rate-limits/)                                         |
| zoom           | 2                | 1,000 ms (per sec)      | [docs](https://developers.zoom.us/docs/api/rate-limits/)                                                              |

Machine-readable version: [`registry.json`](./registry.json) (generated from
[`src/registry.ts`](./src/registry.ts)).

Two notably common APIs are intentionally absent: Dropbox and PayPal both
officially decline to publish numeric rate limits (they throttle dynamically
and return `Retry-After`), so there's no honest value to record.

## Using a limit

Inside a Notion Worker sync, pass the numbers straight to the built-in pacer and
`await pacer.wait()` before each request:

```typescript
// Shopify: 2 requests / second
const shopify = worker.pacer("shopify", {
  allowedRequests: 2,
  intervalMs: 1000,
});

for (const item of items) {
  await shopify.wait();
  await fetch("https://your-store.myshopify.com/admin/api/...");
}
```

## Reading the data programmatically

`registry.json` is plain JSON you can fetch raw or read from any language — no
package to install, always the latest committed values:

```
https://raw.githubusercontent.com/dennisedson/notion-runner-rate-limits/main/registry.json
```

## Optional: dynamic helper

If you'd rather resolve a pacer from a service name (with env-var overrides)
instead of inlining numbers, there's a copy-paste helper at
[`examples/notion-pacer.ts`](./examples/notion-pacer.ts). It's intentionally
_not_ a published dependency — for most projects, reading the number is simpler.

## Open question

Is a real, installable helper for **pacing many APIs from config** (env-var
overrides, dynamic lookup) something you'd actually use, or is grabbing the
numbers enough? We're gauging demand before adding a runtime dependency.

👉 **Weigh in here:** [open a discussion under Ideas](https://github.com/dennisedson/notion-runner-rate-limits/discussions/categories/ideas)

## Caveats

These are conservative starting points, not exhaustive models. Many APIs vary
limits by plan tier or endpoint, or use cost-based models a single
requests/interval pair can't fully capture (e.g. GitHub enforces hourly, Slack
limits are per-method tiers, Shopify Plus is 4/s and its GraphQL API is
cost-based). When in doubt, start cautious and confirm against the linked docs.

## Contributing

The most valuable contributions are **new and corrected rate limits**. Add an
entry to [`src/registry.ts`](./src/registry.ts), run `npm run build:json`, and
open a PR. See [CONTRIBUTING.md](./CONTRIBUTING.md) for the full guide and
[CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) for community expectations.

## License

MIT — see [LICENSE](./LICENSE).
