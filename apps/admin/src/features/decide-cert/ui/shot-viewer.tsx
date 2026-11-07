"use client";

import { Button, Checkbox, Dialog, HStack, IconButton, Text, cn } from "@roll-and-call/ui";
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
import { useState, type RefObject } from "react";

import { Kbd } from "@/shared/ui";

import { nextUncheckedShot } from "../model/next-unchecked-shot";
import type { ReviewShot, ReviewShotKey } from "../model/shots";
import { ZoomPane, type ZoomView } from "./zoom-pane";

const ZOOM_STEP = 0.5;
const ZOOM_MAX = 3;
const RESET_VIEW: ZoomView = { zoom: 1, rotation: 0, offset: { x: 0, y: 0 }, original: false };

interface ShotViewerProps {
  shots: readonly ReviewShot[];
  shot: ReviewShotKey | null;
  photoUrls: Partial<Record<ReviewShotKey, string>>;
  // 재신청에서 지난번에 문제로 지정한 사진은 이전 사진과 나란히 본다.
  previousUrls: Partial<Record<ReviewShotKey, string>>;
  checkedShots: ReviewShotKey[];
  // 확인할 수 있는 사진(사진이 있고 심사 중인 신청). 없으면 체크 줄을 두지 않는다.
  checkableShots: ReviewShotKey[];
  finalFocus: RefObject<HTMLButtonElement | null>;
  onShotChange: (shot: ReviewShotKey | null) => void;
  onCheck: (shot: ReviewShotKey) => void;
}

