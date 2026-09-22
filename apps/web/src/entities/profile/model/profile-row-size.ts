export const PROFILE_ROW_SIZE = {
  sm: { avatar: "sm", name: "subtitle2", subline: "body4", gap: "100" },
  md: { avatar: "md", name: "subtitle2", subline: "body4", gap: "125" },
  lg: { avatar: "lg", name: "heading3", subline: "body4", gap: "150" },
  xl: { avatar: "2xl", name: "heading2", subline: "body3", gap: "175" },
} as const;

export type ProfileRowSize = keyof typeof PROFILE_ROW_SIZE;
