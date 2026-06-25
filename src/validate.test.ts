import { describe, expect, it } from "vitest";
import { apiRegistry } from "./registry";
import { validateRegistry } from "./validate";
import type { ApiRegistry } from "./types";

const goodEntry = {
  allowedRequests: 10,
  intervalMs: 1000,
  sourceUrl: "https://example.com/docs",
};

describe("validateRegistry", () => {
  it("passes for the shipped registry", () => {
    const result = validateRegistry(apiRegistry);
    expect(result).toEqual({ ok: true, errors: [] });
  });

  it("flags uppercase keys", () => {
    const result = validateRegistry({ GitHub: goodEntry } as ApiRegistry);
    expect(result.ok).toBe(false);
    expect(result.errors.some((e) => e.includes("lowercase"))).toBe(true);
  });

  it("flags non-alphabetical order", () => {
    const result = validateRegistry({
      stripe: goodEntry,
      github: goodEntry,
    } as ApiRegistry);
    expect(result.ok).toBe(false);
    expect(result.errors.some((e) => e.includes("alphabetical"))).toBe(true);
  });

  it("flags non-positive or non-integer numbers", () => {
    const result = validateRegistry({
      acme: {
        allowedRequests: 0,
        intervalMs: 1.5,
        sourceUrl: goodEntry.sourceUrl,
      },
    } as ApiRegistry);
    expect(result.errors.some((e) => e.includes("allowedRequests"))).toBe(true);
    expect(result.errors.some((e) => e.includes("intervalMs"))).toBe(true);
  });

  it("requires a valid https sourceUrl", () => {
    const missing = validateRegistry({
      acme: { allowedRequests: 1, intervalMs: 1000 },
    } as ApiRegistry);
    expect(
      missing.errors.some((e) => e.includes("sourceUrl is required"))
    ).toBe(true);

    const insecure = validateRegistry({
      acme: { allowedRequests: 1, intervalMs: 1000, sourceUrl: "http://x.com" },
    } as ApiRegistry);
    expect(insecure.errors.some((e) => e.includes("valid https URL"))).toBe(
      true
    );
  });
});
