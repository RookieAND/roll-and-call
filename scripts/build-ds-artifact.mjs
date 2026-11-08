// packages/ui와 ds-bundle에서 Design System 아티팩트 규격의 project/ 폴더를 만든다.
// 사용: pnpm ds:artifact  (먼저 design-sync 빌드로 ds-bundle/을 만들어 둔다)
// 결과: .design-sync/.cache/artifact/project/**, deletes.json (아티팩트에서 지울 옛 경로)
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";

const ROOT = resolve(new URL("..", import.meta.url).pathname);
const BUNDLE = join(ROOT, "ds-bundle");
const OUT = join(ROOT, ".design-sync/.cache/artifact");
const PROJECT = join(OUT, "project");
const TITLE = "Nat20";
const NAMESPACE = "RollAndCallUI";
const SKIP_COMPONENTS = new Set(["UiImage"]);

const write = (path, text) => {
  mkdirSync(dirname(join(PROJECT, path)), { recursive: true });
  writeFileSync(join(PROJECT, path), text);
};
const copy = (from, path) => {
  mkdirSync(dirname(join(PROJECT, path)), { recursive: true });
  cpSync(from, join(PROJECT, path));
};

rmSync(OUT, { recursive: true, force: true });
mkdirSync(PROJECT, { recursive: true });

// ---------- styles.css 읽기 ----------
const lines = readFileSync(join(ROOT, "packages/ui/src/styles.css"), "utf8").split("\n");
const lightStart = lines.findIndex((l, i) => i > 300 && l.startsWith('[data-theme="light"]'));
const darkStart = lines.findIndex((l, i) => i > lightStart && l.startsWith('[data-theme="dark"]'));
const readDeclarations = (from, to) => {
  const found = {};
  for (let i = from; i < to; i++) {
    const m = lines[i].match(/^\s*(--[\w-]+):\s*(.+?);\s*(?:\/\*.*\*\/)?$/);
    if (m) found[m[1].slice(2)] = m[2];
  }
  return found;
};
const blockEnd = (start) => {
  let i = start;
  while (!lines[i].startsWith("}")) i++;
  return i;
};
const base = readDeclarations(0, lightStart);
const light = readDeclarations(lightStart, blockEnd(lightStart));
const dark = readDeclarations(darkStart, blockEnd(darkStart));

// ---------- 값 변환 ----------
const hex2 = (n) => Math.round(n).toString(16).padStart(2, "0");
function colorValue(raw) {
  const value = raw.trim();
  const alias = value.match(/^var\(--([\w-]+)\)$/);
  if (alias) return `{${alias[1]}}`;
  if (/^#[0-9a-fA-F]{3,8}$/.test(value)) return value.toLowerCase();
  const fn = value.match(
    /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)\s*(?:[/,]\s*([\d.]+%?))?\s*\)$/,
  );
  if (fn) {
    const [, r, g, b, a] = fn;
    let alpha = a === undefined ? 1 : parseFloat(a);
    if (a?.endsWith("%")) alpha /= 100;
    return `#${hex2(+r)}${hex2(+g)}${hex2(+b)}${alpha < 1 ? hex2(alpha * 255) : ""}`;
  }
  return null;
}

