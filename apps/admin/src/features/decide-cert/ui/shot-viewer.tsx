"use client";

import { Button, Dialog, HStack, IconButton, Text, cn } from "@roll-and-call/ui";
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  RotateCw,
  X,
  ZoomIn,
  ZoomOut,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";

import type { ShotKey } from "@/shared/server";

import { SHOTS } from "../model/shots";
import { PhotoSlot } from "./photo-slot";

const ZOOM_STEP = 0.5;
const ZOOM_MAX = 3;

interface ShotViewerProps {
  shot: ShotKey | null;
  photoUrls: Partial<Record<ShotKey, string>>;
  onShotChange: (shot: ShotKey | null) => void;
}

// 사진 확대. 확대·축소·회전·원본 크기를 지원하고, 아래 썸네일과 좌우 화살표로 3장 사이를 옮긴다.
export function ShotViewer({ shot, photoUrls, onShotChange }: ShotViewerProps) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [original, setOriginal] = useState(false);
  const index = SHOTS.findIndex((candidate) => candidate.key === shot);
  const current = SHOTS[index];

  const move = (step: number) => {
    setZoom(1);
    setRotation(0);
    onShotChange(SHOTS[(index + step + SHOTS.length) % SHOTS.length]!.key);
  };

  const tools: { label: string; icon: LucideIcon; onClick: () => void; disabled?: boolean }[] = [
    {
      label: "확대",
      icon: ZoomIn,
      onClick: () => setZoom(Math.min(ZOOM_MAX, zoom + ZOOM_STEP)),
      disabled: zoom >= ZOOM_MAX,
    },
    {
      label: "축소",
      icon: ZoomOut,
      onClick: () => setZoom(Math.max(1, zoom - ZOOM_STEP)),
      disabled: zoom <= 1,
    },
    { label: "왼쪽으로 회전", icon: RotateCcw, onClick: () => setRotation(rotation - 90) },
    { label: "오른쪽으로 회전", icon: RotateCw, onClick: () => setRotation(rotation + 90) },
  ];

  return (
    <Dialog.Root
      open={Boolean(current)}
      onOpenChange={(open) => (open ? null : onShotChange(null))}
    >
      <Dialog.Popup
        data-theme="dark"
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") move(-1);
          if (event.key === "ArrowRight") move(1);
        }}
        className="inset-0 top-0 left-0 h-dvh max-h-none w-full max-w-none translate-x-0 translate-y-0 gap-0 rounded-none border-0 bg-surface px-250 py-200"
      >
        {current ? (
          <>
            <HStack align="center" gap="125">
              <Dialog.Title className="text-body3 font-bold">
                {current.label} · {current.note}
              </Dialog.Title>
              <Text typography="body4" foreground="muted" numeric>
                {index + 1} / {SHOTS.length}
              </Text>
              <HStack gap="075" className="ml-auto">
                {tools.map((tool) => (
                  <IconButton
                    key={tool.label}
                    variant="outline"
                    size="sm"
                    aria-label={tool.label}
                    title={tool.label}
                    disabled={tool.disabled}
                    onClick={tool.onClick}
                  >
                    <tool.icon size={16} aria-hidden />
                  </IconButton>
                ))}
                <Button
                  variant="outline"
                  colorPalette="gray"
                  size="sm"
                  aria-pressed={original}
                  onClick={() => setOriginal(!original)}
                >
                  원본 크기
                </Button>
                <Dialog.Close
                  render={
                    <IconButton size="sm" aria-label="닫기" title="닫기" className="bg-gray-100" />
                  }
                >
                  <X size={16} aria-hidden />
                </Dialog.Close>
              </HStack>
            </HStack>
            <HStack align="center" gap="150" className="min-h-0 flex-1 py-175">
              <IconButton aria-label="이전 사진" onClick={() => move(-1)}>
                <ChevronLeft size={22} aria-hidden />
              </IconButton>
              <div
                className={cn(
                  "mx-auto h-full max-w-[760px] flex-1",
                  original ? "overflow-auto" : "overflow-hidden",
                )}
              >
                <PhotoSlot
                  url={photoUrls[current.key]}
                  placeholder={`${current.label} 확대`}
                  className={cn("transition-transform", original ? "max-w-none" : "size-full")}
                  imageStyle={{ transform: `scale(${zoom}) rotate(${rotation}deg)` }}
                />
              </div>
              <IconButton aria-label="다음 사진" onClick={() => move(1)}>
                <ChevronRight size={22} aria-hidden />
              </IconButton>
            </HStack>
            <HStack gap="100" justify="center">
              {SHOTS.map((candidate, candidateIndex) => (
                <Button
                  key={candidate.key}
                  variant="outline"
                  colorPalette="gray"
                  aria-current={candidateIndex === index}
                  onClick={() => move(candidateIndex - index)}
                  className={cn(
                    "h-[44px] w-[62px] rounded-200 bg-gray-100 px-0 text-body4 font-normal",
                    candidateIndex === index && "border-2 border-gray-900",
                  )}
                >
                  {candidate.label}
                </Button>
              ))}
            </HStack>
          </>
        ) : null}
      </Dialog.Popup>
    </Dialog.Root>
  );
}
