import type { ColorPalette } from "./color-palette";

// 칠하는 모양은 주 색, 선·글자만 있는 모양은 회색이 기본이다.
export function defaultColorPalette(
  variant: "solid" | "outline" | "tinted" | "ghost",
): ColorPalette {
  return variant === "solid" || variant === "tinted" ? "primary" : "gray";
}
