"use client";

import { Button, Checkbox, Dialog, HStack, IconButton, Text, VStack } from "@roll-and-call/ui";
import { X } from "lucide-react";
import { useState } from "react";

import type { ReviewShot, ReviewShotKey } from "../model/shots";
import { ZoomPane, type ZoomView } from "./zoom-pane";

const ZOOM_STEP = 0.5;
const ZOOM_MAX = 3;
const RESET_VIEW: ZoomView = { zoom: 1, rotation: 0, offset: { x: 0, y: 0 }, original: false };

interface MobileShotViewerProps {
  shots: readonly ReviewShot[];
  shot: ReviewShotKey | null;
  photoUrls: Partial<Record<ReviewShotKey, string>>;
  previousUrls: Partial<Record<ReviewShotKey, string>>;
  checkedShots: ReviewShotKey[];
  checkableShots: ReviewShotKey[];
  onShotChange: (shot: ReviewShotKey | null) => void;
  onCheck: (shot: ReviewShotKey) => void;
}

// 화면 전체로 사진을 보고, 확인 항목은 사진 아래에서 바로 체크한다. 처음과 끝에서는 넘기기 버튼이 비활성이다.
// 재신청의 이전 사진은 옆으로 넘겨 비교한다.
export function MobileShotViewer({
  shots,
  shot,
  photoUrls,
  previousUrls,
  checkedShots,
  checkableShots,
  onShotChange,
  onCheck,
}: MobileShotViewerProps) {
  const [view, setView] = useState(RESET_VIEW);
  const index = shots.findIndex((candidate) => candidate.key === shot);
  const current = shots[index];
  const previousUrl = current ? previousUrls[current.key] : undefined;
  const checkable = Boolean(current && checkableShots.includes(current.key));
  const checked = Boolean(current && checkedShots.includes(current.key));

  const move = (step: number) => {
    setView(RESET_VIEW);
    onShotChange(shots[index + step]!.key);
  };
  const paneProps = {
    view,
    onZoomAt: (point: { x: number; y: number }) => {
      const zoom = view.zoom >= ZOOM_MAX ? 1 : view.zoom + ZOOM_STEP;
      const ratio = zoom / view.zoom;
      setView({
        ...view,
        zoom,
        offset:
          zoom === 1
            ? { x: 0, y: 0 }
            : {
                x: point.x - ratio * (point.x - view.offset.x),
                y: point.y - ratio * (point.y - view.offset.y),
              },
      });
    },
    onPan: (delta: { x: number; y: number }) =>
      setView({ ...view, offset: { x: view.offset.x + delta.x, y: view.offset.y + delta.y } }),
  };

  return (
    <Dialog.Root
      open={Boolean(current)}
      onOpenChange={(open) => {
        if (open) return;
        setView(RESET_VIEW);
        onShotChange(null);
      }}
    >
      <Dialog.Popup
        data-theme="dark"
        className="inset-0 top-0 left-0 h-dvh max-h-none w-full max-w-none translate-x-0 translate-y-0 gap-0 rounded-none border-0 bg-surface p-0"
      >
        {current ? (
          <>
            <HStack
              align="center"
              gap="050"
              className="h-14 shrink-0 border-b border-gray-200 px-050"
            >
              <Dialog.Close render={<IconButton variant="ghost" size="lg" aria-label="닫기" />}>
                <X size={22} aria-hidden />
              </Dialog.Close>
              <VStack className="min-w-0 flex-1">
                <Dialog.Title className="text-subtitle1">{current.label}</Dialog.Title>
                <Text typography="body4" foreground="hint" numeric>
                  {`${current.note} · ${index + 1} / ${shots.length}`}
                </Text>
              </VStack>
            </HStack>
            {previousUrl ? (
              <HStack className="min-h-0 flex-1 snap-x snap-mandatory overflow-x-auto bg-gray-100">
                <VStack className="h-full w-full shrink-0 snap-start p-150">
                  <ZoomPane
                    url={previousUrl}
                    label={`${current.label} 이전 사진`}
                    caption="이전 사진 · 지난번에 문제로 지정함"
                    {...paneProps}
                  />
                </VStack>
                <VStack className="h-full w-full shrink-0 snap-start p-150">
                  <ZoomPane
                    url={photoUrls[current.key]}
                    label={`${current.label} 새 사진`}
                    caption="새 사진"
                    {...paneProps}
                  />
                </VStack>
              </HStack>
            ) : (
              <VStack className="min-h-0 flex-1 bg-gray-100">
                <ZoomPane
                  url={photoUrls[current.key]}
                  label={`${current.label} 확대`}
                  {...paneProps}
                />
              </VStack>
            )}
            <VStack
              gap="100"
              className="shrink-0 border-t border-gray-200 bg-surface px-150 pt-125 pb-[calc(var(--spacing-150)+var(--rc-safe-bottom))]"
            >
              {checkable ? (
                <Checkbox.Field className="min-h-12 w-full">
                  <Checkbox.Root checked={checked} onCheckedChange={() => onCheck(current.key)}>
                    <Checkbox.Indicator />
                  </Checkbox.Root>
                  <Checkbox.Label className="flex-1">{current.question}</Checkbox.Label>
                </Checkbox.Field>
              ) : null}
              <HStack gap="100">
                <Button
                  variant="outline"
                  colorPalette="gray"
                  disabled={index === 0}
                  onClick={() => move(-1)}
                  className="min-h-12 flex-1"
                >
                  이전
                </Button>
                <Button
                  disabled={index === shots.length - 1}
                  onClick={() => move(1)}
                  className="min-h-12 flex-1"
                >
                  다음
                </Button>
              </HStack>
            </VStack>
          </>
        ) : null}
      </Dialog.Popup>
    </Dialog.Root>
  );
}
