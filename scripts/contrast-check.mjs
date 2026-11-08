// packages/ui 토큰 쌍의 WCAG 대비를 라이트·다크 모두 검사한다. 기준 미달이면 종료 코드 1.
import { readFileSync } from "node:fs";

const lines = readFileSync("packages/ui/src/styles.css", "utf8").split("\n");
const primitives = {};
for (const line of lines) {
  const match = line.match(/^\s*(--rc-color-[\w-]+):\s*(#[0-9a-f]{6})/i);
  if (match) primitives[match[1]] = match[2];
}
const readBlock = (selector) => {
  const start = lines.findIndex((line, index) => index > 300 && line.startsWith(selector));
  const tokens = {};
  for (let i = start; i < lines.length && !lines[i].startsWith("}"); i++) {
    const match = lines[i].match(/^\s*(--rc-[\w-]+):\s*(.+?);/);
    if (match) tokens[match[1]] = match[2];
  }
  return tokens;
};
const light = readBlock('[data-theme="light"]');
const dark = { ...light, ...readBlock('[data-theme="dark"]') };

const resolve = (tokens, name) => {
  let value = name;
  for (let depth = 0; depth < 5 && tokens[value]; depth++) {
    value = tokens[value].match(/var\((.+?)\)/)?.[1] ?? tokens[value];
  }
  return primitives[value] ?? value;
};
const luminance = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [16, 8, 0].map((shift) => {
    const c = ((n >> shift) & 255) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a, b) => {
  const [x, y] = [luminance(a), luminance(b)].toSorted((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

// [글씨, 배경, 최소 대비]
const PAIRS = [
  ["fg-normal", "bg-canvas-base", 4.5],
  ["fg-muted", "bg-canvas-base", 4.5],
  ["fg-label", "bg-canvas-base", 4.5],
  ["fg-hint", "bg-canvas-base", 4.5],
  ["border-input", "bg-canvas-base", 3],
  ["fg-hint", "bg-secondary", 4.5],
  ["fg-warning", "bg-warning-weak", 4.5],
  ["fg-notice", "bg-warning-weak", 4.5],
  ["fg-inverse", "bg-danger", 4.5],
  ["fg-inverse", "bg-success", 4.5],
];

let failed = 0;
for (const [theme, tokens] of [
  ["light", light],
  ["dark", dark],
]) {
  for (const [foreground, background, minimum] of PAIRS) {
    const ratio = contrast(
      resolve(tokens, `--rc-color-${foreground}`),
      resolve(tokens, `--rc-color-${background}`),
    );
    if (ratio < minimum) {
      failed++;
      console.error(`${theme} ${foreground} on ${background}: ${ratio.toFixed(2)} < ${minimum}`);
    }
  }
}
if (failed) process.exit(1);
console.log("contrast ok");
