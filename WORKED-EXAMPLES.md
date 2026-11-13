# Worked examples — dual callback resolver

Educational payout: even first 8 hex digits → `19600n`, odd → `0n` (not fair chain RNG).

## Example 1 — randnotify first

```text
openJob → id 1, alice
resolveShared(path: randnotify, entropy: "00…") → status resolved, payout 19600n
resolveShared(path: receiverand, entropy: "ff…") → already_resolved, payout stays 19600n
```

## Example 2 — receiverand first

```text
resolveShared(path: receiverand, entropy: odd) → resolved, payout 0n
later randnotify with even entropy → already_resolved, payout still 0n
```

First path wins. Second path never rewrites payout.

## Example 3 — wrong caller

`caller !== orng` → throw. Job remains unresolved so a correct oracle retry can succeed.

## Example 4 — two jobs

Job 1 and job 2 open. Resolve job 1 only. Job 2 stays pending with `payout 0`. Composition locks no cross-bleed.

## Example 5 — production intent

```text
v3 randnotify  ─┐
                ├─→ resolveShared (one table, one resolved flag)
legacy receiverand ─┘
```

Do not implement two separate “pay if not paid” functions that can both succeed under race assumptions without a shared latch.
