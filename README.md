# One resolver for randnotify and receiverand

> **Domain:** WAX ORNG — dual callback idempotency  
> **Sources:** [SOURCES.md](SOURCES.md)  
> **Catalog:** [px-contract-examples-vault](https://github.com/pixel-journey/px-contract-examples-vault)

**Goal:** Teach **one shared resolver** for `randnotify` and legacy `receiverand` so a **second callback does not change payout**.

**Code under test:** `npm test` (unit + multi-job composition). Does not call `orng.wax`. The entropy string is a stand-in for teaching resolve order, not chain RNG.

**Official service:** [wax-orng](https://github.com/worldwide-asset-exchange/wax-orng). **Sample:** [RNG tutorial](https://docs.wax.io/build/tutorials/create-wax-rng-smart-contract/rng_sample). **Starter job table:** [px-orng-v3-randnotify-starter](https://github.com/pixel-journey/px-orng-v3-randnotify-starter).

## What is true (executed)

| Rule | Result |
| --- | --- |
| First `randnotify` with even entropy | `resolved`, payout `19600n` |
| Later `receiverand` with odd entropy | `already_resolved`; payout stays |
| First path can be `receiverand` | `resolved`; odd pays `0n` |
| Caller is not the configured `orng` | refused |
| Two concurrent jobs | resolve independently; no cross-bleed |
| Same entropy twice | still pays once |

## Live path, not shipped

```
open job → requestrand [not here] → randnotify or receiverand → resolveShared [tested]
```

## Related

- [px-orng-v3-randnotify-starter](https://github.com/pixel-journey/px-orng-v3-randnotify-starter)
- [px-orng-coinflip-escrow](https://github.com/pixel-journey/px-orng-coinflip-escrow)
- [px-orng-legacy-receiverand-adapter](https://github.com/pixel-journey/px-orng-legacy-receiverand-adapter)

```bash
npm test
```

MIT — Pixel Journey
