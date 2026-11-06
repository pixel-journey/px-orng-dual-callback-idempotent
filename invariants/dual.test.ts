import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { openJob, resolveShared, educationalPayout } from "./dual.ts";

const orng = "orng.wax";
const entropyEven = "00000000aaaaaaaa";
const entropyOdd = "00000001bbbbbbbb";

describe("openJob", () => {
  it("refuses non-positive id", () => {
    assert.throws(() => openJob([], 0n, "alice"), /bad job id/);
  });

  it("refuses duplicate id", () => {
    const jobs = openJob([], 1n, "alice");
    assert.throws(() => openJob(jobs, 1n, "bob"), /already open/);
  });
});

describe("educationalPayout", () => {
  it("even leading word pays 19600; odd pays 0", () => {
    assert.equal(educationalPayout(entropyEven), 19600n);
    assert.equal(educationalPayout(entropyOdd), 0n);
  });

  it("refuses short or non-hex entropy", () => {
    assert.throws(() => educationalPayout("abc"), /entropy/);
    assert.throws(() => educationalPayout("zzzzzzzz"), /entropy/);
  });
});

describe("resolveShared", () => {
  it("randnotify resolves once with payout", () => {
    let jobs = openJob([], 1n, "alice");
    const r = resolveShared(jobs, {
      path: "randnotify",
      jobId: 1n,
      caller: orng,
      orng,
      entropy: entropyEven,
    });
    assert.equal(r.status, "resolved");
    if (r.status !== "resolved") return;
    assert.equal(r.payout, 19600n);
    assert.equal(r.jobs[0].resolvedBy, "randnotify");
  });

  it("second path is already_resolved and keeps first payout", () => {
    let jobs = openJob([], 1n, "alice");
    const first = resolveShared(jobs, {
      path: "randnotify",
      jobId: 1n,
      caller: orng,
      orng,
      entropy: entropyEven,
    });
    assert.equal(first.status, "resolved");
    if (first.status !== "resolved") return;
    const second = resolveShared(first.jobs, {
      path: "receiverand",
      jobId: 1n,
      caller: orng,
      orng,
      entropy: entropyOdd,
    });
    assert.equal(second.status, "already_resolved");
    assert.equal(second.jobs[0].payout, 19600n);
    assert.equal(second.jobs[0].resolvedBy, "randnotify");
  });

  it("receiverand can be the first resolver", () => {
    let jobs = openJob([], 2n, "bob");
    const r = resolveShared(jobs, {
      path: "receiverand",
      jobId: 2n,
      caller: orng,
      orng,
      entropy: entropyOdd,
    });
    assert.equal(r.status, "resolved");
    if (r.status !== "resolved") return;
    assert.equal(r.payout, 0n);
    assert.equal(r.jobs[0].resolvedBy, "receiverand");
  });

  it("refuses non-orng caller", () => {
    const jobs = openJob([], 1n, "alice");
    assert.throws(
      () =>
        resolveShared(jobs, {
          path: "randnotify",
          jobId: 1n,
          caller: "evil",
          orng,
          entropy: entropyEven,
        }),
      /orng/,
    );
  });

  it("refuses unknown job", () => {
    assert.throws(
      () =>
        resolveShared([], {
          path: "randnotify",
          jobId: 1n,
          caller: orng,
          orng,
          entropy: entropyEven,
        }),
      /unknown job/,
    );
  });
});
