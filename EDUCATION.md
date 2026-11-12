# Education — one resolver, two callback names

> **Rung:** `npm test` passes. No call to `orng.wax`. The payout function is a teaching stand-in, not a fair coin.  
> **The test is the rule.**

Read [px-orng-v3-randnotify-starter](https://github.com/pixel-journey/px-orng-v3-randnotify-starter) first if you have not. That lab throws on a second resolve and does not pay. This lab returns `already_resolved` and keeps the first payout.

Official service: [worldwide-asset-exchange/wax-orng](https://github.com/worldwide-asset-exchange/wax-orng). Sample on docs.wax.io: [RNG smart contract tutorial](https://docs.wax.io/build/tutorials/create-wax-rng-smart-contract/rng_sample).

## What you should be able to do

| Level | After this file |
| --- | --- |
| Beginner | Show that `randnotify` then `receiverand` does not pay twice |
| Intermediate | Explain why the second entropy is ignored, and what `19600n` actually is |
| Masterclass | Specify one on-chain function both notification handlers must call; isolate multi-job state |

---

## Official sketch (read the source of truth)

On production WAX, dapps typically:

1. Call `orng.wax::requestrand` with a unique `assoc_id`, a `signing_value` (often derived from the tx), and `caller` = your contract.
2. Handle the delivery notification (`randnotify` on modern contracts; legacy `receiverand` still appears in older code and samples).
3. Match the delivery to the pending job by `assoc_id` / request id and pay **once**.

This repository only models step 3’s **idempotency** with two path names. It does not broadcast `requestrand`, stake RNG credits, or verify oracle signatures. See [SOURCES.md](SOURCES.md).

---

## Beginner — one scene

Alice has job `1`. The first callback is `randnotify` with entropy hex `00000000aaaaaaaa`. The resolver marks the job resolved by `randnotify` and sets payout `19600n`.

A later `receiverand` arrives with different entropy `00000001bbbbbbbb` (that hex would have paid `0n` if it had been first). The status is `already_resolved`. Payout stays `19600n`. `resolvedBy` stays `randnotify`.

The other way works too. Job `2` for Bob, first path `receiverand`, odd entropy: status `resolved`, payout `0n`, `resolvedBy` is `receiverand`.

A caller named `evil` throws.

### Words

| Word | Meaning here |
| --- | --- |
| `randnotify` | One callback name. Not a network listener |
| `receiverand` | The legacy name. Same function |
| `already_resolved` | A return status, not a throw. Jobs are copied unchanged |
| `educationalPayout` | First 8 hex digits as an integer. Even → `19600n`. Odd → `0n` |
| Entropy | A hex string the test supplies. Not oracle bytes |

### Predict, then run

```bash
npm test
```

1. Does the second call throw? (No. Status `already_resolved`.)
2. If the second entropy is the "odd" one, does payout become 0? (No. It stays 19600.)
3. Is 19600 a house-edge formula in this file? (No. It is the even branch of a toy mapper.)

---

## Intermediate — why the second path must not recompute

`resolveShared` checks caller equals `orng`, path is one of the two names, and the job exists.

If `job.resolved` is already true, it returns the same job list and the **current** path name. It does not read entropy. That is why the odd hex cannot overwrite 19600. If you "fixed" the second call by running `educationalPayout` again, you would change the payout after the fact. The test exists to forbid that.

### Multi-job composition (new tests)

`invariants/dual.composition.test.ts` covers:

- Two open jobs resolve on **different** paths without sharing payout or `resolvedBy`.
- Resolving job 10 leaves job 20 open.
- `receiverand` first, then `randnotify`: first path and payout stick.
- Identical entropy delivered twice: still one pay.

### Attack → test

| Attack | Naive code | This lab |
| --- | --- | --- |
| Both callback names pay | double payout | `already_resolved` |
| Second entropy replaces the first | payout flips | first payout kept |
| Cross-job bleed | job A resolve marks job B | composition tests |
| User calls resolve | user sets payout | `caller must be orng` |

### Difference from the starter

| | Starter | This lab |
| --- | --- | --- |
| Second resolve | Throws `job already resolved` | Returns `already_resolved` |
| Payout | None | Toy even/odd mapper |
| Paths | One `resolveJob` | shared `resolveShared` |

---

## Masterclass — two handlers, one writer

On chain you will be tempted to copy the body into `on_notify` of `randnotify` and again into `receiverand`. The second copy will drift. The vault rule is: require the oracle account, and both paths call one internal function that reads and writes one row.

That internal function must:

- Ignore the call when the job is already resolved, **without** sending tokens again.
- Set the payout and the flag in the same action as the transfer.
- Treat action-data "caller" as untrusted; `require_auth(orng.wax)` is the real check. This file only compares strings.

The toy payout must not ship. Replace it with the sampled result you committed to before the oracle replied. For house-edge sampling see [px-orng-coinflip-escrow](https://github.com/pixel-journey/px-orng-coinflip-escrow).

### Exercise

1. First path `receiverand` with even entropy, second `randnotify` with odd. What is `resolvedBy`? (`receiverand` — covered by composition tests.)
2. Why is recomputing payout on `already_resolved` a bug even if entropy matches?
3. Does this repo broadcast either action? (No.)

---

## What this course will not teach

- Fair randomness or modulo-bias rejection
- A token transfer of 19600
- That the second callback throws (it does not)
