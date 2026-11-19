# Sources

| Source | Use |
| --- | --- |
| [wax-orng](https://github.com/worldwide-asset-exchange/wax-orng) | Both callback names |
| [RNG tutorial](https://docs.wax.io/build/tutorials/create-wax-rng-smart-contract/rng_sample) | Sample dapp |
| [docs.wax.io](https://docs.wax.io/) | Notifications |

**Product fact:** `randnotify` and `receiverand` must share **one** resolved flag and **one** payout. A second delivery is `already_resolved` and the first payout stays — even if entropy differs.

[Coinflip](https://github.com/pixel-journey/px-orng-coinflip-escrow) is **stricter**: a second different entropy throws `random mismatch` instead of freezing.

## Related labs

| Lab | Role |
| --- | --- |
| [v3 starter](https://github.com/pixel-journey/px-orng-v3-randnotify-starter) | Open + once |
| [legacy adapter](https://github.com/pixel-journey/px-orng-legacy-receiverand-adapter) | `receiverand` only |
| [coinflip](https://github.com/pixel-journey/px-orng-coinflip-escrow) | Entropy-equality on the book |
| [credit bucket](https://github.com/pixel-journey/px-orng-credit-bucket-monitor) | Fund the job before open |
| [ORNG path](https://github.com/pixel-journey/px-contract-examples-vault/blob/main/docs/ORNG-LEARNING-PATH.md) | Curriculum order |
