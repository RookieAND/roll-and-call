import { Button, Checkbox, HStack, Text, VStack } from "@roll-and-call/ui";
import { cva } from "class-variance-authority";
import { ZoomIn } from "lucide-react";

import { Tag } from "@/shared/ui";

import type { PhotoHeight } from "../model/photo-height";
import { PhotoSlot } from "./photo-slot";

const card = cva("min-w-0 overflow-hidden rounded-600 border bg-surface", {
  variants: {
    flagged: { true: "border-danger-600", false: "border-gray-200" },
  },
});

const photoArea = cva("relative w-full border-y border-(--rc-color-border-subtle) bg-gray-100", {
  variants: {
    height: {
      compact: "h-[150px]",
      medium: "h-[180px]",
      regular: "h-[200px]",
      tall: "h-[260px]",
    },
  },
});

const checkRow = cva("w-full px-150 py-125", {
  variants: {
    checked: { true: "bg-(--rc-color-bg-primary-weakest)", false: "" },
  },
});

interface ShotCardProps {
  label: string;
  note: string;
  question: string;
  url?: string;
  checked: boolean;
  flagged: boolean;
  height: PhotoHeight;
  disabled: boolean;
  onCheckedChange: (checked: boolean) => void;
  onPhotoClick: () => void;
  onZoom: () => void;
}

export function ShotCard({
  label,
  note,
  question,
  url,
  checked,
  flagged,
  height,
  disabled,
  onCheckedChange,
  onPhotoClick,
  onZoom,
}: ShotCardProps) {
  return (
    <VStack className={card({ flagged })}>
      <HStack align="start" gap="100" className="px-150 py-125">
        <VStack gap="025" className="min-w-0 flex-1">
          <Text typography="subtitle1">{label}</Text>
          <Text typography="body4" foreground="hint">
            {note}
          </Text>
        </VStack>
        {flagged ? <Tag>문제 지정</Tag> : null}
      </HStack>
      <div className={photoArea({ height })}>
        {url ? (
          <>
            {/* ponytail: 사진 자체가 누르는 자리라 버튼 룩이 없다. 반려 중이면 문제 지정, 아니면 확대. */}
            <button
              type="button"
              onClick={onPhotoClick}
              aria-pressed={flagged}
              aria-label={`${label} 사진`}
              className="block size-full overflow-hidden"
            >
              <PhotoSlot url={url} placeholder={`${label} 사진`} className="size-full border-0" />
            </button>
            <Button
              variant="outline"
              colorPalette="gray"
              size="sm"
              aria-label={`${label} 사진 확대`}
              onClick={onZoom}
              className="absolute right-100 bottom-100 bg-surface shadow-sm"
            >
              <ZoomIn size={16} aria-hidden />
              확대
            </Button>
          </>
        ) : (
          <VStack align="center" justify="center" className="size-full">
            <Text typography="body4" foreground="hint">
              신청자가 첨부하지 않았습니다
            </Text>
          </VStack>
        )}
      </div>
      <Checkbox.Field className={checkRow({ checked })}>
        <Checkbox.Root checked={checked} disabled={disabled} onCheckedChange={onCheckedChange}>
          <Checkbox.Indicator />
        </Checkbox.Root>
        <Checkbox.Label>{question}</Checkbox.Label>
      </Checkbox.Field>
    </VStack>
  );
}
