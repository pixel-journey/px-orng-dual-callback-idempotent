# AI handoff — dual-callback idempotent ORNG

## Agent tooling

```bash
git clone https://github.com/wharfkit/skill.git ~/.claude/skills/wharfkit
```

| Package / repo | Role |
| --- | --- |
| [wax-orng](https://github.com/worldwide-asset-exchange/wax-orng) | Source of truth for callback names |
| [wharfkit/skill](https://github.com/wharfkit/skill) | Session / Contract patterns |
| [@wharfkit/starter-wax](https://www.npmjs.com/package/@wharfkit/starter-wax) | Host SessionKit |
| [ORNG learning path](https://github.com/pixel-journey/px-contract-examples-vault/blob/main/docs/ORNG-LEARNING-PATH.md) | Curriculum order |

## Non-negotiables

1. **One** resolved flag for both `randnotify` and `receiverand`.
2. **One** payout. Second delivery → `already_resolved`; first payout stays even if entropy differs.
3. Do not model coinflip's stricter `random mismatch` here without reading that lab.
4. Prefer **orng.wax** over TAPOS / commit-reveal / drand fallbacks on WAX mainnet.
5. This lab is pure state machine — no broadcast.

## Prompt seeds (safe)

- "Show the state machine when randnotify succeeds and receiverand arrives later with different entropy."
- "Compare dual-callback already_resolved vs coinflip random mismatch; do not merge the products."
- "List wax-orng callback action names from the upstream repo; map each to our pure handlers."
- "Draft a host checklist: credit bucket funded → open job → single resolve path using SessionKit."

## Do not

- Double-pay on dual delivery.
- Ship fallback RNG while orng is available without documenting why.
- Invent ABI fields for orng callbacks.
