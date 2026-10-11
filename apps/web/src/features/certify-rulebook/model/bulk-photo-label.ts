export function bulkPhotoLabel(index: number) {
  return index === 0 ? "사진 1" : `사진 ${index + 1} (선택)`;
}