// ---------- 용도 설명 ----------
const PRIMITIVE_NOTE = "프리미티브 색 단계. 화면 코드는 이 값을 직접 읽지 않고 역할 토큰을 쓴다.";
const ROLE_NOTES = {
  "bg-canvas-base": "카드·시트·입력칸의 표면. 유틸리티 `bg-surface`.",
  "bg-canvas-sunken": "페이지 바탕. 표면(canvas-base) 아래에 깔린다. `bg-canvas`.",
  "bg-canvas-raised": "카드 안 구획과 hover 배경. `bg-gray-50`.",
  "bg-canvas-dim": "다이얼로그·시트 뒤를 덮는 스크림. `bg-dim`.",
  "bg-canvas-overlay": "위에 떠 있는 작은 면(스포일러 덮개의 라벨).",
  "bg-secondary": "보조 면(칩, 구획). 위 글씨는 fg-muted·fg-hint. `bg-gray-100`.",
  "bg-secondary-strong": "보조 면의 hover·눌림 상태.",
  "bg-primary": "주요 액션의 단색 면. 위 글씨는 fg-on-primary.",
  "bg-primary-hover": "주요 액션 단색 면의 hover.",
  "bg-primary-weak": "연한 강조 면(선택된 칩, 배지). 위 글씨는 fg-primary.",
  "bg-primary-weakest": "가장 연한 강조 면(안내 배너). 위 글씨는 fg-primary.",
  "bg-success": "성공 단색 면. 위 글씨는 fg-on-solid.",
  "bg-success-weak": "성공 상태의 연한 면. 위 글씨는 fg-success.",
  "bg-warning": "경고 단색 면. 위 글씨는 fg-on-solid.",
  "bg-warning-weak": "경고 상태의 연한 면. 위 글씨는 fg-warning.",
  "bg-warning-weakest": "주의·안내 배너의 가장 연한 호박색 면. 위 글씨는 fg-warning.",
  "bg-danger": "위험·확정 단색 면. 위 글씨는 fg-on-solid.",
  "bg-danger-weak": "오류·위험 상태의 연한 면. 위 글씨는 fg-danger.",
  "bg-danger-weak-hover": "연한 위험 면 위의 hover·선택 상태.",
  "bg-discord": "디스코드 연결 버튼 면. 위 글씨는 흰색.",
  "bg-discord-hover": "디스코드 버튼 hover.",
  "bg-spark": "스파크(특별 강조) 단색 면. 위 글씨는 fg-on-spark.",
  "bg-toast": "토스트 면. 위 글씨는 fg-on-toast 계열.",
  "fg-normal": "본문 글씨. bg-canvas-base 위에서 대비 4.5:1 이상.",
  "fg-muted": "보조 문구. bg-canvas-base 위에서 대비 4.5:1 이상. `text-gray-600`.",
  "fg-hint": "힌트·자리 표시. bg-canvas-base와 bg-secondary 위에서 대비 4.5:1 이상. `text-hint`.",
  "fg-label": "라벨·버튼·메뉴 글씨. bg-canvas-base 위에서 대비 4.5:1 이상. `text-label`.",
  "fg-disabled": "비활성 글씨. 대비 기준에서 제외된다. `text-disabled`.",
  "fg-primary": "강조 글씨. bg-canvas-base·bg-primary-weak 위에서 읽힌다. `text-tinted-ink`.",
  "fg-primary-strong": "강조 글씨의 진한 단계(활성 탭, 사이드바).",
  "fg-success": "성공 글씨. bg-success-weak 위에서 읽힌다.",
  "fg-success-strong": "성공 글씨의 진한 단계. `text-success-800`.",
  "fg-warning": "경고·주의 글씨. bg-warning-weak와 bg-warning-weakest 위에서 대비 4.5:1 이상.",
  "fg-danger": "오류·위험 글씨. bg-danger-weak 위에서 읽힌다.",
  "fg-on-primary": "bg-primary 위의 글씨.",
  "fg-on-solid":
    "bg-success·bg-warning·bg-danger 단색 면 위의 글씨. 다크에서 면이 밝아지므로 어두운 색이다. `text-on-solid`.",
  "fg-inverse": "반전 면(토스트 등) 위의 글씨. `text-inverse`.",
  "fg-gm": "GM 표시 글씨.",
  "fg-on-spark": "bg-spark 위의 글씨.",
  "fg-on-toast": "bg-toast 위의 기본 글씨.",
  "fg-on-toast-success": "bg-toast 위의 성공 표시.",
  "fg-on-toast-warning": "bg-toast 위의 경고 표시.",
  "fg-on-toast-danger": "bg-toast 위의 위험 표시.",
  "fg-on-toast-muted": "bg-toast 위의 보조 글씨.",
  "border-subtle": "가장 옅은 구분선.",
  "border-normal": "일반 구분선·카드 테두리. 장식용이라 대비 기준에서 제외된다. `border-gray-200`.",
  "border-strong": "강한 구분선. `border-gray-300`.",
  "border-input":
    "입력칸·체크박스·라디오 테두리. bg-canvas-base 위에서 대비 3:1 이상. `border-input`.",
  "border-primary": "강조 면의 테두리.",
  "border-primary-strong": "선택·강조 테두리와 링.",
  "border-focus": "포커스 링. 모든 면에서 3:1 이상.",
  "border-success": "성공 상태 테두리.",
  "border-danger": "오류 상태 테두리.",
  "border-warning": "경고·주의 상태 테두리. `border-warning-border`.",
  "bg-highlight-extreme": "주사위 극단 결과의 면.",
  "border-highlight-extreme": "주사위 극단 결과의 테두리.",
  "fg-highlight-extreme": "주사위 극단 결과의 글씨.",
  "bg-highlight-critical": "주사위 대성공의 면.",
  "fg-highlight-critical": "주사위 대성공의 글씨.",
  "fg-highlight-sparkle": "대성공의 반짝임.",
  "shadow-highlight-glow": "대성공의 빛 번짐.",
  "fg-rank-gold": "순위 1위·금 단계 글씨.",
  "fg-rank-bronze": "순위 3위·동 단계 글씨.",
  "fg-rank-silver": "순위 2위·은 단계 글씨.",
  "bg-rank-silver": "은 단계 면.",
};

