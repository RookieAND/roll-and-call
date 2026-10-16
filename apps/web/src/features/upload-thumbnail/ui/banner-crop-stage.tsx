"use client";

import { Move } from "lucide-react";
import { useEffect, useRef, useState, type PointerEvent } from "react";

import { bannerCrop } from "../model/banner-crop";

const GRID_LINE = "rgb(255 255 255 / 0.55)";
const GRID_BACKGROUND = [33.33, 66.66]
  .flatMap((at) => [
    `linear-gradient(to right,transparent calc(${at}% - .5px),${GRID_LINE} calc(${at}% - .5px) calc(${at}% + .5px),transparent calc(${at}% + .5px))`,
    `linear-gradient(to bottom,transparent calc(${at}% - .5px),${GRID_LINE} calc(${at}% - .5px) calc(${at}% + .5px),transparent calc(${at}% + .5px))`,
  ])
  .join(",");

interface BannerCropStageProps {
  image: HTMLImageElement;
  zoom: number;
  offset: { x: number; y: number };
  onOffsetChange: (offset: { x: number; y: number }) => void;
  onFrameWidthChange: (width: number) => void;
  className: string;
}

// 원본을 끌어 움직이고, 가운데 3:1 틀 안이 배너가 된다. 틀 밖은 어둡게 덮는다.
export function BannerCropStage({
  image,
  zoom,
  offset,
  onOffsetChange,
  onFrameWidthChange,
  className,
}: BannerCropStageProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [frameWidth, setFrameWidth] = useState(0);
  const drag = useRef<{ x: number; y: number } | null>(null);
  const natural = { width: image.naturalWidth, height: image.naturalHeight };

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const observer = new ResizeObserver(([entry]) => {
      const width = entry!.contentRect.width;
      setFrameWidth(width);
      onFrameWidthChange(width);
    });
    observer.observe(stage);
    return () => observer.disconnect();
  }, [onFrameWidthChange]);

  const crop = frameWidth > 0 ? bannerCrop({ natural, frameWidth, zoom, offset }) : null;

  function move(event: PointerEvent) {
    if (!drag.current || !crop) return;
    onOffsetChange(
      bannerCrop({
        natural,
        frameWidth,
        zoom,
        offset: {
          x: event.clientX - drag.current.x,
          y: event.clientY - drag.current.y,
        },
      }).offset,
    );
  }

  return (
    <div
      ref={stageRef}
      className={`relative cursor-grab touch-none overflow-hidden rounded-400 bg-gray-100 select-none active:cursor-grabbing ${className}`}
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        drag.current = { x: event.clientX - offset.x, y: event.clientY - offset.y };
      }}
      onPointerMove={move}
      onPointerUp={() => (drag.current = null)}
      onPointerCancel={() => (drag.current = null)}
    >
      {crop && (
        // ponytail: 올리기 전 로컬 이미지라 next/image 대신 img로 그린다.
        <img
          src={image.src}
          alt=""
          draggable={false}
          className="pointer-events-none absolute top-1/2 left-1/2 max-w-none"
          style={{
            width: natural.width * crop.scale,
            height: natural.height * crop.scale,
            transform: `translate(-50%, -50%) translate(${crop.offset.x}px, ${crop.offset.y}px)`,
          }}
        />
      )}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 flex aspect-[3/1] -translate-y-1/2 items-center justify-center border-2 border-white shadow-[0_0_0_999px_rgb(0_0_0/0.55)]"
        style={{ background: GRID_BACKGROUND }}
      >
        <span className="flex items-center gap-050 rounded-full bg-black/65 px-125 py-075 text-body4 font-bold text-white">
          <Move size={14} aria-hidden />
          끌어서 이동
        </span>
      </div>
    </div>
  );
}
