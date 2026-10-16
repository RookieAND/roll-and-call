import { BANNER_OUTPUT_WIDTH, BANNER_RATIO } from "./banner-crop";

interface CropRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

// 원본에서 틀 영역을 3:1 JPEG로 잘라 파일로 만든다. 실패하면 null이다.
export async function cropBannerFile({
  image,
  source,
}: {
  image: HTMLImageElement;
  source: CropRect;
}): Promise<File | null> {
  const canvas = document.createElement("canvas");
  canvas.width = BANNER_OUTPUT_WIDTH;
  canvas.height = BANNER_OUTPUT_WIDTH / BANNER_RATIO;
  const context = canvas.getContext("2d");
  if (!context) return null;
  context.drawImage(
    image,
    source.x,
    source.y,
    source.width,
    source.height,
    0,
    0,
    canvas.width,
    canvas.height,
  );
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", 0.9),
  );
  return blob && new File([blob], "banner.jpg", { type: "image/jpeg" });
}
