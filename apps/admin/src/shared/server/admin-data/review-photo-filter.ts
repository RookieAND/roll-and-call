export const REVIEW_PHOTO_FILTER = { with: "with", without: "without" } as const;
export type ReviewPhotoFilter = (typeof REVIEW_PHOTO_FILTER)[keyof typeof REVIEW_PHOTO_FILTER];