export function ShotViewer({
  shots,
  shot,
  photoUrls,
  previousUrls,
  checkedShots,
  checkableShots,
  finalFocus,
  onShotChange,
  onCheck,
}: ShotViewerProps) {
  const [view, setView] = useState(RESET_VIEW);
  // 올리지 않은 칸은 화살표와 하단 목록에서 뺀다.
  const stops = shots.filter((candidate) => photoUrls[candidate.key]);
  const navigable = stops.length > 0 ? stops : shots;
  const index = navigable.findIndex((candidate) => candidate.key === shot);
  const current = navigable[index];
  const shotNumber = shots.findIndex((candidate) => candidate.key === shot) + 1;
  const previousUrl = current ? previousUrls[current.key] : undefined;
  const checkable = Boolean(current && checkableShots.includes(current.key));
  const checked = Boolean(current && checkedShots.includes(current.key));
  const remaining = checkableShots.filter((key) => !checkedShots.includes(key)).length;
  const checkedCount = checkableShots.length - remaining;
  const nextUnchecked = current
    ? nextUncheckedShot({ order: checkableShots, checked: checkedShots, from: current.key })
    : undefined;

  let checkNote = `확인하지 않은 사진이 ${remaining}장 남았습니다`;
  if (remaining === 0) checkNote = "모든 사진을 확인했습니다";
  else if (remaining === 1 && !checked) {
    checkNote = "이 사진을 체크하면 모두 확인한 것이어서 창이 닫히고 [승인]으로 이동합니다";
  }

  const zoomTo = (zoom: number, point = { x: 0, y: 0 }) => {
    const next = Math.min(ZOOM_MAX, Math.max(1, zoom));
    const ratio = next / view.zoom;
    setView({
      ...view,
      zoom: next,
      offset:
        next === 1
          ? { x: 0, y: 0 }
          : {
              x: point.x - ratio * (point.x - view.offset.x),
              y: point.y - ratio * (point.y - view.offset.y),
            },
    });
  };

  const move = (step: number) => {
    setView(RESET_VIEW);
    onShotChange(navigable[(index + step + navigable.length) % navigable.length]!.key);
  };

  const tools: { label: string; icon: LucideIcon; onClick: () => void; disabled?: boolean }[] = [
    {
      label: "확대",
      icon: ZoomIn,
      onClick: () => zoomTo(view.zoom + ZOOM_STEP),
      disabled: view.zoom >= ZOOM_MAX,
    },
    {
      label: "축소",
      icon: ZoomOut,
      onClick: () => zoomTo(view.zoom - ZOOM_STEP),
      disabled: view.zoom <= 1,
    },
    {
      label: "왼쪽으로 회전",
      icon: RotateCcw,
      onClick: () => setView({ ...view, rotation: view.rotation - 90 }),
    },
    {
      label: "오른쪽으로 회전",
      icon: RotateCw,
      onClick: () => setView({ ...view, rotation: view.rotation + 90 }),
    },
  ];
  const paneProps = {
    view,
    onZoomAt: (point: { x: number; y: number }) => zoomTo(view.zoom + ZOOM_STEP, point),
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
        finalFocus={finalFocus}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") move(-1);
          if (event.key === "ArrowRight") move(1);
        }}
        className="inset-0 top-0 left-0 h-dvh max-h-none w-full max-w-none translate-x-0 translate-y-0 gap-0 rounded-none border-0 bg-surface px-250 py-200"
      >
        {current ? (
          <>
            <HStack align="center" gap="125">
              <Dialog.Title className="text-body3">
                {current.label} · {current.note}
              </Dialog.Title>
              <Text typography="body4" foreground="muted" numeric>
                {index + 1} / {navigable.length}
              </Text>
              {checkableShots.length > 0 ? (
                <Text typography="body4" weight="bold" numeric>
                  {`확인 ${checkedCount} / ${checkableShots.length}`}
                </Text>
              ) : null}
              <Text typography="body4" foreground="muted">
                누른 지점을 기준으로 확대하고, 끌어서 옮길 수 있습니다
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
                  aria-pressed={view.original}
                  onClick={() => setView({ ...view, original: !view.original })}
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
              {previousUrl ? (
                <HStack gap="150" className="h-full min-w-0 flex-1">
                  <ZoomPane
                    url={previousUrl}
                    label={`${current.label} 이전 사진`}
                    caption="이전 사진 · 지난번에 문제로 지정함"
                    {...paneProps}
                  />
                  <ZoomPane
                    url={photoUrls[current.key]}
                    label={`${current.label} 새 사진`}
                    caption="새 사진"
                    {...paneProps}
                  />
                </HStack>
              ) : (
                <HStack className="mx-auto h-full max-w-190 min-w-0 flex-1">
                  <ZoomPane
                    url={photoUrls[current.key]}
                    label={`${current.label} 확대`}
                    {...paneProps}
                  />
                </HStack>
              )}
              <IconButton aria-label="다음 사진" onClick={() => move(1)}>
                <ChevronRight size={22} aria-hidden />
              </IconButton>
            </HStack>
            {checkable ? (
              <HStack
                align="center"
                gap="150"
                className="rounded-600 border border-gray-200 bg-gray-100 px-175 py-125"
              >
                <Checkbox.Field>
                  <Checkbox.Root checked={checked} onCheckedChange={() => onCheck(current.key)}>
                    <Checkbox.Indicator />
                  </Checkbox.Root>
                  <Checkbox.Label>{current.question}</Checkbox.Label>
                </Checkbox.Field>
                <Kbd>{shotNumber}</Kbd>
                <Text typography="body4" foreground="muted" className="ml-auto">
                  {checkNote}
                </Text>
                {checked && remaining === 0 ? (
                  <Button size="sm" onClick={() => onShotChange(null)}>
                    확인 완료
                  </Button>
                ) : null}
                {checked && remaining > 0 && nextUnchecked ? (
                  <Button
                    size="sm"
                    onClick={() => {
                      setView(RESET_VIEW);
                      onShotChange(nextUnchecked);
                    }}
                  >
                    남은 사진 보기
                  </Button>
                ) : null}
              </HStack>
            ) : null}
            <HStack gap="100" justify="center" className="mt-150">
              {navigable.map((candidate, candidateIndex) => (
                <Button
                  key={candidate.key}
                  variant="outline"
                  colorPalette="gray"
                  aria-current={candidateIndex === index}
                  onClick={() => move(candidateIndex - index)}
                  className={cn(
                    "h-[44px] w-15.5 rounded-200 bg-gray-100 px-0 text-body4 font-normal",
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