// ---------- 색 토큰 ----------
const warnings = [];
const colorTokens = [];
const seen = new Set();
const pushColor = (name, lightRaw, darkRaw, usage) => {
  if (seen.has(name)) return;
  seen.add(name);
  const lv = colorValue(lightRaw);
  if (!lv) return warnings.push(`색 값을 읽지 못함: ${name}: ${lightRaw}`);
  const dv = darkRaw === undefined ? null : colorValue(darkRaw);
  colorTokens.push({ name, value: dv && dv !== lv ? { light: lv, dark: dv } : lv, usage });
};
for (const [name, raw] of Object.entries(base)) {
  if (name.startsWith("rc-color-")) pushColor(name, raw, undefined, PRIMITIVE_NOTE);
}
for (const [name, raw] of Object.entries(light)) {
  const m = name.match(/^rc-color-((?:bg|fg|border|shadow)-[\w-]+)$/);
  if (!m) continue;
  const usage = ROLE_NOTES[m[1]];
  if (!usage) warnings.push(`용도 설명 없음: ${name}`);
  pushColor(name, raw, dark[name], usage ?? "역할 토큰.");
}
for (const name of Object.keys(dark)) {
  const m = name.match(/^rc-color-((?:bg|fg|border|shadow)-[\w-]+)$/);
  if (m && !(name in light)) warnings.push(`다크에만 있는 역할 토큰: ${name}`);
}

// ---------- 그 밖의 토큰 ----------
const lengthTokens = (filter, usage) =>
  Object.entries(base)
    .filter(([name]) => filter(name))
    .map(([name, value]) => ({ name, value, usage: usage(name) }));
const spacing = lengthTokens(
  (n) => n.startsWith("rc-size-space-"),
  (n) => `간격. 유틸리티 \`p-${n.slice(14)}\`, \`gap-${n.slice(14)}\`. 이름은 rem×100이다.`,
);
const radius = lengthTokens(
  (n) => n.startsWith("rc-radius-"),
  (n) => `라디우스. 유틸리티 \`rounded-${n.slice(10)}\`.`,
);
const sizes = lengthTokens(
  (n) => n.startsWith("rc-size-") && !n.startsWith("rc-size-space-"),
  (n) => `컴포넌트 치수(${n.slice(8)}). 터치 대상은 44px보다 작게 하지 않는다.`,
);
const zIndex = lengthTokens(
  (n) => n.startsWith("rc-z-"),
  (n) => `쌓임 순서(${n.slice(5)}).`,
);
const themeBlock = lines
  .slice(
    lines.findIndex((l) => l.startsWith("@theme {")),
    lightStart,
  )
  .join("\n");
const SHADOW_NOTES = {
  popup: "팝오버·셀렉트의 그림자. `shadow-popup`.",
  sheet: "바닥 시트·플로팅 바의 그림자. `shadow-sheet`.",
  "sheet-left": "왼쪽 시트의 그림자. `shadow-sheet-left`.",
  "sheet-right": "오른쪽 시트의 그림자. `shadow-sheet-right`.",
  modal: "다이얼로그·데스크톱 모달의 그림자. `shadow-modal`.",
};
const shadow = [...themeBlock.matchAll(/--shadow-([\w-]+):\s*(.+?);/g)].map(([, key, raw]) => ({
  name: `shadow-${key}`,
  value: raw.replace(
    /rgb\((\d+) (\d+) (\d+) \/ ([\d.]+)\)/g,
    (_, r, g, b, a) => `#${hex2(+r)}${hex2(+g)}${hex2(+b)}${hex2(a * 255)}`,
  ),
  usage: SHADOW_NOTES[key] ?? "오버레이 그림자.",
}));

