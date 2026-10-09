"use client";

import {
  Button,
  Card,
  Dialog,
  HStack,
  IconButton,
  Skeleton,
  Text,
  VStack,
} from "@roll-and-call/ui";
import {
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  RotateCcw,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useState } from "react";

import { PhotoThumb } from "./photo-thumb";
import { Tag } from "./tag";

const ZOOM_STEP = 0.5;
const ZOOM_MAX = 3;

const PHOTO_STATE = { loading: "loading", loaded: "loaded", failed: "failed" } as const;
type PhotoState = (typeof PHOTO_STATE)[keyof typeof PHOTO_STATE];

interface PhotoViewerProps {
  photos: string[];
  title: string;
  subtitle: string;
  spoiler: boolean;
  initialIndex: number;
  onClose: () => void;
}

// 사이드바까지 화면 전체를 어둡게 덮는 사진 보기(D275). 열 때 그리고 닫으면 부르는 쪽이 지운다.
export function PhotoViewer({
  photos,
  title,
  subtitle,
  spoiler,
  initialIndex,
  onClose,
}: PhotoViewerProps) {
  const [index, setIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const [photoState, setPhotoState] = useState<PhotoState>(PHOTO_STATE.loading);
  const [retryKey, setRetryKey] = useState(0);
  const total = photos.length;
  const current = photos[index];
  const loading = photoState === PHOTO_STATE.loading;
  const failed = photoState === PHOTO_STATE.failed;
  const loaded = photoState === PHOTO_STATE.loaded;
  const photoLabel = (photoIndex: number) => `${subtitle} ${photoIndex + 1}/${total}`;

  const show = (next: number) => {
    setZoom(1);
    setPhotoState(PHOTO_STATE.loading);
    setIndex(next);
  };
  const move = (step: number) => show((index + step + total) % total);
  const retry = () => {
    setPhotoState(PHOTO_STATE.loading);
    setRetryKey(retryKey + 1);
  };

  return (
    <Dialog.Root open onOpenChange={(open) => (open ? null : onClose())}>
      <Dialog.Popup
        data-theme="dark"
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") move(-1);
          if (event.key === "ArrowRight") move(1);
        }}
        className="inset-0 top-0 left-0 h-dvh max-h-none w-full max-w-none translate-x-0 translate-y-0 gap-0 rounded-none border-0 bg-surface px-250 py-200"
      >
        <HStack align="center" gap="125">
          <Dialog.Title className="text-body3">{title}</Dialog.Title>
          <Text typography="body4" foreground="muted">
            {subtitle}
          </Text>
          <Text typography="body4" weight="bold" numeric>
            {loading ? null : `${index + 1} / ${total}`}
          </Text>
          {spoiler ? <Tag>스포일러 포함</Tag> : null}
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
            <Dialog.Close
              render={
                <IconButton
                  size="sm"
                  className="bg-gray-100"
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
          <IconButton
            variant="outline"
            size="sm"
            aria-label="이전 사진 (←)"
            title="이전 사진 (←)"
            onClick={() => move(-1)}
          >
            <ChevronLeft size={16} aria-hidden />
          </IconButton>
          <VStack className="relative mx-auto h-full max-w-190 flex-1 overflow-hidden rounded-400">
            {failed ? (
              <VStack
                align="center"
                justify="center"
                gap="125"
                role="img"
                aria-label={`${photoLabel(index)} 불러오기 실패`}
                className="size-full rounded-400 border border-gray-200 text-gray-600"
              >
                <ImageIcon size={32} aria-hidden />
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
                {/* ponytail: 사진은 Storage 공개 URL이라 next/image 대신 img로 그린다. */}
                <img
                  key={`${current}-${retryKey}`}
                  src={current}
                  alt={photoLabel(index)}
                  onLoad={() => setPhotoState(PHOTO_STATE.loaded)}
                  onError={() => setPhotoState(PHOTO_STATE.failed)}
                  style={{ transform: `scale(${zoom})` }}
                  className="size-full object-contain transition-transform"
                />
              </>
            )}
          </VStack>
          <IconButton
            variant="outline"
            size="sm"
            aria-label="다음 사진 (→)"
            title="다음 사진 (→)"
            onClick={() => move(1)}
          >
            <ChevronRight size={16} aria-hidden />
          </IconButton>
        </HStack>
        <HStack gap="100" justify="center">
          {photos.map((url, photoIndex) => {
            if (loading) return <Skeleton key={url} width={88} height={66} rounded={400} />;
            if (failed && photoIndex === index) {
              return (
                <Card.Root
                  key={url}
                  radius={400}
                  padding="none"
                  role="img"
                  aria-label={photoLabel(photoIndex)}
                  aria-current
                  render={<VStack align="center" justify="center" />}
                  className="h-[66px] w-22 shrink-0 border-2 border-gray-900 text-hint"
                >
                  <ImageIcon size={16} aria-hidden />
                </Card.Root>
              );
            }
            return (
              <PhotoThumb
                key={url}
                url={url}
                label={photoLabel(photoIndex)}
                selected={photoIndex === index}
                onClick={() => show(photoIndex)}
              />
            );
          })}
        </HStack>
        <HStack justify="center" className="mt-100">
          <Text typography="body4" foreground="hint">
            ← → 사진 이동 · Esc 닫기
          </Text>
        </HStack>
      </Dialog.Popup>
    </Dialog.Root>
  );
}
