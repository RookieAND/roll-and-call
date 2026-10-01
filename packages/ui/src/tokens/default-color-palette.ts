import type { ColorPalette } from "./color-palette";

export function defaultColorPalette(
  variant: "solid" | "outline" | "tinted" | "ghost",
): ColorPalette {
  return variant === "solid" || variant === "tinted" ? "primary" : "gray";
}
