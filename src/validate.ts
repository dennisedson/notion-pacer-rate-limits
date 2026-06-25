import type { ApiRegistry } from "./types";

export interface ValidationResult {
  ok: boolean;
  errors: string[];
}

function isPositiveInteger(value: unknown): boolean {
  return typeof value === "number" && Number.isInteger(value) && value > 0;
}

function isHttpsUrl(value: string): boolean {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Validates a registry against the contribution rules enforced in CI:
 *   - keys are lowercase
 *   - keys are in alphabetical order
 *   - allowedRequests and intervalMs are positive integers
 *   - sourceUrl is present and a valid https URL
 *
 * Returns every problem found so contributors can fix them in one pass.
 */
export function validateRegistry(registry: ApiRegistry): ValidationResult {
  const errors: string[] = [];
  const keys = Object.keys(registry);

  for (const key of keys) {
    if (key !== key.toLowerCase()) {
      errors.push(`"${key}": key must be lowercase.`);
    }

    const config = registry[key];

    if (!isPositiveInteger(config.allowedRequests)) {
      errors.push(
        `"${key}": allowedRequests must be a positive integer (got ${String(
          config.allowedRequests
        )}).`
      );
    }

    if (!isPositiveInteger(config.intervalMs)) {
      errors.push(
        `"${key}": intervalMs must be a positive integer (got ${String(
          config.intervalMs
        )}).`
      );
    }

    if (!config.sourceUrl) {
      errors.push(`"${key}": sourceUrl is required so values can be verified.`);
    } else if (!isHttpsUrl(config.sourceUrl)) {
      errors.push(`"${key}": sourceUrl must be a valid https URL.`);
    }
  }

  const sorted = [...keys].sort();
  if (keys.join(",") !== sorted.join(",")) {
    errors.push(
      `Registry keys must be alphabetical. Expected order: ${sorted.join(", ")}.`
    );
  }

  return { ok: errors.length === 0, errors };
}
