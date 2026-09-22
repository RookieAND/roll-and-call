export const COLOR_PALETTE = {
  primary: "primary",
  success: "success",
  danger: "danger",
  warning: "warning",
  gray: "gray",
  discord: "discord",
} as const;

export type ColorPalette = (typeof COLOR_PALETTE)[keyof typeof COLOR_PALETTE];
