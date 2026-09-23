import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// tailwind-merge는 기본 스케일에 없는 text-*를 글자색으로 본다. 알려주지 않으면
// cva가 낸 `text-body4 … text-gray-900`에서 색이 크기를 밀어내 크기가 통째로 사라진다.
const FONT_SIZES = [
  "heading1",
  "heading2",
  "heading3",
  "subtitle1",
  "subtitle2",
  "body2",
  "body3",
  "body4",
  "body5",
] as const;

const twMerge = extendTailwindMerge({
  extend: { classGroups: { "font-size": [{ text: [...FONT_SIZES] }] } },
});

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
