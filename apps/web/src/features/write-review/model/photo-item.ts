export const PHOTO_STATUS = {
  uploading: "uploading",
  failed: "failed",
  done: "done",
} as const;

export type PhotoStatus = (typeof PHOTO_STATUS)[keyof typeof PHOTO_STATUS];

export type PhotoItem = {
  key: string;
  status: PhotoStatus;
  url: string | null;
  file: File | null;
  progress: number;
};
