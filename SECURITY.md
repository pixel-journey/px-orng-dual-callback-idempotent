# Security notes

| Issue | Lab mitigation |
|-------|----------------|
| Double callback double pay | shared resolver + resolved flag |
| Second path overwrites payout | already_resolved keeps first payout |
| Spoofed caller | caller must equal orng |

Still required on-chain: real auth, job/wager linkage, RAM, and credit accounting.
