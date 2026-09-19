// 색 토큰 우회 검사. 생 hex와 Tailwind 기본 팔레트는 .dark에서 값이 바뀌지 않아
// 다크 모드를 소리 없이 깨뜨린다. 색은 packages/ui의 --color-* 토큰만 쓴다.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";

const ROOTS = [
  resolve(new URL(".", import.meta.url).pathname, "../src"),
  resolve(new URL(".", import.meta.url).pathname, "../../../packages/ui/src"),
];
// 토큰 정의 자체와, 테마와 무관한 고정 색(사람별 아바타 팔레트)은 예외.
const ALLOW = [/styles\.css$/, /packages\/ui\/src\/avatar(-color\.ts|\.tsx)$/];
const HEX = /#[0-9A-Fa-f]{6}\b/g;
// 프로젝트 토큰이 아닌 Tailwind 기본 팔레트
const DEFAULT_PALETTE =
  /\b(?:bg|text|border|from|via|to|ring|outline|fill|stroke|decoration|shadow)-(?:red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|slate|zinc|neutral|stone)-\d{2,3}\b/g;

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (/\.(ts|tsx|css)$/.test(name)) yield p;
  }
}

const errors = [];
for (const root of ROOTS) {
  for (const file of walk(root)) {
    if (ALLOW.some((re) => re.test(file))) continue;
    const rel = relative(resolve(root, "../.."), file);
    const src = readFileSync(file, "utf8");
    src.split("\n").forEach((line, i) => {
      if (line.includes("tokens-check-ignore")) return;
      for (const m of line.match(HEX) ?? []) errors.push(`${rel}:${i + 1}: raw hex ${m}`);
      for (const m of line.match(DEFAULT_PALETTE) ?? []) {
        errors.push(`${rel}:${i + 1}: Tailwind 기본 팔레트 ${m}`);
      }
    });
  }
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  console.error(
    `\n색은 --color-* 토큰만 쓴다. 새 축이 필요하면 packages/ui/src/styles.css에 추가하고 .dark 값도 함께 넣는다.`,
  );
  process.exit(1);
}
console.log("tokens-check: OK");
