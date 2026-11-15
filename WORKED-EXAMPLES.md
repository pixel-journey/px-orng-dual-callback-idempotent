# Worked examples — dual ORNG callback

Caller must be `orng.wax`. Paths: `randnotify` (v3) and `receiverand` (legacy).

Entropy even leading word `00000000aaaaaaaa` → educational payout **19600**. Odd `00000001bbbbbbbb` → **0**.

## First path wins

| Sequence | Result |
| --- | --- |
| open job 1 alice | open |
| resolve randnotify + even | status `resolved`, payout 19600, resolvedBy `randnotify` |
| second resolve receiverand + odd | status `already_resolved`, payout **still 19600**, resolvedBy still `randnotify` |

## Alternate first path

receiverand first with odd entropy → resolvedBy `receiverand`, payout 0. A later randnotify would be already_resolved (same shared table).

## Refusals

Non-positive job id; duplicate open id; non-orng caller; unknown job; short/non-hex entropy.

One resolver, two entry points — never pay twice.
