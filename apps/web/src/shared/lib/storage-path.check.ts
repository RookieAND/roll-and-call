import assert from "node:assert/strict";

import { gameImagePathOf } from "./storage-path";

const base = "https://nrftzumkubhizerpvycl.supabase.co/storage/v1/object/public/game-thumbnails/";

assert.equal(gameImagePathOf(`${base}u1/a.png`), "u1/a.png");
assert.equal(gameImagePathOf(`${base}u1/a.png?t=1`), "u1/a.png");
assert.equal(gameImagePathOf(`${base}u1/%ED%95%9C.png`), "u1/한.png");
assert.equal(
  gameImagePathOf("https://x.supabase.co/storage/v1/object/public/avatars/u1/a.png"),
  null,
);
assert.equal(gameImagePathOf("https://cdn.discordapp.com/a.png"), null);
assert.equal(gameImagePathOf(base), null);

console.log("storage-path.check ok");
