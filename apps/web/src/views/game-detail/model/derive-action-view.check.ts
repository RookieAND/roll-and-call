import assert from "node:assert/strict";

import { deriveActionView, GAME_ACTION_VIEW } from "./derive-action-view";

const base = {
  sessionConfirmed: false,
  isGm: false,
  isWaiting: false,
  isClosed: false,
  isSignedIn: true,
  viewerConfirmed: false,
};

assert.equal(deriveActionView(base), GAME_ACTION_VIEW.joinable);
assert.equal(deriveActionView({ ...base, isSignedIn: false }), GAME_ACTION_VIEW.anon);
assert.equal(deriveActionView({ ...base, isClosed: true }), GAME_ACTION_VIEW.closed);
// 마감 후에도 참여자·대기자는 자기 상태(일정 조율 진입)를 유지한다.
assert.equal(
  deriveActionView({ ...base, isClosed: true, viewerConfirmed: true }),
  GAME_ACTION_VIEW.joined,
);
assert.equal(
  deriveActionView({ ...base, isClosed: true, isWaiting: true }),
  GAME_ACTION_VIEW.waiting,
);
assert.equal(
  deriveActionView({ ...base, sessionConfirmed: true, viewerConfirmed: true }),
  GAME_ACTION_VIEW.confirmed,
);
// 확정 후에도 대기자는 순번·대기 취소를 유지한다.
assert.equal(
  deriveActionView({ ...base, sessionConfirmed: true, isWaiting: true }),
  GAME_ACTION_VIEW.confirmedWaiting,
);
// GM은 모집 중이든 확정 뒤든 같은 운영 관리 바를 본다.
assert.equal(deriveActionView({ ...base, isGm: true }), GAME_ACTION_VIEW.gm);
assert.equal(deriveActionView({ ...base, isGm: true, isClosed: true }), GAME_ACTION_VIEW.gm);
assert.equal(
  deriveActionView({ ...base, isGm: true, sessionConfirmed: true }),
  GAME_ACTION_VIEW.gm,
);

console.log("derive-action-view.check ok");
