# px-orng-dual-callback-idempotent

> **Trust:** private educational lab (Tier B)  
> **Quest:** 003 — dual callback, one resolver  
> **Vault:** [px-contract-examples-vault](https://github.com/pixel-journey/px-contract-examples-vault)

**One-sentence goal:** Teach **one shared resolver** for `randnotify` and legacy `receiverand` so a **second callback does not change payout**.

**Real code:** `npm test`. **Does not** call `orng.wax`.

---

## What is true (executed)

| Rule | Result |
|------|--------|
| First `randnotify` | resolves + sets payout |
| Later `receiverand` | `already_resolved`; payout unchanged |
| First path can be `receiverand` | ok |
| Non-orng caller | refused |

```bash
npm test
```

Neighbors: `px-orng-v3-randnotify-starter`, `px-orng-coinflip-escrow`.

## License

MIT — Pixel Journey
