import { Button, HStack, Text, VStack } from "@roll-and-call/ui";
import { ChevronRight } from "lucide-react";

import { Tag } from "@/shared/ui";

import { PhotoSlot } from "./photo-slot";
import { ShotStatusTag } from "./shot-status-tag";

interface MobileShotRowProps {
  label: string;
  note: string;
  url?: string;
  checked: boolean;
  flagged: boolean;
  flaggable: boolean;
  rejecting: boolean;
  disabled: boolean;
  onFlagToggle: () => void;
  onZoom: () => void;
}

// 사진은 한 줄에 한 장씩 작게 보이고, 줄을 누르면 확대 화면이 열린다. 확인 체크는 확대 화면에서 한다.
export function MobileShotRow({
  label,
  note,
  url,
  checked,
  flagged,
  flaggable,
  rejecting,
  disabled,
  onFlagToggle,
  onZoom,
}: MobileShotRowProps) {
  const status = url ? (
    <ShotStatusTag checked={checked} flagged={flagged} rejecting={rejecting} />
  ) : (
    <Tag>첨부 없음</Tag>
  );
  return (
    <HStack align="center" className="border-t border-(--rc-color-border-subtle)">
      <Button
        variant="ghost"
        colorPalette="gray"
        disabled={!url}
        aria-label={`${label} 사진 확대`}
        onClick={onZoom}
        className="h-auto min-h-16 min-w-0 flex-1 justify-start gap-125 py-100 pr-0 pl-175 text-left font-normal"
      >
        <PhotoSlot
          url={url}
          placeholder={label}
          className="size-12 shrink-0 rounded-300 border-0 object-cover"
        />
        <VStack gap="025" className="min-w-0 flex-1">
          <Text typography="body2" weight="bold">
            {label}
          </Text>
          <Text typography="body4" foreground="hint" truncate>
            {note}
          </Text>
        </VStack>
      </Button>
      {flaggable ? (
        <Button
          size="sm"
          variant={flagged ? "tinted" : "outline"}
          colorPalette={flagged ? "danger" : "gray"}
          aria-pressed={flagged}
          disabled={disabled}
          onClick={onFlagToggle}
          className="mr-100 min-h-10 shrink-0"
        >
          {flagged ? "문제 있음" : "지정 전"}
        </Button>
      ) : (
        <div className="shrink-0">{status}</div>
      )}
      <ChevronRight size={18} aria-hidden className="mr-125 shrink-0 text-hint" />
    </HStack>
  );
}
