/**
 * Multi-job composition: concurrent open jobs stay independent under dual paths.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { openJob, resolveShared } from "./dual.ts";

const orng = "orng.wax";
const even = "00000000aaaaaaaa";
const odd = "00000001bbbbbbbb";

describe("composition: multi-job dual path", () => {
  it("two open jobs resolve independently on different paths", () => {
    let jobs = openJob([], 1n, "alice");
    jobs = openJob(jobs, 2n, "bob");
    const a = resolveShared(jobs, {
      path: "randnotify",
      jobId: 1n,
      caller: orng,
      orng,
      entropy: even,
    });
    assert.equal(a.status, "resolved");
    if (a.status !== "resolved") return;
    assert.equal(a.payout, 19600n);
    const b = resolveShared(a.jobs, {
      path: "receiverand",
      jobId: 2n,
      caller: orng,
      orng,
      entropy: odd,
    });
    assert.equal(b.status, "resolved");
    if (b.status !== "resolved") return;
    assert.equal(b.payout, 0n);
    const alice = b.jobs.find((j) => j.id === 1n)!;
    const bob = b.jobs.find((j) => j.id === 2n)!;
    assert.equal(alice.resolvedBy, "randnotify");
    assert.equal(alice.payout, 19600n);
    assert.equal(bob.resolvedBy, "receiverand");
    assert.equal(bob.payout, 0n);
  });

  it("resolving job 1 does not mark job 2 resolved", () => {
    let jobs = openJob([], 10n, "alice");
    jobs = openJob(jobs, 20n, "alice");
    const r = resolveShared(jobs, {
      path: "randnotify",
      jobId: 10n,
      caller: orng,
      orng,
      entropy: even,
    });
    assert.equal(r.status, "resolved");
    if (r.status !== "resolved") return;
    const stillOpen = r.jobs.find((j) => j.id === 20n)!;
    assert.equal(stillOpen.resolved, false);
    assert.equal(stillOpen.payout, 0n);
    assert.equal(stillOpen.resolvedBy, null);
  });

  it("receiverand first then randnotify keeps resolvedBy and payout", () => {
    let jobs = openJob([], 3n, "carol");
    const first = resolveShared(jobs, {
      path: "receiverand",
      jobId: 3n,
      caller: orng,
      orng,
      entropy: even,
    });
    assert.equal(first.status, "resolved");
    if (first.status !== "resolved") return;
    const second = resolveShared(first.jobs, {
      path: "randnotify",
      jobId: 3n,
      caller: orng,
      orng,
      entropy: odd,
    });
    assert.equal(second.status, "already_resolved");
    assert.equal(second.jobs[0].resolvedBy, "receiverand");
    assert.equal(second.jobs[0].payout, 19600n);
  });

  it("same entropy twice still pays once", () => {
    let jobs = openJob([], 4n, "dave");
    const first = resolveShared(jobs, {
      path: "randnotify",
      jobId: 4n,
      caller: orng,
      orng,
      entropy: even,
    });
    assert.equal(first.status, "resolved");
    if (first.status !== "resolved") return;
    const second = resolveShared(first.jobs, {
      path: "randnotify",
      jobId: 4n,
      caller: orng,
      orng,
      entropy: even,
    });
    assert.equal(second.status, "already_resolved");
    assert.equal(second.jobs[0].payout, 19600n);
  });
});
