# Official sources

| Source | Use |
| --- | --- |
| [wax-orng](https://github.com/worldwide-asset-exchange/wax-orng) | `requestrand`, modern notify vs legacy receive paths |
| [wax-rng-oracle](https://github.com/worldwide-asset-exchange/wax-rng-oracle) | How oracles fulfill requests |
| [WAX RNG sample](https://docs.wax.io/build/tutorials/create-wax-rng-smart-contract/rng_sample) | docs.wax.io sample contract |
| [docs.wax.io](https://docs.wax.io/) | WAX development |

This lab is about **idempotency**: one resolver, two entry names. It does not prove fairness or broadcast.

## Domain map

| Repo | Role |
| --- | --- |
| [px-orng-v3-randnotify-starter](https://github.com/pixel-journey/px-orng-v3-randnotify-starter) | Job table + once-resolve + unsigned requestrand |
| **This repo** | Dual path, first payout wins |
| [px-orng-legacy-receiverand-adapter](https://github.com/pixel-journey/px-orng-legacy-receiverand-adapter) | Legacy path details |
| [px-orng-coinflip-escrow](https://github.com/pixel-journey/px-orng-coinflip-escrow) | Escrow payout math |
| [px-invariant-kit](https://github.com/pixel-journey/px-invariant-kit) | Shared once / hex helpers |
