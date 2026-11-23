# Sources

## Official ORNG / WAX

| Source | Use |
| --- | --- |
| [wax-orng](https://github.com/worldwide-asset-exchange/wax-orng) | Both callback names, requestrand |
| [wax-rng-oracle](https://github.com/worldwide-asset-exchange/wax-rng-oracle) | Oracle member process |
| [RNG tutorial](https://docs.wax.io/build/tutorials/create-wax-rng-smart-contract/rng_sample) | Sample dapp |
| [docs.wax.io](https://docs.wax.io/) | Notifications, contract basics |
| [ANTELOPE-PORTABILITY](https://github.com/pixel-journey/px-contract-examples-vault/blob/main/docs/ANTELOPE-PORTABILITY.md) | `orng.wax` is WAX-only |

Live account: **`orng.wax`**.

## WharfKit (host / agent)

| Source | Use |
| --- | --- |
| [WharfKit](https://wharfkit.com/) | SessionKit when a host signs |
| [wharfkit/skill](https://github.com/wharfkit/skill) | Claude Code skill — Session, Contract, patterns |
| [@wharfkit/cli](https://www.npmjs.com/package/@wharfkit/cli) | Generate typed contract helpers |
| [@wharfkit/starter-wax](https://www.npmjs.com/package/@wharfkit/starter-wax) | WAX SessionKit defaults |

```bash
git clone https://github.com/wharfkit/skill.git ~/.claude/skills/wharfkit
```

**Product fact:** `randnotify` and `receiverand` must share **one** resolved flag and **one** payout. A second delivery is `already_resolved` and the first payout stays — even if entropy differs.

[Coinflip](https://github.com/pixel-journey/px-orng-coinflip-escrow) is **stricter**: a second different entropy throws `random mismatch` instead of freezing.

## Portability

One-flag / one-payout pattern can be reimplemented against another RNG. The account name **`orng.wax` does not exist** on EOS/Telos/XPR. Prefer orng on WAX over TAPOS / commit-reveal / drand fallbacks unless orng is unavailable and documented.

## Related labs

| Lab | Role |
| --- | --- |
| [v3 starter](https://github.com/pixel-journey/px-orng-v3-randnotify-starter) | Open + once |
| [legacy adapter](https://github.com/pixel-journey/px-orng-legacy-receiverand-adapter) | `receiverand` only |
| [coinflip](https://github.com/pixel-journey/px-orng-coinflip-escrow) | Entropy-equality on the book |
| [credit bucket](https://github.com/pixel-journey/px-orng-credit-bucket-monitor) | Fund the job before open |
| [ORNG learning path](https://github.com/pixel-journey/px-contract-examples-vault/blob/main/docs/ORNG-LEARNING-PATH.md) | Curriculum order |