// ---------- 글자 ----------
const TEXT_WEIGHT = {
  heading1: 800,
  heading2: 800,
  heading3: 700,
  subtitle1: 700,
  subtitle2: 700,
  metric: 800,
};
const TEXT_TRACKING = { heading1: "-0.025em", metric: "-0.025em" };
const textStyles = [
  ...themeBlock.matchAll(/--text-([a-z0-9]+):\s*(\d+)px;\s*--text-\1--line-height:\s*([\d.]+);/g),
].map(([, name, px, lh]) => ({
  name,
  fontSize: `${px}px`,
  lineHeight: lh,
  fontWeight: TEXT_WEIGHT[name] ?? 400,
  ...(TEXT_TRACKING[name] ? { letterSpacing: TEXT_TRACKING[name] } : {}),
}));
const sansStack = themeBlock
  .match(/--font-sans:\s*([\s\S]+?);/)[1]
  .replace(/\s+/g, " ")
  .trim();
const group = (name, names) => ({
  name,
  family: "sans",
  styles: textStyles.filter((s) => names.includes(s.name)),
});
const tokens = {
  name: TITLE,
  version: 1,
  color: {
    themes: [
      { id: "light", name: "라이트" },
      { id: "dark", name: "다크" },
    ],
    tokens: colorTokens,
  },
  type: {
    fonts: ["Pretendard Variable", "Pretendard"].map((family) => ({
      family,
      file: "fonts/PretendardVariable.woff2",
      weight: "45 920",
      style: "normal",
    })),
    families: { sans: sansStack },
    groups: [
      group("제목", ["metric", "heading1", "heading2", "heading3"]),
      group("부제", ["subtitle1", "subtitle2"]),
      group("본문", ["body2", "body3", "body4", "body5"]),
    ],
  },
  spacing: { tokens: spacing },
  radius: { tokens: radius },
  shadow: { tokens: shadow },
  size: { note: "컴포넌트 치수.", tokens: sizes },
  zIndex: { tokens: zIndex },
  meta: { source: "repo", package: "packages/ui", synced: new Date().toISOString().slice(0, 10) },
};

// 문법 검사: 이름 규칙, 중복, 별칭 대상, 순환
const NAME = /^[A-Za-z0-9][A-Za-z0-9_.-]{0,63}$/;
const names = new Map();
for (const family of ["color", "spacing", "radius", "shadow", "size", "zIndex"]) {
  for (const t of tokens[family].tokens) {
    if (!NAME.test(t.name)) throw new Error(`이름 규칙 위반: ${t.name}`);
    if (names.has(t.name)) throw new Error(`이름 중복: ${t.name}`);
    names.set(t.name, family);
  }
}
for (const t of colorTokens) {
  for (const v of typeof t.value === "string" ? [t.value] : Object.values(t.value)) {
    const target = v.match(/^\{(.+)\}$/)?.[1];
    if (target && names.get(target) !== "color")
      throw new Error(`별칭 대상 없음: ${t.name} -> ${target}`);
  }
}
const limits = { spacing: 60, radius: 60, shadow: 60, size: 60, zIndex: 60 };
for (const [family, max] of Object.entries(limits)) {
  if (tokens[family].tokens.length > max) throw new Error(`${family} 토큰이 ${max}개를 넘음`);
}
write("tokens.json", `${JSON.stringify(tokens, null, 2)}\n`);

// ---------- tokens.css ----------
const cssValue = (v) => (v.startsWith("{") ? `var(--${v.slice(1, -1)})` : v);
const themeValue = (t, theme) => (typeof t.value === "string" ? t.value : t.value[theme]);
const declare = (theme) =>
  colorTokens
    .filter((t) => theme === "light" || typeof t.value !== "string" || t.value.startsWith("{"))
    .map((t) => `  --${t.name}: ${cssValue(themeValue(t, theme) ?? themeValue(t, "light"))};`)
    .join("\n");
