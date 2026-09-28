// 올리는 중·실패한 사진도 칸을 차지한다. 실패하면 다시 시도하도록 파일을 쥐고 있는다.
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
