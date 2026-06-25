#!/usr/bin/env node
import { apiRegistry } from "../src/registry";
import { validateRegistry } from "../src/validate";

const { ok, errors } = validateRegistry(apiRegistry);

if (ok) {
  const count = Object.keys(apiRegistry).length;
  console.log(`✓ Registry is valid (${count} entries).`);
  process.exit(0);
}

console.error("✗ Registry validation failed:\n");
for (const error of errors) {
  console.error(`  - ${error}`);
}
console.error("\nSee CONTRIBUTING.md for the rules.");
process.exit(1);
