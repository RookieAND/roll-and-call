"use client";

import { Text, VStack, cn } from "@roll-and-call/ui";
import { useRef, type PointerEvent } from "react";

import { PhotoSlot } from "./photo-slot";

const DRAG_THRESHOLD = 3;

export interface ZoomView {
  zoom: number;
  rotation: number;
  offset: { x: number; y: number };
  original: boolean;
}

interface ZoomPaneProps {
  url?: string;
  label: string;
  caption?: string;
  view: ZoomView;
  // 누른 지점(사진 칸 가운데 기준 px)을 중심으로 확대한다.
  onZoomAt: (point: { x: number; y: number }) => void;
  onPan: (delta: { x: number; y: number }) => void;
}

export function ZoomPane({ url, label, caption, view, onZoomAt, onPan }: ZoomPaneProps) {
  const drag = useRef<{ x: number; y: number; moved: boolean } | null>(null);

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.target instanceof Element && event.target.closest("a, button")) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { x: event.clientX, y: event.clientY, moved: false };
  };
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const start = drag.current;
    if (!start) return;
    const delta = { x: event.clientX - start.x, y: event.clientY - start.y };
    if (!start.moved && Math.hypot(delta.x, delta.y) < DRAG_THRESHOLD) return;
    drag.current = { x: event.clientX, y: event.clientY, moved: true };
    if (view.zoom > 1) onPan(delta);
  };
  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const start = drag.current;
    drag.current = null;
    if (!start || start.moved) return;
    const rect = event.currentTarget.getBoundingClientRect();
    onZoomAt({
      x: event.clientX - rect.left - rect.width / 2,
      y: event.clientY - rect.top - rect.height / 2,
    });
  };

  return (
    <VStack gap="075" className="h-full min-w-0 flex-1">
      {caption ? (
        <Text typography="body4" weight="bold">
          {caption}
        </Text>
      ) : null}
      {/* ponytail: 확대·끌기를 받는 사진 칸이다. 키보드는 머리줄의 확대·축소 버튼으로 같은 일을 한다. */}
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onDragStart={(event) => event.preventDefault()}
        className={cn(
          "min-h-0 flex-1 touch-none select-none",
          view.original ? "overflow-auto" : "overflow-hidden",
          view.zoom > 1 ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in",
        )}
      >
        <PhotoSlot
          url={url}
          placeholder={label}
          pdfLink
          className={view.original ? "max-w-none" : "size-full"}
          imageStyle={{
            transform: `translate(${view.offset.x}px, ${view.offset.y}px) scale(${view.zoom}) rotate(${view.rotation}deg)`,
          }}
        />
      </div>
    </VStack>
  );
}
