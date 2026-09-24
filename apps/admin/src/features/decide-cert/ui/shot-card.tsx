import { Button, Checkbox, HStack, Text, VStack } from "@roll-and-call/ui";
import { cva } from "class-variance-authority";
import { Flag, RotateCcw, ZoomIn } from "lucide-react";

import { IconBadge } from "@/shared/ui";

import { PhotoSlot } from "./photo-slot";

const card = cva("min-w-0 overflow-hidden rounded-600 border bg-surface", {
  variants: {
    flagged: { true: "border-danger-600", false: "border-gray-200" },
  },
});

const photoArea = cva(
  "block w-full overflow-hidden border-y border-(--rc-color-border-subtle) bg-gray-100",
  {
    variants: {
      compact: { true: "h-[150px]", false: "h-[200px]" },
    },
  },
);

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
  replaced: boolean;
  compact: boolean;
  disabled: boolean;
  onCheckedChange: (checked: boolean) => void;
  onPhotoClick: () => void;
  onZoom: () => void;
}

// 머리줄(사진 이름 · 찍어야 할 것 · 상태) > 사진 > 확인 항목 한 줄.
export function ShotCard({
  label,
  note,
  question,
  url,
  checked,
  flagged,
  replaced,
  compact,
  disabled,
  onCheckedChange,
  onPhotoClick,
  onZoom,
}: ShotCardProps) {
  return (
    <VStack className={card({ flagged })}>
      <HStack align="center" gap="100" className="px-150 py-125">
        <Text typography="subtitle1" className="shrink-0">
          {label}
        </Text>
        <Text typography="body4" foreground="hint" truncate className="min-w-0">
          {note}
        </Text>
        <HStack gap="075" className="ml-auto shrink-0">
          {replaced ? (
            <IconBadge icon={RotateCcw} colorPalette="primary">
              교체됨
            </IconBadge>
          ) : null}
          {flagged ? (
            <IconBadge icon={Flag} colorPalette="danger">
              문제 지정
            </IconBadge>
          ) : null}
        </HStack>
      </HStack>
      <div className="relative">
        {/* ponytail: 사진 자체가 누르는 자리라 버튼 룩이 없다. 반려 중이면 문제 지정, 아니면 확대. */}
        <button
          type="button"
          onClick={onPhotoClick}
          aria-pressed={flagged}
          aria-label={`${label} 사진`}
          className={photoArea({ compact })}
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
