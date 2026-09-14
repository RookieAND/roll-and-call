import assert from "node:assert/strict";
import { deriveActionView } from "./derive-action-view";

const base = {
  sessionConfirmed: false,
  isWaiting: false,
  isClosed: false,
  isSignedIn: true,
  viewerConfirmed: false,
};

assert.equal(deriveActionView(base), "joinable");
assert.equal(deriveActionView({ ...base, isSignedIn: false }), "anon");
assert.equal(deriveActionView({ ...base, isClosed: true }), "closed");
// 마감 후에도 참여자·대기자는 자기 상태(일정 조율 진입)를 유지한다.
assert.equal(deriveActionView({ ...base, isClosed: true, viewerConfirmed: true }), "joined");
assert.equal(deriveActionView({ ...base, isClosed: true, isWaiting: true }), "waiting");
assert.equal(deriveActionView({ ...base, sessionConfirmed: true, viewerConfirmed: true }), "confirmed");

console.log("derive-action-view.check ok");
