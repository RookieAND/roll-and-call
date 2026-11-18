import { CROP_OUTPUT_WIDTH } from "./banner-crop";

interface CropRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

// 원본에서 틀 영역을 ratio:1 JPEG로 잘라 파일로 만든다. 실패하면 null이다.
export async function cropBannerFile({
  image,
  source,
  ratio,
  fileName,
}: {
  image: HTMLImageElement;
  source: CropRect;
  ratio: number;
  fileName: string;
}): Promise<File | null> {
  const canvas = document.createElement("canvas");
  canvas.width = CROP_OUTPUT_WIDTH;
  canvas.height = CROP_OUTPUT_WIDTH / ratio;
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
  return blob && new File([blob], fileName, { type: "image/jpeg" });
}
