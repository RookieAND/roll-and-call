// 썸네일·추가 이미지 공통 업로드 제한. 화면에 미리 적는 문구와 검사가 같은 값을 본다.
export const IMAGE_MAX_BYTES = 5 * 1024 * 1024;
export const IMAGE_ACCEPT = "image/jpeg,image/png";

export function imageFileError(file: File): string | null {
  if (!IMAGE_ACCEPT.split(",").includes(file.type)) return "JPG·PNG 이미지만 올릴 수 있습니다.";
  if (file.size > IMAGE_MAX_BYTES) return "5MB를 넘습니다. 더 작은 이미지를 올려주세요.";
  return null;
}

export function formatBytes(size: number): string {
  if (size < 1024 * 1024) return `${Math.max(1, Math.round(size / 1024))}KB`;
  return `${(size / 1024 / 1024).toFixed(1)}MB`;
}
