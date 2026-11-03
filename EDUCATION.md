# Education — one resolver, two callback names

> **Rung:** `npm test` passes. No call to `orng.wax`. The payout function is a teaching stand-in, not a fair coin.  
> **The test is the rule.**

Read `px-orng-v3-randnotify-starter` first if you have not. That lab throws on a second resolve and does not pay. This lab returns `already_resolved` and keeps the first payout.

## What you should be able to do

| Level | After this file |
| --- | --- |
| Beginner | Show that `randnotify` then `receiverand` does not pay twice |
| Intermediate | Explain why the second entropy is ignored, and what `19600n` actually is |
| Masterclass | Specify one on-chain function both notification handlers must call |

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

If the job is open, payout is computed once, `resolved` becomes true, and `resolvedBy` stores which name won the race.

`educationalPayout` takes the first 8 hex characters. `00000000` is 0, which is even, so 19600. `00000001` is 1, which is odd, so 0. The rest of the hex is ignored. The pattern is 8..64 hex characters. This is not rejection sampling and not a 50/50 coin over the full entropy. `px-orng-coinflip-escrow` is the neighbor that talks about bias. Do not cite this mapper as that design.

Unknown job throws `unknown job`. The tests do not call it. Bad entropy throws `bad entropy hex`. The tests do not call it.

### Attack → test

| Attack | Naive code | This lab | Test |
| --- | --- | --- | --- |
| Both callback names pay | 19600 then another payout | second status `already_resolved` | `second path is already_resolved and keeps first payout` |
| Second entropy replaces the first | Payout flips from 19600 to 0 | first payout kept | same test asserts `19600n` |
| Only `randnotify` is implemented | Legacy `receiverand` never pays, or pays on its own flag | `receiverand` can be first | `receiverand can be the first resolver` |
| User calls resolve | User sets payout | `caller must be orng` | `refuses non-orng caller` |

### Difference from the starter

| | Starter | This lab |
| --- | --- | --- |
| Second resolve | Throws `job already resolved` | Returns `already_resolved` |
| Payout | None | Toy even/odd mapper |
| Paths | One `resolveJob` | `randnotify` and `receiverand` share `resolveShared` |

Both are once-only. They are not the same API. Do not merge the error strings in your notes.

---

## Masterclass — two handlers, one writer

On chain you will be tempted to copy the body into `on_notify` of `randnotify` and again into `receiverand`. The second copy will drift. The vault rule is: `receiverand` calls `require_auth(orng.wax)`, and both paths call one internal function that reads and writes one row.

That internal function must:

- Ignore the call when the job is already resolved, **without** sending tokens again. Returning a status is fine. Emitting a second inline `transfer` is not.
- Set the payout and the flag in the same action as the transfer. A flag set in a later action races the second callback.
- Treat `caller` in the action data as untrusted. `require_auth(orng.wax)` is the check. This file compares two strings the test passed in.

The toy payout must not ship. Even/odd on four bytes is predictable, ignores the rest of the entropy, and uses 19600 only so the test has a recognizable number (the coinflip lab's executed "10000 in → 19600 out" is a different rule). Replace it with the sampled result you committed to before the oracle replied.

### Exercise

1. First path `receiverand` with `00000000aaaaaaaa`, second path `randnotify` with the same hex. What is `resolvedBy`? (`receiverand`. Derived. The test covers receiverand-first only with the odd hex.)
2. Why is recomputing payout on `already_resolved` a bug even if the second entropy matches the first? (You should not have a second writer. A future edit might apply a fee or a different formula.)
3. Does this repo broadcast either action? (No.)

---

## What this course will not teach

- Fair randomness or modulo-bias rejection
- A token transfer of 19600
- That the second callback throws (it does not)
