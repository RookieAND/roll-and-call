"use client";

import { Button, HStack, Sheet, Text } from "@roll-and-call/ui";
import { useCallback, useEffect, useState } from "react";

import { ZOOM_MAX, ZOOM_MIN, bannerCrop } from "../model/banner-crop";
import { cropBannerFile } from "../model/crop-banner-file";
import { fitsFrameExactly, stageAspectRatio } from "../model/stage-aspect-ratio";
import { BannerCropStage } from "./banner-crop-stage";

interface BannerCropSheetProps {
  // 자를 이미지의 주소. 없으면 닫힌다.
  imageUrl: string | null;
  onApply: (file: File) => void;
  onClose: () => void;
}

// 모바일은 아래 시트, 1100px 이상은 가운데 Dialog로 열린다(Sheet가 알아서 바꾼다).
export function BannerCropSheet({ imageUrl, onApply, onClose }: BannerCropSheetProps) {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [zoom, setZoom] = useState(ZOOM_MIN);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [frameWidth, setFrameWidth] = useState(0);
  const [failed, setFailed] = useState(false);
  const handleFrameWidth = useCallback((width: number) => setFrameWidth(width), []);

  useEffect(() => {
    setImage(null);
    setFailed(false);
    setZoom(ZOOM_MIN);
    setOffset({ x: 0, y: 0 });
    if (!imageUrl) return;
    const next = new Image();
    next.addEventListener("load", () => setImage(next));
    next.addEventListener("error", () => setFailed(true));
    // 올라가 있는 배너(외부 주소)를 자르려면 캔버스가 막히지 않게 CORS로 읽는다.
    if (!imageUrl.startsWith("blob:")) next.crossOrigin = "anonymous";
    next.src = imageUrl;
  }, [imageUrl]);

  async function apply() {
    if (!image || frameWidth === 0) return;
    const { source } = bannerCrop({
      natural: { width: image.naturalWidth, height: image.naturalHeight },
      frameWidth,
      zoom,
      offset,
    });
    try {
      const file = await cropBannerFile({ image, source });
      if (file) onApply(file);
      else setFailed(true);
    } catch (error) {
      console.error(error);
      setFailed(true);
    }
  }

  return (
    <Sheet.Root open={imageUrl !== null} onOpenChange={(open) => !open && onClose()}>
      <Sheet.Popup className="gap-0 desktop:w-140">
        <Sheet.Handle />
        <Sheet.Title className="mb-075 text-heading3">배너 위치 조정</Sheet.Title>
        <Text typography="body4" foreground="muted" render={<p />} className="mb-200">
          밝은 틀 안이 배너로 보입니다.
          <br />
          이미지를 끌어 위치를 맞추고, 필요하면 확대하세요.
        </Text>
        {failed ? (
          <Text typography="body3" foreground="danger" render={<p />}>
            이미지를 불러오지 못했습니다. 다른 이미지로 다시 시도해 주세요.
          </Text>
        ) : (
          image && (
            <>
              <BannerCropStage
                image={image}
                zoom={zoom}
                offset={offset}
                onOffsetChange={setOffset}
                onFrameWidthChange={handleFrameWidth}
                aspectRatio={stageAspectRatio({
                  width: image.naturalWidth,
                  height: image.naturalHeight,
                })}
              />
              {fitsFrameExactly({ width: image.naturalWidth, height: image.naturalHeight }) &&
                zoom === ZOOM_MIN && (
                  <Text typography="body4" foreground="hint" render={<p />} className="mt-100">
                    이미 틀에 꼭 맞는 이미지입니다. 확대하면 위치를 옮길 수 있습니다.
                  </Text>
                )}
              <HStack align="center" gap="150" className="mt-150">
                <Text typography="body3" weight="bold" className="flex-none">
                  확대
                </Text>
                <input
                  type="range"
                  min={ZOOM_MIN}
                  max={ZOOM_MAX}
                  value={zoom}
                  aria-label="확대 비율"
                  className="h-11 min-w-0 flex-1 accent-primary"
                  onChange={(event) => setZoom(Number(event.target.value))}
                />
                <Text
                  typography="body4"
                  foreground="muted"
                  numeric
                  className="w-11 flex-none text-right"
                >
                  {zoom}%
                </Text>
              </HStack>
            </>
          )
        )}
        <HStack gap="100" className="mt-200">
          <Button variant="outline" size="lg" className="flex-1" onClick={onClose}>
            취소
          </Button>
          <Button size="lg" className="flex-1" disabled={!image || failed} onClick={apply}>
            적용
          </Button>
        </HStack>
      </Sheet.Popup>
    </Sheet.Root>
  );
}
