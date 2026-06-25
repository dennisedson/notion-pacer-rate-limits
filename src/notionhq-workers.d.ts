/**
 * Minimal local shim for the parts of `@notionhq/workers` this package uses.
 *
 * It lets the repo typecheck and test in isolation. When you install the real
 * `@notionhq/workers` package in your Worker project, its own types take over.
 */
declare module "@notionhq/workers" {
  export interface Pacer {
    wait(): Promise<void>;
  }

  export interface Worker {
    pacer(
      name: string,
      options: { allowedRequests: number; intervalMs: number }
    ): Pacer;
  }
}
