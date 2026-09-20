import assert from "node:assert/strict";

import { swipeDirection } from "./swipe-direction";

assert.equal(swipeDirection(-120, 10), "next");
assert.equal(swipeDirection(120, -10), "previous");
// 짧게 튕긴 것과 세로로 끈 것은 넘김이 아니다.
assert.equal(swipeDirection(-20, 0), null);
assert.equal(swipeDirection(-80, 140), null);

console.log("swipe-direction.check ok");
