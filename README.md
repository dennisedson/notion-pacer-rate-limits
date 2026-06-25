# notion-runner-rate-limits

[![CI](https://github.com/dennisedson/notion-runner-rate-limits/actions/workflows/ci.yml/badge.svg)](https://github.com/dennisedson/notion-runner-rate-limits/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/notion-runner-rate-limits.svg)](https://www.npmjs.com/package/notion-runner-rate-limits)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./CONTRIBUTING.md)

A small registry of common API rate limits, plus a helper that turns them into
[Notion Worker](https://developers.notion.com/workers/get-started/overview)
pacers. Point it at a service name and it resolves a sensible
`allowedRequests` / `intervalMs` pair for you — with env-var and per-call
overrides when you need something more precise.

## Install

```bash
npm install notion-runner-rate-limits
```

`@notionhq/workers` is a peer dependency — your Notion Worker project already
provides it.

## Usage

```typescript
import { createDynamicPacer } from "notion-runner-rate-limits";

// Inside your Worker sync:
const shopifyPacer = createDynamicPacer(worker, "shopify");

// Creating the pacer does NOT throttle on its own.
// Call wait() before each outbound request to enforce the limit:
for (const item of items) {
  await shopifyPacer.wait();
  await fetch("https://your-store.myshopify.com/admin/api/...");
}
```

### Overrides

Resolution precedence is applied **per field**, so a partial override never
clobbers the other value:

1. Environment variables — `PACER_<SERVICE>_REQUESTS` and `PACER_<SERVICE>_INTERVAL`
2. The registry entry for the service
3. Caller-supplied fallback (defaults to 1 request / 1000 ms)

```bash
# e.g. override just the request count for Shopify
export PACER_SHOPIFY_REQUESTS=4
```

```typescript
// Fallbacks for a service that isn't in the registry yet:
const pacer = createDynamicPacer(worker, "acme", {
  fallbackRequests: 5,
  fallbackIntervalMs: 1000,
  envPrefix: "PACER", // optional, this is the default
});
```

You can also resolve the config without creating a pacer:

```typescript
import { resolveRateLimit } from "notion-runner-rate-limits";

const { allowedRequests, intervalMs } = resolveRateLimit("github");
```

## Contributing

Community contributions are very welcome — especially new and corrected rate
limits. The short version:

1. Open `src/registry.ts` and add your service in **lowercase**, alphabetically:

   ```typescript
   hubspot: {
     allowedRequests: 10,
     intervalMs: 1000,
     sourceUrl: "https://developers.hubspot.com/docs/api/usage-details",
   },
   ```

2. Base the numbers on the **official docs** and link them in `sourceUrl`.
3. Run `npm run typecheck` and `npm test`, then open a PR.

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the full guide and
[CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) for community expectations.

> Note: these values are **conservative defaults**, not exhaustive models. Many
> APIs vary limits by plan tier or endpoint, or use cost-based models a single
> requests/interval pair can't fully capture. When in doubt, start cautious and
> override per call.

## License

MIT — see [LICENSE](./LICENSE).
