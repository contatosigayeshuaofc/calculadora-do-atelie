import { describe, expect, it, beforeEach } from "vitest";
import { consumeRateLimit, resetRateLimitForTests } from "./rate-limit";

describe("consumeRateLimit", () => {
  beforeEach(() => {
    resetRateLimitForTests();
  });

  it("allows requests until the configured limit is reached", () => {
    const policy = { limit: 2, windowMs: 1_000 };

    expect(consumeRateLimit("login:local", policy, 100).allowed).toBe(true);
    expect(consumeRateLimit("login:local", policy, 200).allowed).toBe(true);

    const blocked = consumeRateLimit("login:local", policy, 300);

    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterMs).toBe(800);
  });

  it("starts a new bucket after the window expires", () => {
    const policy = { limit: 1, windowMs: 1_000 };

    expect(consumeRateLimit("save:local", policy, 100).allowed).toBe(true);
    expect(consumeRateLimit("save:local", policy, 200).allowed).toBe(false);
    expect(consumeRateLimit("save:local", policy, 1_101).allowed).toBe(true);
  });
});
