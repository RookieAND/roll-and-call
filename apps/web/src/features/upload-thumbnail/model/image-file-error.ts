import { IMAGE_ACCEPT } from "./upload-rules";

// 크기는 줄인 뒤에 본다(shrinkForUpload). 고를 때는 형식만 본다.
export function imageFileError(file: File): string | null {
  if (!IMAGE_ACCEPT.split(",").includes(file.type)) return "JPG·PNG 이미지만 올릴 수 있습니다.";
  return null;
}
