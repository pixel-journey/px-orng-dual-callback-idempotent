# One resolver for randnotify and receiverand

> **Domain:** WAX ORNG — dual callback idempotency  
> **Sources:** [SOURCES.md](SOURCES.md)  
> **Catalog:** [px-contract-examples-vault](https://github.com/pixel-journey/px-contract-examples-vault)  
> **Path:** [ORNG-LEARNING-PATH.md](https://github.com/pixel-journey/px-contract-examples-vault/blob/main/docs/ORNG-LEARNING-PATH.md)

**Goal:** Teach **one shared resolver** for `randnotify` and legacy `receiverand` so a **second callback does not change payout**.

**Code under test:** `npm test` (unit + multi-job composition). Does not call `orng.wax`. Entropy is a stand-in for resolve order, not chain RNG.

**Official:** [wax-orng](https://github.com/worldwide-asset-exchange/wax-orng). **Sample:** [RNG tutorial](https://docs.wax.io/build/tutorials/create-wax-rng-smart-contract/rng_sample).

## Learning materials

| Doc | Role |
| --- | --- |
| [EDUCATION.md](EDUCATION.md) | Beginner → masterclass |
| [WORKED-EXAMPLES.md](WORKED-EXAMPLES.md) | Path order, frozen payout |
| [TIPS.md](TIPS.md) | Integration checklist |
| [SECURITY.md](SECURITY.md) | Double-pay threat model |
| [SOURCES.md](SOURCES.md) | Official + related labs |

## What is true (executed)

| Rule | Result |
| --- | --- |
| First `randnotify` with even entropy | `resolved`, payout `19600n` |
| Later `receiverand` with odd entropy | `already_resolved`; payout stays |
| First path can be `receiverand` | `resolved`; odd pays `0n` |
| Caller is not the configured `orng` | refused |
| Two concurrent jobs | resolve independently |

```bash
npm test
```

MIT — Pixel Journey
