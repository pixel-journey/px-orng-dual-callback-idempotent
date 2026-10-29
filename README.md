# One resolver for randnotify and receiverand

> **Trust:** private educational lab (Tier B)  
> **Quest:** 003 — dual callback, one resolver  
> **Vault:** [px-contract-examples-vault](https://github.com/pixel-journey/px-contract-examples-vault)

**One-sentence goal:** Teach **one shared resolver** for `randnotify` and legacy `receiverand` so a **second callback does not change payout**.

**Real code:** `npm test`. **Does not** call `orng.wax`. The entropy string is a stand-in, not chain RNG.

## What you can learn

- Why two callback names must share one function if both can still fire.
- Why the second path returns `already_resolved` instead of recomputing payout.
- Why the caller has to be the configured oracle account, even in a lab.
- Why a toy even/odd payout is not a fairness claim.

## What is actually in the repo

| Piece | Role |
| --- | --- |
| `invariants/dual.ts` | `openJob`, `educationalPayout`, `resolveShared` |
| `invariants/dual.test.ts` | Executed claims |
| `EDUCATION.md` | Why both entrypoints exist |
| `SECURITY.md` | Double-pay surface and what is still missing on-chain |

## What is true (executed)

| Rule | Result |
| --- | --- |
| First `randnotify` with entropy `00000000…` | `resolved`, payout `19600n`, `resolvedBy` `randnotify` |
| Later `receiverand` with a different entropy | `already_resolved`; payout stays `19600n`; `resolvedBy` stays `randnotify` |
| First path can be `receiverand` | `resolved`; odd leading word pays `0n` |
| Caller is not the configured `orng` | refused |

`educationalPayout` reads the first 8 hex characters. Even → `19600n`. Odd → `0n`. That map exists so tests are deterministic. It is not a house edge.

## The rule, in order

`resolveShared(jobs, input)`:

1. `caller` and `orng` must be Antelope names. They must be equal.
2. `path` is `randnotify` or `receiverand`.
3. The job id must already exist (`openJob` refuses a duplicate id and a non-positive id).
4. If `job.resolved` is already true, return `already_resolved` and the same job list. Do not recompute payout.
5. Otherwise set `resolved`, `resolvedBy` to this path, and `payout` from `educationalPayout`.

```ts
import { openJob, resolveShared } from "./invariants/dual.ts";

let jobs = openJob([], 1n, "alice");
const first = resolveShared(jobs, {
  path: "randnotify",
  jobId: 1n,
  caller: "orng.wax",
  orng: "orng.wax",
  entropy: "00000000aaaaaaaa",
});
// first.status === "resolved", first.payout === 19600n
```

## Edge cases

- Entropy that is not 8–64 hex characters throws before a payout exists.
- An unknown job id throws. A second open of the same id throws.
- The second callback may use the other path and a different entropy. The first payout wins.
- Account-name checks are a format check, not a proof the account exists.

## Best practice and the opposite

**Do** route both callback names through one function that reads a `resolved` flag.  
**Do** keep the first payout when the second path arrives.

**Do not** call this fair randomness. Nothing here requests `orng.wax`.  
**Do not** pay from the second callback because the entropy differs.

## Live path, not shipped

```
open job
    → requestrand                         [not in this repo]
    → randnotify or receiverand
    → resolveShared                        [tested]
    → real require_auth(orng.wax)          [not in this repo]
```

Still required on-chain: real auth, job-to-wager linkage, RAM payer policy, and credit accounting. See [SECURITY.md](SECURITY.md).

## Related

- `px-orng-v3-randnotify-starter` — job table and unsigned `requestrand` body
- `px-orng-coinflip-escrow` — payout math, separate from this idempotency gate

## Run

```bash
npm test
```

MIT — Pixel Journey
