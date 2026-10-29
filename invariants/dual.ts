/**
 * Dual callback paths (randnotify + legacy receiverand) share one resolver.
 * Second successful resolve is a no-op / refused — educational, no orng.wax calls.
 */

export type CallbackPath = "randnotify" | "receiverand";

export type Job = {
  id: bigint;
  owner: string;
  resolved: boolean;
  /** Which path first resolved it, if any */
  resolvedBy: CallbackPath | null;
  payout: bigint;
};

export type ResolveInput = {
  path: CallbackPath;
  jobId: bigint;
  /** Simulated require_auth(orng) */
  caller: string;
  orng: string;
  /** Entropy bytes stand-in — not chain RNG */
  entropy: string;
};

const NAME = /^[a-z1-5.]{1,12}$/;

export function assertName(name: string): string {
  if (!NAME.test(name) || name.startsWith(".") || name.endsWith(".")) {
    throw new Error("bad account name");
  }
  return name;
}

export function openJob(jobs: readonly Job[], id: bigint, owner: string): Job[] {
  if (typeof id !== "bigint" || id < 1n) throw new Error("bad job id");
  assertName(owner);
  if (jobs.some((j) => j.id === id)) throw new Error("job already open");
  return [...jobs, { id, owner, resolved: false, resolvedBy: null, payout: 0n }];
}

/** Map entropy stand-in to a deterministic educational payout (not fair RNG). */
export function educationalPayout(entropy: string): bigint {
  if (!/^[0-9a-f]{8,64}$/i.test(entropy)) throw new Error("bad entropy hex");
  const n = BigInt("0x" + entropy.slice(0, 8));
  return n % 2n === 0n ? 19600n : 0n;
}

export type ResolveResult =
  | { status: "resolved"; jobs: Job[]; payout: bigint; path: CallbackPath }
  | { status: "already_resolved"; jobs: Job[]; path: CallbackPath };

/**
 * Single resolver used by both paths.
 * - First valid callback resolves and sets payout
 * - Second callback (either path) returns already_resolved without changing payout
 */
export function resolveShared(
  jobs: readonly Job[],
  input: ResolveInput
): ResolveResult {
  assertName(input.caller);
  assertName(input.orng);
  if (input.caller !== input.orng) throw new Error("caller must be orng");
  if (input.path !== "randnotify" && input.path !== "receiverand") {
    throw new Error("bad path");
  }
  const job = jobs.find((j) => j.id === input.jobId);
  if (!job) throw new Error("unknown job");

  if (job.resolved) {
    return { status: "already_resolved", jobs: [...jobs], path: input.path };
  }

  const payout = educationalPayout(input.entropy);
  const next = jobs.map((j) =>
    j.id === input.jobId
      ? { ...j, resolved: true, resolvedBy: input.path, payout }
      : j
  );
  return { status: "resolved", jobs: next, payout, path: input.path };
}
