// 디자인 토큰 우회 검사. 색은 .dark에서 값이 바뀌지 않아 다크 모드를 소리 없이 깨뜨리고,
// 글씨 크기·라디우스·간격은 임의값을 쓰기 시작하면 스케일이 다시 흩어진다.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";

const ROOTS = [
  resolve(new URL(".", import.meta.url).pathname, "../src"),
  resolve(new URL(".", import.meta.url).pathname, "../../../packages/ui/src"),
  resolve(new URL(".", import.meta.url).pathname, "../../../packages/tiptap/src"),
];
// 토큰 정의 자체와, 테마와 무관한 고정 색(사람별 아바타 팔레트)은 예외.
const ALLOW = [/styles\.css$/, /packages\/ui\/src\/avatar(-color\.ts|\.tsx)$/];
// 스케일을 정의하는 파일은 값을 직접 적어야 한다.
const SCALE_ALLOW = [/packages\/ui\/src\/text\.tsx$/];
const HEX = /#[0-9A-Fa-f]{6}\b/g;
// 프로젝트 토큰이 아닌 Tailwind 기본 팔레트
const DEFAULT_PALETTE =
  /\b(?:bg|text|border|from|via|to|ring|outline|fill|stroke|decoration|shadow)-(?:red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|slate|zinc|neutral|stone)-\d{2,3}\b/g;
// 글씨 크기는 Text의 typography가 정한다(정의 자체는 text.tsx 예외).
const FONT_SIZE = /\btext-\[[0-9.]+px\]/g;
// 라디우스는 --radius-* 번호 토큰만. Tailwind 기본 이름은 값이 달라 섞인다.
const RADIUS = /\brounded(?:-[tblrse]{1,2})?-(?:\[[^\]]+\]|xs|sm|md|lg|xl|2xl|3xl|4xl)\b/g;
// 간격은 Tailwind 스케일(4px 배수)만. 20px 초과는 컴포넌트 규격이라 통과시킨다.
const SPACING =
  /\b(?:p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|gap|gap-x|gap-y|space-x|space-y)-\[-?(?:[0-9]|1[0-9]|20)(?:\.[0-9]+)?px\]/g;

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
      if (SCALE_ALLOW.some((re) => re.test(file))) return;
      for (const m of line.match(FONT_SIZE) ?? [])
        errors.push(`${rel}:${i + 1}: 임의 글씨 크기 ${m}`);
      for (const m of line.match(RADIUS) ?? [])
        errors.push(`${rel}:${i + 1}: 스케일 밖 라디우스 ${m}`);
      for (const m of line.match(SPACING) ?? []) errors.push(`${rel}:${i + 1}: 임의 간격 ${m}`);
    });
  }
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  console.error(
    `\n색·라디우스는 packages/ui/src/styles.css의 토큰만, 글씨 크기는 Text의 typography만,` +
      ` 간격은 Tailwind 스케일(4px 배수)만 쓴다. 새 축이 필요하면 styles.css에 추가한다.`,
  );
  process.exit(1);
}
console.log("tokens-check: OK");
