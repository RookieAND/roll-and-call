// FSD 경계 검사. 규칙은 apps/web/docs/frontend-conventions.md §1. 인자는 검사할 src 폴더.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";

const SRC = resolve(process.argv[2] ?? "src");
const LAYERS = ["shared", "entities", "features", "widgets", "views", "app"];

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (/\.(ts|tsx|mjs)$/.test(name)) yield p;
  }
}

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
  for (const m of src.matchAll(/(?:\bfrom\s+|\bimport\s*\(?\s*)"([^"]+)"/g)) {
    const spec = m[1];
    if (spec.startsWith("@/")) {
      const parts = spec.slice(2).split("/");
      const serverEntry = parts.length === 3 && parts[2] === "server";
      if (parts.length > 2 && !serverEntry)
        errors.push(`${rel}: deep import "${spec}" (max @/layer/slice)`);
      const to = { layer: parts[0], slice: parts[1] ?? "" };
      if (LAYERS.indexOf(to.layer) > LAYERS.indexOf(from.layer)) {
        errors.push(`${rel}: upward import "${spec}" from ${from.layer}`);
      }
      const sliced = from.layer !== "app" && from.layer !== "shared";
      if (sliced && to.layer === from.layer && to.slice !== from.slice) {
        errors.push(`${rel}: cross-slice import "${spec}"`);
      }
    } else if (spec.startsWith(".")) {
      const target = relative(SRC, resolve(dirname(file), spec));
      const to = unit(target);
      // shared는 세그먼트(lib·ui·server·api)가 슬라이스다. 다른 세그먼트는 상대 경로가 아니라 @/shared/<세그먼트>로 가져온다.
      const escapes = to.layer !== from.layer || to.slice !== from.slice;
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
