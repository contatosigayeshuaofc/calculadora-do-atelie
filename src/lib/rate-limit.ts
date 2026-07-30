import { headers } from "next/headers";

type RateLimitPolicy = {
  id: string;
  limit: number;
  message?: string;
  windowMs: number;
};

type RateLimitBucket = {
  count: number;
  resetAt: number;
};

type RateLimitResult = {
  allowed: boolean;
  retryAfterMs: number;
};

const buckets = new Map<string, RateLimitBucket>();

export const rateLimitPolicies = {
  adminWrite: {
    id: "admin-write",
    limit: 20,
    message: "Muitas ações administrativas em pouco tempo. Aguarde um instante e tente novamente.",
    windowMs: 60_000,
  },
  authRecovery: {
    id: "auth-recovery",
    limit: 3,
    message: "Muitas tentativas de recuperação. Aguarde alguns minutos e tente novamente.",
    windowMs: 10 * 60_000,
  },
  signIn: {
    id: "sign-in",
    limit: 8,
    message: "Muitas tentativas de entrada. Aguarde um instante e tente novamente.",
    windowMs: 60_000,
  },
  signUp: {
    id: "sign-up",
    limit: 4,
    message: "Muitas tentativas de cadastro. Aguarde alguns minutos e tente novamente.",
    windowMs: 10 * 60_000,
  },
  userWrite: {
    id: "user-write",
    limit: 60,
    message: "Muitas ações em pouco tempo. Aguarde um instante e tente novamente.",
    windowMs: 60_000,
  },
} satisfies Record<string, RateLimitPolicy>;

export class RateLimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RateLimitError";
  }
}

export function consumeRateLimit(
  key: string,
  policy: Pick<RateLimitPolicy, "limit" | "windowMs">,
  now = Date.now(),
): RateLimitResult {
  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    buckets.set(key, {
      count: 1,
      resetAt: now + policy.windowMs,
    });

    return { allowed: true, retryAfterMs: 0 };
  }

  if (current.count >= policy.limit) {
    return {
      allowed: false,
      retryAfterMs: Math.max(0, current.resetAt - now),
    };
  }

  current.count += 1;
  return { allowed: true, retryAfterMs: 0 };
}

export function resetRateLimitForTests() {
  buckets.clear();
}

export async function enforceRateLimit(
  policy: RateLimitPolicy,
  discriminator?: string,
) {
  const headerStore = await headers();
  const clientKey = discriminator ?? getClientIp(headerStore);
  const key = `${policy.id}:${clientKey}`;
  const result = consumeRateLimit(key, policy);

  if (!result.allowed) {
    throw new RateLimitError(policy.message ?? "Muitas tentativas. Aguarde um instante e tente novamente.");
  }
}

function getClientIp(headerStore: Headers) {
  const forwardedFor = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = headerStore.get("x-real-ip")?.trim();

  return forwardedFor || realIp || "local";
}
