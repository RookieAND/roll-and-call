import { cn, HStack, IconButton, Progress, Text, VStack } from "@roll-and-call/ui";
import { cva } from "class-variance-authority";
import { CircleAlert, FileText, Plus, X } from "lucide-react";
import type { ReactNode } from "react";

import { PHOTO_SLOT, slotUrl, type PhotoSlot } from "../model/photo-slot";

const frame = cva(
  "relative block w-full overflow-hidden rounded-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
  {
    variants: {
      status: {
        empty: "border border-gray-200 bg-gray-50",
        uploading: "border border-gray-200 bg-secondary-strong",
        done: "border border-gray-200 bg-secondary-strong",
        previous: "border border-gray-200 bg-secondary-strong",
        error: "border-2 border-warning-600 bg-secondary-strong",
      },
      square: { true: "aspect-square", false: "aspect-[3/4]" },
      selected: { true: "border-2 border-primary-600", false: "" },
      needed: { true: "", false: "" },
    },
    compoundVariants: [
      { status: "error", selected: true, className: "border-warning-600" },
      {
        status: "empty",
        selected: false,
        needed: true,
        className: "border-2 border-dashed border-tinted-border",
      },
    ],
  },
);

const art = cva("absolute inset-0", {
  variants: {
    status: {
      empty: "opacity-45",
      uploading: "opacity-50",
      done: "",
      previous: "",
      error: "opacity-50",
    },
  },
});

const PILL_CLASS =
  "absolute bottom-125 left-1/2 flex -translate-x-1/2 items-center gap-050 whitespace-nowrap rounded-full border bg-surface px-125 py-050";

const TAG_CLASS = "absolute top-075 left-075 rounded-100 bg-surface px-075";

interface PhotoTileProps {
  label: string;
  example: ReactNode;
  slot: PhotoSlot;
  selected: boolean;
  // 아직 비어 있어 채워야 하는 칸. 점선으로 남은 칸을 알린다.
  needed: boolean;
  // 구매 내역·영수증은 정사각형이다.
  square?: boolean;
  onPick: () => void;
  onRemove: () => void;
}

// 사진 칸. 빈 칸에는 무엇을 찍을지 예시 그림을 흐리게 깐다. PDF는 그림 대신 문서 아이콘을 둔다.
export function PhotoTile({
  label,
  example,
  slot,
  selected,
  needed,
  square = false,
  onPick,
  onRemove,
}: PhotoTileProps) {
  const url = slotUrl(slot);
  const pdf = url.toLowerCase().endsWith(".pdf");
  const filled = url !== "";
  const labelForeground =
    slot.status === PHOTO_SLOT.error ? "warning" : selected ? "primary" : "muted";
  const tag =
    slot.status === PHOTO_SLOT.empty
      ? "예시"
      : slot.status === PHOTO_SLOT.previous
        ? "이전 사진"
        : pdf
          ? "PDF"
          : null;

  return (
    <VStack gap="075" className="min-w-0 flex-1">
      <div className="relative">
        {/* ponytail: 사진 칸 전체가 누르는 자리라 Button 모양을 쓸 수 없다. */}
        <button
          type="button"
          aria-label={`${label} ${filled ? "보기" : "올리기"}`}
          aria-pressed={selected}
          onClick={onPick}
          className={cn(frame({ status: slot.status, square, selected, needed }))}
        >
          {filled &&
            !pdf && (
              // oxlint-disable-next-line nextjs/no-img-element -- 스토리지 원본 사진이라 최적화 경로를 타지 않는다.
              <img src={url} alt="" className="absolute inset-0 size-full object-cover" />
            )}
          {filled && pdf && (
            <span className="absolute inset-0 flex items-center justify-center text-gray-600">
              <FileText size={28} aria-hidden />
            </span>
          )}
          {!filled && <span className={art({ status: slot.status })}>{example}</span>}
          {tag && (
            <Text typography="body4" weight="bold" foreground="muted" className={TAG_CLASS}>
              {tag}
            </Text>
          )}
          {slot.status === PHOTO_SLOT.empty && (
            <HStack align="center" className={`${PILL_CLASS} border-gray-200 text-tinted-ink`}>
              <Plus size={12} strokeWidth={2.6} aria-hidden />
              <Text typography="body4" weight="bold" foreground="inherit">
                추가
              </Text>
            </HStack>
          )}
          {slot.status === PHOTO_SLOT.uploading && (
            <VStack
              gap="050"
              className="absolute right-100 bottom-125 left-100 rounded-300 bg-surface px-100 py-075"
            >
              <Text typography="body4" weight="bold" foreground="muted" numeric>
                올리는 중 {Math.round(slot.progress * 100)}%
              </Text>
              <Progress
                value={slot.progress * 100}
                max={100}
                className="h-1"
                aria-label="올리는 중"
              />
            </VStack>
          )}
          {slot.status === PHOTO_SLOT.error && (
            <HStack align="center" className={`${PILL_CLASS} border-warning-600 text-warning-600`}>
              <CircleAlert size={12} strokeWidth={2.6} aria-hidden />
              <Text typography="body4" weight="bold" foreground="inherit">
                다시 올리기
              </Text>
            </HStack>
          )}
        </button>
        {filled && (
          <IconButton
            size="sm"
            aria-label={`${label} 지우기`}
            onClick={onRemove}
            className="absolute top-050 right-050 rounded-full bg-dim text-on-primary hover:bg-dim"
          >
            <X size={13} strokeWidth={2.6} />
          </IconButton>
        )}
      </div>
      <Text typography="body3" weight="bold" foreground={labelForeground} className="text-center">
        {label}
      </Text>
    </VStack>
  );
}
