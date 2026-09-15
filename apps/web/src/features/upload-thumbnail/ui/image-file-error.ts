import { IMAGE_ACCEPT, IMAGE_MAX_BYTES } from "./upload-rules";

export function imageFileError(file: File): string | null {
  if (!IMAGE_ACCEPT.split(",").includes(file.type)) return "JPG·PNG 이미지만 올릴 수 있습니다.";
  if (file.size > IMAGE_MAX_BYTES) return "5MB를 넘습니다. 더 작은 이미지를 올려주세요.";
  return null;
}