const darkOverrides = colorTokens
  .filter((t) => typeof t.value !== "string")
  .map((t) => `  --${t.name}: ${cssValue(t.value.dark)};`)
  .join("\n");
const darkAliases = colorTokens
  .filter((t) => typeof t.value === "string" && t.value.startsWith("{"))
  .map((t) => `  --${t.name}: ${cssValue(t.value)};`)
  .join("\n");
const typeClasses = textStyles
  .map(
    (s) =>
      `.${s.name} { font-family: var(--font-sans); font-size: ${s.fontSize}; line-height: ${s.lineHeight}; font-weight: ${s.fontWeight};${s.letterSpacing ? ` letter-spacing: ${s.letterSpacing};` : ""} }`,
  )
  .join("\n");
const fontFaces = tokens.type.fonts
  .map(
    (f) =>
      `@font-face { font-family: "${f.family}"; src: url("./${f.file}") format("woff2"); font-weight: ${f.weight}; font-style: ${f.style}; font-display: swap; }`,
  )
  .join("\n");
write(
  "tokens.css",
  `/* ${TITLE} — generated from tokens.json */
:root, [data-theme="light"] {
${declare("light")}
${shadow.map((t) => `  --${t.name}: ${t.value};`).join("\n")}
}
[data-theme="dark"] {
${darkOverrides}
${darkAliases}
}
:root {
${[...spacing, ...radius, ...sizes, ...zIndex].map((t) => `  --${t.name}: ${t.value};`).join("\n")}
  --font-sans: ${sansStack};
}
${typeClasses}
${fontFaces}
`,
);
copy(join(BUNDLE, "fonts/PretendardVariable.woff2"), "fonts/PretendardVariable.woff2");

// ---------- 번들과 라이브러리 ----------
const esbuild = createRequire(join(ROOT, ".ds-sync/package.json"))("esbuild");
const nodePaths = [join(ROOT, "apps/web/node_modules"), join(ROOT, "packages/ui/node_modules")];
const globalReact = {
  name: "react-global",
  setup(b) {
    b.onResolve({ filter: /^react$/ }, () => ({ path: "react", namespace: "global-react" }));
    b.onLoad({ filter: /.*/, namespace: "global-react" }, () => ({
      contents: "module.exports = window.React;",
      loader: "js",
    }));
  },
};
const lib = async (entry, plugins = []) =>
  (
    await esbuild.build({
      stdin: { contents: entry, resolveDir: join(ROOT, "apps/web"), loader: "js" },
      bundle: true,
      minify: true,
      format: "iife",
      platform: "browser",
      target: "es2020",
      nodePaths,
      plugins,
      define: { "process.env.NODE_ENV": '"production"' },
      write: false,
    })
  ).outputFiles[0].text;
const reactVersion = JSON.parse(
  readFileSync(join(ROOT, "apps/web/node_modules/react/package.json"), "utf8"),
).version;
write(
  "components/lib/react.js",
  await lib('import * as React from "react"; window.React = Object.assign({}, React);'),
);
write(
  "components/lib/react-dom.js",
  await lib(
    'import * as D from "react-dom"; import * as C from "react-dom/client"; window.ReactDOM = Object.assign({}, D, C);',
    [globalReact],
  ),
);

const componentNames = readdirSync(join(BUNDLE, "_preview"))
  .map((f) => f.replace(/\.js$/, ""))
  .filter((n) => !SKIP_COMPONENTS.has(n));
let bundleJs = readFileSync(join(BUNDLE, "_ds_bundle.js"), "utf8");
bundleJs = bundleJs.replace(
  /^\/\* @ds-bundle:.*\*\/\n/,
  `/* @ds-bundle: ${JSON.stringify({ format: 4, namespace: NAMESPACE, components: componentNames.map((name) => ({ name })) })} */\n`,
);
if (/<\/script|<!--/.test(bundleJs)) throw new Error("bundle.js에 </script 또는 <!-- 가 있음");
write("components/bundle.js", bundleJs);
write("components/bundle.css", readFileSync(join(BUNDLE, "_ds_bundle.css"), "utf8"));

