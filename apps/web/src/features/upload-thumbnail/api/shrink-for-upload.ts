import { shrinkImage } from "@/shared/api";

import { IMAGE_MAX_BYTES, IMAGE_MAX_SIDE, IMAGE_TOO_LARGE_MESSAGE } from "../model/upload-rules";

// 휴대폰 원본이 5MB를 넘어도 줄인 결과가 5MB 이하면 올린다.
export async function shrinkForUpload(file: File): Promise<{ file: File } | { error: string }> {
  const shrunk = await shrinkImage({ file, maxSide: IMAGE_MAX_SIDE });
  if (shrunk.size > IMAGE_MAX_BYTES) return { error: IMAGE_TOO_LARGE_MESSAGE };
  return { file: shrunk };
}
