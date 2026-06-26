# Changelog

All notable changes to this project are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Expanded the registry from 4 to 30 APIs, covering comms/email (SendGrid,
  Twilio, Mailchimp, Resend, Discord, Telegram), productivity/PM (Asana, Trello,
  Linear, Airtable, Calendly, Zoom, ClickUp, Todoist), AI/dev/infra (OpenAI,
  Anthropic, GitLab, Cloudflare, Sentry), CRM/support (HubSpot, Salesforce,
  Intercom, Zendesk, Google Calendar), and data (Notion, OpenWeather). Each
  value is sourced from official docs with a caveat noting tier/plan nuance.

### Changed

- Repositioned as a **data-first reference**: the registry is the product.
  Removed npm-publish framing (the package is no longer published).
- Generated `registry.json` from `src/registry.ts` for raw/programmatic access;
  CI verifies the two stay in sync.

### Moved

- The `createDynamicPacer()` / `resolveRateLimit()` helper moved to
  `examples/notion-pacer.ts` as an optional copy-paste snippet rather than a
  published API. Demand for an installable version is being gauged in
  Discussions.

## [0.1.0] - 2026-06-24

### Added

- Initial registry of conservative rate-limit defaults: GitHub, Slack, Shopify, Stripe.
- `createDynamicPacer()` to build a Notion Worker pacer for a named service.
- `resolveRateLimit()` to resolve a config without creating a pacer.
- Per-field override precedence: env vars → registry → caller fallbacks.
- Test suite, CI, and contribution scaffolding.

[Unreleased]: https://github.com/dennisedson/notion-runner-rate-limits/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/dennisedson/notion-runner-rate-limits/releases/tag/v0.1.0
