import { REVIEW_PHOTO_FILTER } from "@/entities/review";

export const REVIEW_PHOTO_CHIPS = [
  { label: "사진 있음", value: REVIEW_PHOTO_FILTER.with },
  { label: "사진 없음", value: REVIEW_PHOTO_FILTER.without },
];
