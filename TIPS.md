# Tips — dual ORNG callbacks

## Do

- Share **one** job row and **one** `resolved` flag for both delivery paths.
- Check `caller == orng.wax` before reading entropy.
- Prefer v3 `randnotify` for new contracts; keep legacy only if you must support old deliveries.
- Keep payout calculation pure given entropy so retries are deterministic if you ever need to recover from a failed token transfer (design carefully).

## Don’t

- Pay in the `randnotify` handler and again in `receiverand`.
- Clear or overwrite `payout` on the second callback.
- Assume the second callback’s entropy is “more fresh” and should win.

## Related path

1. [v3 starter](https://github.com/pixel-journey/px-orng-v3-randnotify-starter) — job table hygiene  
2. **This lab** — dual path idempotency  
3. Game labs — dice / roulette / loot using a **fixed** entropy string  
4. Prefer [wax-orng](https://github.com/worldwide-asset-exchange/wax-orng) over fallbacks

See [ORNG-LEARNING-PATH.md](https://github.com/pixel-journey/px-contract-examples-vault/blob/main/docs/ORNG-LEARNING-PATH.md).
