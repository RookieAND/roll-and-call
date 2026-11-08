// 시안 05-3은 화면 틀 전체에 강조색 7%를 섞는다. 모바일은 canvas-base, 데스크톱은 canvas-sunken 위에 섞는다.
export const PROFILE_PAGE_TINT_CLASS =
  "bg-[color-mix(in_oklch,var(--acc)_7%,var(--rc-color-bg-canvas-base))] desktop:bg-[color-mix(in_oklch,var(--acc)_7%,var(--rc-color-bg-canvas-sunken))]";

// 모바일 앱바는 화면 틀 색을 그대로 비춘다. 데스크톱 앱바는 canvas-base 띠다.
export const PROFILE_APP_BAR_TINT_CLASS =
  "bg-[color-mix(in_oklch,var(--acc)_7%,var(--rc-color-bg-canvas-base))] desktop:bg-surface/90";

// 소유주·관리자 표식은 강조색 그대로이고, 다크에서는 흰색을 60% 섞어 밝힌다.
export const PROFILE_INK_CLASS =
  "[--profile-ink:var(--acc)] dark:[--profile-ink:color-mix(in_srgb,var(--acc)_60%,white)]";
