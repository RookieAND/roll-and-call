import assert from "node:assert";

import { derivePlayStance, PLAY_STANCE } from "./play-stance";

assert.equal(derivePlayStance({ hosted: 4, played: 0 }), null);
assert.equal(derivePlayStance({ hosted: 5, played: 0 }), PLAY_STANCE.gm);
assert.equal(derivePlayStance({ hosted: 7, played: 3 }), PLAY_STANCE.gm);
assert.equal(derivePlayStance({ hosted: 3, played: 7 }), PLAY_STANCE.player);
assert.equal(derivePlayStance({ hosted: 69, played: 31 }), null);
assert.equal(derivePlayStance({ hosted: 3, played: 3 }), null);
assert.equal(derivePlayStance({ hosted: 12, played: 3 }), PLAY_STANCE.gm);

console.log("play-stance.check ok");
