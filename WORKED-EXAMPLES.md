# Worked examples — dual ORNG callback

Caller must be `orng.wax`. Paths: `randnotify` (v3) and `receiverand` (legacy).

Entropy even leading word `00000000aaaaaaaa` → educational payout **19600**. Odd `00000001bbbbbbbb` → **0**.

The 19600 figure is a **toy parity mapper**, not coinflip house edge. Real edges live in [coinflip](https://github.com/pixel-journey/px-orng-coinflip-escrow).

## First path wins

| Sequence | Result |
| --- | --- |
| open job 1 alice | open |
| resolve randnotify + even | status `resolved`, payout 19600, resolvedBy `randnotify` |
| second resolve receiverand + odd | status `already_resolved`, payout **still 19600**, resolvedBy still `randnotify` |

The second entropy is **not** applied. Recomputing payout on `already_resolved` would flip 19600 to 0 — the bug this lab exists to forbid.

## Alternate first path

receiverand first with odd entropy → resolvedBy `receiverand`, payout 0. A later randnotify is `already_resolved` (same shared table).

## Identical entropy twice

Same hex delivered on both paths: still **one** pay. Status after the second call is `already_resolved`. Payout does not double.

## Multi-job composition

| Step | Effect |
| --- | --- |
| Open job 10 and job 20 | both open |
| Resolve 10 on randnotify | 10 resolved; **20 still open** |
| Resolve 20 on receiverand | separate payout / resolvedBy; no bleed from 10 |

Jobs do not share resolve state.

## Refusals

| Case | Result |
| --- | --- |
| Non-positive job id | refused |
| Duplicate open id | refused |
| Non-orng caller | refused |
| Unknown job | refused |
| Short / non-hex entropy | refused |

## Vs coinflip and the starter

| Lab | Second different entropy |
| --- | --- |
| **This lab** | `already_resolved`; first payout frozen |
| [coinflip](https://github.com/pixel-journey/px-orng-coinflip-escrow) | throws `random mismatch` |
| [v3 starter](https://github.com/pixel-journey/px-orng-v3-randnotify-starter) | throws `job already resolved`; no payout field |

One resolver, two entry points — never pay twice.
