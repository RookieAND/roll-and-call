"use client";

import {
  Badge,
  Button,
  Dialog,
  HStack,
  IconButton,
  Skeleton,
  Text,
  VStack,
} from "@roll-and-call/ui";
import { isNull } from "es-toolkit";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  ImageOff,
  RotateCcw,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useState } from "react";

import { PhotoThumb, ServerLink } from "@/shared/ui";

const ZOOM_STEP = 0.5;
const ZOOM_MAX = 3;

const PHOTO_STATE = { loading: "loading", loaded: "loaded", failed: "failed" } as const;
type PhotoState = (typeof PHOTO_STATE)[keyof typeof PHOTO_STATE];

interface PhotoViewerProps {
  photoUrls: string[];
  index: number | null;
  title: string;
  meta: string;
  spoiler: boolean;
  hideLink: { label: string; href: string };
  removeHref: string;
  onIndexChange: (index: number | null) => void;
}

export function PhotoViewer({
  photoUrls,
  index,
  title,
  meta,
  spoiler,
  hideLink,
  removeHref,
  onIndexChange,
}: PhotoViewerProps) {
  const [zoom, setZoom] = useState(1);
  const [photoState, setPhotoState] = useState<PhotoState>(PHOTO_STATE.loading);
  const [retryKey, setRetryKey] = useState(0);
  const total = photoUrls.length;
  const current = isNull(index) ? null : (photoUrls[index] ?? null);
  const loading = photoState === PHOTO_STATE.loading;
  const failed = photoState === PHOTO_STATE.failed;
  const loaded = photoState === PHOTO_STATE.loaded;

  const show = (next: number) => {
    setZoom(1);
    setPhotoState(PHOTO_STATE.loading);
    onIndexChange(next);
  };
  const move = (step: number) => {
    if (!isNull(index)) show((index + step + total) % total);
  };
  const close = () => {
    setZoom(1);
    setPhotoState(PHOTO_STATE.loading);
    onIndexChange(null);
  };
  const retry = () => {
    setPhotoState(PHOTO_STATE.loading);
    setRetryKey(retryKey + 1);
  };

  return (
    <Dialog.Root open={!isNull(current)} onOpenChange={(open) => (open ? null : close())}>
      <Dialog.Popup
        data-theme="dark"
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") move(-1);
          if (event.key === "ArrowRight") move(1);
        }}
        className="inset-0 top-0 left-0 h-dvh max-h-none w-full max-w-none translate-x-0 translate-y-0 gap-0 rounded-none border-0 bg-surface px-250 py-200"
      >
        {!isNull(current) && !isNull(index) ? (
          <>
            <HStack align="center" gap="125">
              <Dialog.Title>{title}</Dialog.Title>
              <Text typography="body4" foreground="muted">
                {meta}
              </Text>
              <Text typography="body4" weight="bold" numeric>
                {index + 1} / {total}
              </Text>
              {spoiler ? <Badge colorPalette="gray">스포일러 포함</Badge> : null}
              <HStack align="center" gap="075" className="ml-auto">
                <IconButton
                  variant="outline"
                  size="sm"
                  aria-label="확대"
                  title="확대"
                  disabled={zoom >= ZOOM_MAX || !loaded}
                  onClick={() => setZoom(Math.min(ZOOM_MAX, zoom + ZOOM_STEP))}
                >
                  <ZoomIn size={16} aria-hidden />
                </IconButton>
                <IconButton
                  variant="outline"
                  size="sm"
                  aria-label="축소"
                  title="축소"
                  disabled={zoom <= 1}
                  onClick={() => setZoom(Math.max(1, zoom - ZOOM_STEP))}
                >
                  <ZoomOut size={16} aria-hidden />
                </IconButton>
                <span aria-hidden className="mx-050 h-5 w-px bg-gray-300" />
                <Button
                  variant="outline"
                  colorPalette="gray"
                  size="sm"
                  disabled={loading}
                  render={<ServerLink path={hideLink.href} scroll={false} />}
                  onClick={close}
                >
                  <Eye size={14} aria-hidden />
                  {hideLink.label}
                </Button>
                <Button
                  variant="outline"
                  colorPalette="danger"
                  size="sm"
                  disabled={loading}
                  render={<ServerLink path={removeHref} scroll={false} />}
                  onClick={close}
                >
                  <X size={14} aria-hidden />
                  제거
                </Button>
                <span aria-hidden className="mx-050 h-5 w-px bg-gray-300" />
                <Dialog.Close
                  render={
                    <IconButton
                      variant="outline"
                      size="sm"
                      aria-label="닫기 (Esc)"
                      title="닫기 (Esc)"
                    />
                  }
                >
                  <X size={16} aria-hidden />
                </Dialog.Close>
              </HStack>
            </HStack>
            <HStack align="center" gap="150" className="min-h-0 flex-1 py-175">
              <IconButton aria-label="이전 사진 (←)" onClick={() => move(-1)}>
                <ChevronLeft size={22} aria-hidden />
              </IconButton>
              <VStack className="relative mx-auto h-full max-w-[760px] flex-1 overflow-hidden rounded-400">
                {failed ? (
                  <VStack
                    align="center"
                    justify="center"
                    gap="125"
                    role="img"
                    aria-label={`후기 사진 ${index + 1}/${total} 불러오기 실패`}
                    className="size-full rounded-400 border border-gray-200 text-hint"
                  >
                    <ImageOff size={32} aria-hidden />
                    <Text typography="subtitle2">사진을 불러오지 못했습니다</Text>
                    <Button variant="outline" colorPalette="gray" size="sm" onClick={retry}>
                      <RotateCcw size={14} aria-hidden />
                      다시 불러오기
                    </Button>
                  </VStack>
                ) : (
                  <>
                    {loading ? (
                      <Skeleton
                        width="100%"
                        height="100%"
                        rounded={400}
                        aria-label="사진을 불러오는 중입니다"
                        className="absolute inset-0"
                      />
                    ) : null}
                    {/* ponytail: 후기 사진은 Storage 공개 URL이라 next/image 대신 img로 그린다. */}
                    <img
                      key={`${current}-${retryKey}`}
                      src={current}
                      alt={`후기 사진 ${index + 1}/${total}`}
                      onLoad={() => setPhotoState(PHOTO_STATE.loaded)}
                      onError={() => setPhotoState(PHOTO_STATE.failed)}
                      style={{ transform: `scale(${zoom})` }}
                      className="size-full object-contain transition-transform"
                    />
                  </>
                )}
              </VStack>
              <IconButton aria-label="다음 사진 (→)" onClick={() => move(1)}>
                <ChevronRight size={22} aria-hidden />
              </IconButton>
            </HStack>
            <HStack gap="100" justify="center">
              {photoUrls.map((url, candidateIndex) => (
                <PhotoThumb
                  key={url}
                  url={url}
                  label={`후기 사진 ${candidateIndex + 1}/${total}`}
                  selected={candidateIndex === index}
                  onClick={() => show(candidateIndex)}
                />
              ))}
            </HStack>
            <HStack justify="center" className="mt-100">
              <Text typography="body4" foreground="hint">
                ← → 사진 이동 · Esc 닫기
              </Text>
            </HStack>
          </>
        ) : null}
      </Dialog.Popup>
    </Dialog.Root>
  );
}
