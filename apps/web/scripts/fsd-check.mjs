// FSD 경계 검사 (의존성 없음). 규칙은 docs/frontend-conventions.md §1.
//  - @/ 절대 경로는 2 depth(@/layer/slice, @/shared/segment)까지만
//  - import는 아래 레이어로만: shared < entities < features < widgets < views < app
//  - 같은 레이어의 다른 슬라이스(또는 shared의 다른 세그먼트)로 상대 경로 탈출 금지
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";

// 인자로 다른 앱의 src를 넘기면 그 앱을 검사한다(apps/admin).
const SRC = process.argv[2]
  ? resolve(process.argv[2])
  : resolve(new URL(".", import.meta.url).pathname, "../src");
const LAYERS = ["shared", "entities", "features", "widgets", "views", "app"];

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (/\.(ts|tsx|mjs)$/.test(name)) yield p;
  }
}

// "views/home/ui/x.tsx" → { layer: "views", slice: "home" }; 루트 파일(proxy.ts)은 app 취급
function unit(relPath) {
  const [layer, slice] = relPath.split(sep);
  if (!LAYERS.includes(layer)) return { layer: "app", slice: "" };
  return { layer, slice: layer === "app" ? "" : (slice ?? "") };
}

const errors = [];
for (const file of walk(SRC)) {
  const rel = relative(SRC, file);
  const from = unit(rel);
  const src = readFileSync(file, "utf8");
  for (const m of src.matchAll(/from\s+"([^"]+)"/g)) {
    const spec = m[1];
    if (spec.startsWith("@/")) {
      const parts = spec.slice(2).split("/");
      if (parts.length > 2) errors.push(`${rel}: deep import "${spec}" (max @/layer/slice)`);
      const to = { layer: parts[0], slice: parts[1] ?? "" };
      if (LAYERS.indexOf(to.layer) > LAYERS.indexOf(from.layer)) {
        errors.push(`${rel}: upward import "${spec}" from ${from.layer}`);
      }
      // shared 세그먼트끼리, app 내부끼리는 서로 import해도 된다.
      const sliced = from.layer !== "app" && from.layer !== "shared";
      if (sliced && to.layer === from.layer && to.slice !== from.slice) {
        errors.push(`${rel}: cross-slice import "${spec}"`);
      }
    } else if (spec.startsWith(".")) {
      const target = relative(SRC, resolve(dirname(file), spec));
      const to = unit(target);
      const escapes =
        to.layer !== from.layer || (from.layer !== "shared" && to.slice !== from.slice);
      if (escapes) {
        errors.push(`${rel}: relative import "${spec}" leaves ${from.layer}/${from.slice}`);
      }
    }
  }
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log("fsd-check: OK");
