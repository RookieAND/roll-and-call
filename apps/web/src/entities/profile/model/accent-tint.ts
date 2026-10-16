// 강조색(--acc)이 없으면 기본 primary로 보인다. 프로필 안의 선·글자·칩이 같은 색조를 쓴다.
export const ACCENT_TINT_TEXT =
  "text-[color-mix(in_oklch,var(--acc,var(--rc-color-bg-primary))_70%,var(--rc-color-fg-normal))]";
export const ACCENT_TINT_BORDER =
  "border-[color-mix(in_oklch,var(--acc,var(--rc-color-bg-primary))_55%,transparent)]";
export const ACCENT_TINT_HOVER =
  "hover:bg-[color-mix(in_oklch,var(--acc,var(--rc-color-bg-primary))_12%,transparent)]";
export const ACCENT_TINT_FILL =
  "bg-[color-mix(in_oklch,var(--acc,var(--rc-color-bg-primary))_14%,transparent)]";
