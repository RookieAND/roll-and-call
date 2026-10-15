import { Button, Checkbox, HStack, Text, VStack, cn } from "@roll-and-call/ui";
import { ZoomIn } from "lucide-react";

import { Tag } from "@/shared/ui";

import { PhotoSlot } from "./photo-slot";

interface MobileShotCardProps {
  label: string;
  note: string;
  question: string;
  url?: string;
  fresh?: string;
  deleted: boolean;
  checked: boolean;
  disabled: boolean;
  flagged: boolean;
  flaggable: boolean;
  // 묶음 신청은 사진을 옆으로 넘겨 보므로 카드 폭과 사진 높이가 작다.
  compact?: boolean;
  onCheckedChange: () => void;
  onFlagToggle: () => void;
  onZoom: () => void;
}

// 확인 항목은 사진 아래 줄 전체를 눌러 체크한다.
export function MobileShotCard({
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
  compact,
  onCheckedChange,
  onFlagToggle,
  onZoom,
}: MobileShotCardProps) {
  return (
    <VStack
      className={cn(
        "overflow-hidden rounded-600 border bg-surface",
        flagged ? "border-danger-600" : "border-gray-200",
        compact ? "w-67 shrink-0 snap-start" : "min-w-0",
      )}
    >
      <HStack align="center" gap="100" className="px-150 py-125">
        <VStack gap="025" className="min-w-0 flex-1">
          <Text typography="subtitle1">{label}</Text>
          {compact ? null : (
            <Text typography="body4" foreground="hint">
              {note}
            </Text>
          )}
        </VStack>
        {fresh ? <Tag>{fresh}</Tag> : null}
        {flaggable ? (
          <Button
            size="sm"
            variant={flagged ? "tinted" : "outline"}
            colorPalette={flagged ? "danger" : "gray"}
            aria-pressed={flagged}
            onClick={onFlagToggle}
            className="min-h-10"
          >
            문제 지정
          </Button>
        ) : null}
      </HStack>
      {deleted ? (
        <VStack
          align="center"
          justify="center"
          className="mx-150 mb-150 h-50 rounded-400 border border-dashed border-gray-300 p-150 text-center"
        >
          <Text typography="body3" foreground="hint">
            보관 기간이 지나 사진이 삭제되었습니다.
          </Text>
        </VStack>
      ) : (
        <>
          <div
            className={cn(
              "relative w-full border-y border-(--rc-color-border-subtle) bg-gray-100",
              compact ? "h-50" : "h-60",
            )}
          >
            {url ? (
              <>
                <PhotoSlot url={url} placeholder={`${label} 사진`} className="size-full border-0" />
                <Button
                  variant="outline"
                  colorPalette="gray"
                  size="sm"
                  aria-label={`${label} 사진 확대`}
                  onClick={onZoom}
                  className="absolute right-100 bottom-100 min-h-10 bg-surface shadow-sm"
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
            <Checkbox.Field
              className={cn(
                "min-h-13 w-full px-150",
                checked && "bg-(--rc-color-bg-primary-weakest)",
              )}
            >
              <Checkbox.Root
                checked={checked}
                disabled={disabled}
                onCheckedChange={onCheckedChange}
              >
                <Checkbox.Indicator />
              </Checkbox.Root>
              <Checkbox.Label className="flex-1 py-125">{question}</Checkbox.Label>
            </Checkbox.Field>
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
