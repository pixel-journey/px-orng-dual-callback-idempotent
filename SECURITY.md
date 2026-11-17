# Security — dual callback idempotency

## Closed in tests

| Attack | Mitigation |
| --- | --- |
| Second callback changes payout | `already_resolved`; payout **frozen** |
| Non-oracle caller | `caller must be orng` |
| Unknown job id | refused |
| Cross-job bleed | per-id resolve state |
| Same entropy twice | still one pay |

Unlike coinflip, a second delivery with **different** entropy is not a mismatch throw here — it is `already_resolved` and the first payout stays. Coinflip is stricter on entropy equality for its books.

## Not closed (production)

| Concern | Guidance |
| --- | --- |
| Auth | `require_auth(orng.wax)` on both entry actions |
| Notification routing | Correct `on_notify` / action names for each path |
| Token payout ordering | Avoid double-pay if transfer fails after setting resolved |
| Entropy integrity | Trust only oracle-delivered bytes |
| Job binding | `assoc_id` matches the wager row |

## Attack angles

1. Two handlers each with their own resolved flag (double pay).
2. Recomputing payout on the second path even when status is already resolved.
3. User-callable resolve that trusts a `caller` field.
4. Sharing one open flag across two job ids.

## Honesty limits

No call to `orng.wax`. Educational payout is a parity toy, not a house-edge model ([coinflip](https://github.com/pixel-journey/px-orng-coinflip-escrow) / [dice](https://github.com/pixel-journey/px-orng-dice-multi-tier-payout)). Prefer [wax-orng](https://github.com/worldwide-asset-exchange/wax-orng).
