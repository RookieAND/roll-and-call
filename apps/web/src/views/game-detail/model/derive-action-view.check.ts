import assert from "node:assert/strict";
import { deriveActionView } from "./derive-action-view";

const base = {
  sessionConfirmed: false,
  isGm: false,
  isCoordinate: true,
  deadlinePassed: false,
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
// 1-w: 확정 후에도 대기자는 순번·대기 취소를 유지한다.
assert.equal(deriveActionView({ ...base, sessionConfirmed: true, isWaiting: true }), "confirmed-waiting");
// GM: 일정 방식·기한에 따라 세 갈래, 확정되면 누구나 같은 확정 바.
assert.equal(deriveActionView({ ...base, isGm: true }), "gm-coordinate");
assert.equal(deriveActionView({ ...base, isGm: true, isCoordinate: false }), "gm-fixed");
assert.equal(deriveActionView({ ...base, isGm: true, deadlinePassed: true, isClosed: true }), "gm-confirm");
assert.equal(deriveActionView({ ...base, isGm: true, sessionConfirmed: true }), "confirmed");

console.log("derive-action-view.check ok");
