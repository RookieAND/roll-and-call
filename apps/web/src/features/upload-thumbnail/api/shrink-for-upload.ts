import { shrinkAnimatedImage, shrinkImage } from "@/shared/api";

import {
  ANIMATED_IMAGE_MAX_SIDE,
  IMAGE_MAX_BYTES,
  IMAGE_MAX_SIDE,
  IMAGE_TOO_LARGE_MESSAGE,
} from "../model/upload-rules";

// 휴대폰 원본이 10MB를 넘어도 줄인 결과가 10MB 이하면 올린다. GIF는 애니메이션 WebP로 바꾼다.
export async function shrinkForUpload(file: File): Promise<{ file: File } | { error: string }> {
  const shrunk =
    file.type === "image/gif"
      ? await shrinkAnimatedImage({ file, maxSide: ANIMATED_IMAGE_MAX_SIDE })
      : await shrinkImage({ file, maxSide: IMAGE_MAX_SIDE });
  if (shrunk.size > IMAGE_MAX_BYTES) return { error: IMAGE_TOO_LARGE_MESSAGE };
  return { file: shrunk };
}