// ---------- 컴포넌트 ----------
const groupDirs = readdirSync(join(BUNDLE, "components"));
const dtsParts = [];
const oldPaths = [];
for (const name of componentNames) {
  const dir = groupDirs.map((g) => join(BUNDLE, "components", g, name)).find((d) => existsSync(d));
  const docPath = join(ROOT, "packages/ui/docs", `${name}.md`);
  const category = existsSync(docPath)
    ? (readFileSync(docPath, "utf8").match(/^category:\s*(\S+)/m)?.[1] ?? "General")
    : "General";
  const readme = readFileSync(join(dir, `${name}.prompt.md`), "utf8").replace(
    /^(\S+) from @roll-and-call\/ui\. Use via `window\.RollAndCallUI\.\S+` \(bundle loaded from the root `_ds_bundle\.js`\)\./,
    "$1 — `window.RollAndCallUI.$1`로 쓴다.",
  );
  write(`components/${name}/README.md`, readme);
  copy(join(BUNDLE, "_preview", `${name}.js`), `components/${name}/preview.js`);
  write(
    `components/${name}/preview.html`,
    `<!-- @dsCard group="${category}" height=240 -->
<!doctype html>
<html><head><meta charset="utf-8">
<style>
body{margin:0;padding:16px;background:var(--rc-color-bg-canvas-base);color:var(--rc-color-fg-normal);font-family:var(--font-sans)}
.cell{margin:0 0 16px;min-width:0}
.cell>h4{margin:0 0 8px;font:600 12px/1.4 var(--font-sans);color:var(--rc-color-fg-muted)}
</style></head><body>
<div id="g"></div>
<script src="./preview.js"></script>
<script>
(function(){
  var g=document.getElementById('g'), ex=window.__dsPreview||{}, n=0;
  Object.keys(ex).forEach(function(k){
    if(typeof ex[k]!=='function'||!/^[A-Z]/.test(k))return;
    var s=document.createElement('section'); s.className='cell';
    s.innerHTML='<h4>'+k+'</h4><div id="r'+n+'"></div>'; g.appendChild(s);
    try{ReactDOM.createRoot(document.getElementById('r'+n)).render(React.createElement(ex[k]))}
    catch(e){document.getElementById('r'+n).textContent='Error: '+(e&&e.message||e)}
    n++;
  });
  if(!n)g.textContent='No example exported for ${name}.';
})();
</script></body></html>
`,
  );
  dtsParts.push(
    `// ${name}\n${readFileSync(join(dir, `${name}.d.ts`), "utf8").replace(/^import \* as React from 'react';\n\n/, "")}`,
  );
  oldPaths.push(
    `project/_preview/${name}.js`,
    `project/components/${dir.split("/").slice(-2, -1)[0]}/${name}/${name}.d.ts`,
    `project/components/${dir.split("/").slice(-2, -1)[0]}/${name}/${name}.jsx`,
    `project/guidelines/docs/${name}.md`,
  );
}
write("components/index.d.ts", `import * as React from 'react';\n\n${dtsParts.join("\n")}`);

// ---------- 문서 ----------
write(
  "README.md",
  readFileSync(join(ROOT, ".design-sync/conventions.md"), "utf8").replace(/^# .*\n+/, ""),
);
for (const doc of ["typography-spec", "color-tokens"]) {
  copy(join(ROOT, "packages/ui/docs", `${doc}.md`), `guidelines/docs/${doc}.md`);
}

// ---------- 지울 옛 경로 ----------
oldPaths.push(
  "project/_ds_bundle.js",
  "project/_ds_bundle.css",
  "project/_ds_manifest.json",
  "project/_vendor/react.js",
  "project/_vendor/react-dom.js",
  "project/styles.css",
  "project/fonts/fonts.css",
  "project/guidelines/index.md",
  "project/HANDOFF.md",
  "project/REVIEW.md",
  "project/proposal/API 개선 제안.html",
  "project/proposal/Claude Code 작업 지시서.md",
  "project/proposal/신규 컴포넌트 데모.html",
);
writeFileSync(join(OUT, "deletes.json"), `${JSON.stringify(oldPaths, null, 2)}\n`);

console.log(
  JSON.stringify({
    components: componentNames.length,
    colorTokens: colorTokens.length,
    spacing: spacing.length,
    radius: radius.length,
    shadow: shadow.length,
    sizes: sizes.length,
    zIndex: zIndex.length,
    textStyles: textStyles.length,
    react: reactVersion,
    deletes: oldPaths.length,
    warnings,
  }),
);
