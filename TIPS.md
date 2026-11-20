# Tips — one resolver for randnotify and receiverand

## The rule

Both callback **names** write the **same** job row. The second arrival is a no-op when entropy matches, and an error when it does not (this lab freezes payout; coinflip is stricter and throws `random mismatch`).

## Do

- One `resolved` flag. Never a flag per action name.
- Check caller is the oracle **before** reading entropy.
- Prefer v3 `randnotify` for new contracts. Keep `receiverand` only while old deliveries can still arrive.
- Make payout a pure function of the stored entropy so a retry is deterministic.

## Don't

- Pay in `randnotify` and again in `receiverand`.
- Let the second payload "win" because it arrived later.
- Clear `payout` on the duplicate path.

## Common mistakes

1. Copy-pasting the starter's `resolveJob` into two actions that each set their own boolean.
2. Assuming this lab ignores a **different** second entropy the way a silent no-op would. Read the test: mismatch is refused or frozen — do not invent a third policy in the port.
3. Marking resolved, then transferring tokens in a later transaction (crash window).
4. Treating parity of byte 0 as a house-edge game. That toy payout is here so idempotency is visible. Real edges live in [coinflip](https://github.com/pixel-journey/px-orng-coinflip-escrow) and [dice](https://github.com/pixel-journey/px-orng-dice-multi-tier-payout).

## Nice-to-have extensions (not in this repo)

| Idea | Where |
| --- | --- |
| Credits before open | [credit bucket](https://github.com/pixel-journey/px-orng-credit-bucket-monitor) |
| Job table caps | [v3 starter](https://github.com/pixel-journey/px-orng-v3-randnotify-starter) |
| Bank reserve | game escrow labs |
| Host vs Node hash | only if you hash locally; oracle bytes should be used as delivered |

Path: `px-contract-examples-vault` (private index; not this public course).
