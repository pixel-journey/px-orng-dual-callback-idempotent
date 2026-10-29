# Education

ORNG delivery has evolved. Contracts that support **both** modern and legacy callbacks must not pay twice if both fire.

**Pattern:** both entrypoints call the **same** `resolveShared` function. The job row carries `resolved` + `resolvedBy`. A second call returns `already_resolved` without mutating payout.

This lab uses a toy entropy→payout map so tests stay deterministic. It is **not** a claim about production fairness or house edge (see coinflip escrow for payout math).
