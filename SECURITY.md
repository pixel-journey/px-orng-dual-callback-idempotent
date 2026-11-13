# Security notes — dual callback idempotency

## Mitigated in the lab

| Attack | Mitigation |
| --- | --- |
| Second callback changes payout | `already_resolved`; payout frozen |
| Non-oracle caller | `caller must be orng` |
| Unknown job id | refused |
| Cross-job bleed | per-id resolve state |

## Production still needs

| Concern | Guidance |
| --- | --- |
| Auth | `require_auth(orng.wax)` on both entry actions |
| Notification routing | Correct `on_notify` / action names for each path |
| Token payout ordering | Avoid double-pay if transfer fails after setting resolved |
| Entropy integrity | Trust only oracle-delivered bytes |
| Job binding | `assoc_id` matches the wager row |

This repository does not call `orng.wax` and does not move tokens. Educational payout is a parity toy, not a house edge model (see dice/roulette labs).
