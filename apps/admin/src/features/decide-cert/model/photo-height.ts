export const PHOTO_HEIGHT = {
  compact: "compact",
  medium: "medium",
  regular: "regular",
  tall: "tall",
} as const;
export type PhotoHeight = (typeof PHOTO_HEIGHT)[keyof typeof PHOTO_HEIGHT];
