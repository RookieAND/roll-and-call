const WEBP = "image/webp";
const JPEG = "image/jpeg";
const QUALITY = 0.85;

// 올리기 전에 긴 변을 maxSide로 줄이고 WebP로 바꾼다. 더 커지거나 읽지 못하면 원본을 그대로 올린다.
// WebP로 굽지 못하는 브라우저(구형 Safari)는 흰 바탕을 깐 JPEG로 대신한다.
export async function shrinkImage(file: File, maxSide: number): Promise<File> {
  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) return file;

  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);
  const canvas = new OffscreenCanvas(width, height);
  const context = canvas.getContext("2d");
  if (!context) return file;
  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  let blob = await canvas.convertToBlob({ type: WEBP, quality: QUALITY });
  if (blob.type !== WEBP) {
    context.globalCompositeOperation = "destination-over";
    context.fillStyle = "#fff";
    context.fillRect(0, 0, width, height);
    blob = await canvas.convertToBlob({ type: JPEG, quality: QUALITY });
  }
  if (blob.size >= file.size) return file;

  const extension = blob.type === WEBP ? "webp" : "jpg";
  return new File([blob], `${file.name.replace(/\.[^.]+$/, "")}.${extension}`, {
    type: blob.type,
  });
}
