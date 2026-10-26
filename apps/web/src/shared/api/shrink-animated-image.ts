const QUALITY = 75;
const MICROSECONDS_PER_MILLISECOND = 1000;
const DEFAULT_FRAME_MILLISECONDS = 100;

// 움직이는 GIF를 긴 변 maxSide의 애니메이션 WebP로 바꾼다. 모든 프레임을 메모리에 올리므로 maxSide가 클수록 프레임이 많은 GIF에서 무겁다.
// 디코더가 없거나(구형 브라우저) 실패하거나 더 커지면 원본을 그대로 올린다.
export async function shrinkAnimatedImage({
  file,
  maxSide,
}: {
  file: File;
  maxSide: number;
}): Promise<File> {
  if (typeof ImageDecoder === "undefined") return file;

  const decoder = new ImageDecoder({ data: file.stream(), type: file.type });
  try {
    await decoder.tracks.ready;
    const frameCount = decoder.tracks.selectedTrack?.frameCount ?? 0;
    if (frameCount < 2) return file;

    const frames: {
      data: Uint8Array;
      duration: number;
      config: { lossless: 0; quality: number };
    }[] = [];
    let width = 0;
    let height = 0;
    let context: OffscreenCanvasRenderingContext2D | null = null;
    for (let frameIndex = 0; frameIndex < frameCount; frameIndex += 1) {
      const { image } = await decoder.decode({ frameIndex });
      if (!context) {
        const scale = Math.min(1, maxSide / Math.max(image.displayWidth, image.displayHeight));
        width = Math.round(image.displayWidth * scale);
        height = Math.round(image.displayHeight * scale);
        context = new OffscreenCanvas(width, height).getContext("2d", {
          willReadFrequently: true,
        });
        if (!context) return file;
      }
      context.clearRect(0, 0, width, height);
      context.drawImage(image, 0, 0, width, height);
      frames.push({
        data: new Uint8Array(context.getImageData(0, 0, width, height).data.buffer),
        duration: image.duration
          ? Math.round(image.duration / MICROSECONDS_PER_MILLISECOND)
          : DEFAULT_FRAME_MILLISECONDS,
        config: { lossless: 0, quality: QUALITY },
      });
      image.close();
    }

    const { encodeAnimation } = await import("wasm-webp");
    const encoded = await encodeAnimation(width, height, true, frames);
    if (!encoded || encoded.byteLength >= file.size) return file;
    return new File([new Uint8Array(encoded)], `${file.name.replace(/\.[^.]+$/, "")}.webp`, {
      type: "image/webp",
    });
  } catch {
    return file;
  } finally {
    decoder.close();
  }
}
