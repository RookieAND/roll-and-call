import { Button, Checkbox, HStack, Text, VStack } from "@roll-and-call/ui";
import { cva } from "class-variance-authority";
import { ZoomIn } from "lucide-react";

import { Kbd, Tag } from "@/shared/ui";

import { PhotoSlot } from "./photo-slot";

const card = cva("min-w-0 overflow-hidden rounded-600 border bg-surface", {
  variants: {
    flagged: { true: "border-danger-600", false: "border-gray-200" },
  },
});

const checkRow = cva("w-full px-150 py-125", {
  variants: {
    checked: { true: "bg-(--rc-color-bg-primary-weakest)", false: "" },
  },
});

interface ShotCardProps {
  index: number;
  label: string;
  note: string;
  question: string;
  url?: string;
  fresh?: string;
  deleted: boolean;
  checked: boolean;
  disabled: boolean;
  flagged: boolean;
  // 반려 중 실물 사진에서 확인 항목을 체크하지 않았을 때만 [문제 지정]을 둔다.
  flaggable: boolean;
  onCheckedChange: () => void;
  onFlagToggle: () => void;
  onZoom: () => void;
}

export function ShotCard({
  index,
  label,
  note,
  question,
  url,
  fresh,
  deleted,
  checked,
  disabled,
  flagged,
  flaggable,
  onCheckedChange,
  onFlagToggle,
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
        <HStack align="center" gap="075" className="shrink-0">
          {fresh ? <Tag>{fresh}</Tag> : null}
          {flaggable ? (
            <Button
              size="sm"
              variant={flagged ? "tinted" : "outline"}
              colorPalette={flagged ? "danger" : "gray"}
              aria-pressed={flagged}
              onClick={onFlagToggle}
            >
              문제 지정
            </Button>
          ) : null}
        </HStack>
      </HStack>
      {deleted ? (
        <VStack
          align="center"
          justify="center"
          className="mx-150 mb-150 h-[336px] rounded-400 border border-dashed border-gray-300 p-150 text-center"
        >
          <Text typography="body3" foreground="hint">
            보관 기간이 지나 사진이 삭제되었습니다.
          </Text>
        </VStack>
      ) : (
        <>
          <div className="relative h-[360px] w-full border-y border-(--rc-color-border-subtle) bg-gray-100">
            {url ? (
              <>
                {/* ponytail: 사진 자체가 누르는 자리라 버튼 룩이 없다. 평소에도 반려 중에도 확대 창을 연다(D296). */}
                <button
                  type="button"
                  onClick={onZoom}
                  aria-label={`${label} 사진 확대`}
                  className="block size-full overflow-hidden"
                >
                  <PhotoSlot
                    url={url}
                    placeholder={`${label} 사진`}
                    className="size-full border-0"
                  />
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
          {url ? (
            <HStack align="center" gap="100" className={checkRow({ checked })}>
              <Checkbox.Field className="min-w-0 flex-1">
                <Checkbox.Root
                  checked={checked}
                  disabled={disabled}
                  onCheckedChange={onCheckedChange}
                >
                  <Checkbox.Indicator />
                </Checkbox.Root>
                <Checkbox.Label>{question}</Checkbox.Label>
              </Checkbox.Field>
              <Kbd>{index + 1}</Kbd>
            </HStack>
          ) : (
            <Text typography="body4" foreground="hint" className="px-150 py-125">
              사진이 없어 확인할 수 없습니다
            </Text>
          )}
        </>
      )}
    </VStack>
  );
}
