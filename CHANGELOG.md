# Changelog

All notable changes to this project are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2026-06-24

### Added

- Initial registry of conservative rate-limit defaults: GitHub, Slack, Shopify, Stripe.
- `createDynamicPacer()` to build a Notion Worker pacer for a named service.
- `resolveRateLimit()` to resolve a config without creating a pacer.
- Per-field override precedence: env vars → registry → caller fallbacks.
- Test suite, CI, and contribution scaffolding.

[Unreleased]: https://github.com/dennisedson/notion-runner-rate-limits/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/dennisedson/notion-runner-rate-limits/releases/tag/v0.1.0
