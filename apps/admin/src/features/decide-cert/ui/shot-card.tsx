import { Badge, Button, Checkbox, HStack, Text, VStack, cn } from "@roll-and-call/ui";
import { RotateCcw } from "lucide-react";

import { IconBadge } from "@/shared/ui";

import { PhotoSlot } from "./photo-slot";

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
  const photoHeight = compact ? "h-[150px]" : "h-[200px]";
  return (
    <VStack
      gap="100"
      className={cn(
        "rounded-600 border bg-surface p-125",
        flagged ? "border-danger-600" : "border-gray-200",
      )}
    >
      <HStack align="center" gap="075">
        <Text typography="subtitle2">{label}</Text>
        {flagged ? <Badge colorPalette="danger">문제 지정</Badge> : null}
        <Button
          variant="ghost"
          colorPalette="gray"
          size="sm"
          onClick={onZoom}
          className="ml-auto h-auto px-050 py-0 text-body4 font-normal text-hint"
        >
          확대
        </Button>
      </HStack>
      <div className="relative">
        {/* ponytail: 사진 자체가 누르는 자리라 버튼 룩이 없다. 반려 중이면 문제 지정, 아니면 확대. */}
        <button
          type="button"
          onClick={onPhotoClick}
          aria-pressed={flagged}
          aria-label={`${label} 사진`}
          className={cn(
            "block w-full overflow-hidden rounded-400",
            flagged ? "border-2 border-danger-600" : "border border-gray-200",
          )}
        >
          <PhotoSlot url={url} placeholder={note} className={cn("w-full", photoHeight)} />
        </button>
        {replaced ? (
          <span className="absolute top-100 left-100">
            <IconBadge icon={RotateCcw} colorPalette="primary">
              교체됨
            </IconBadge>
          </span>
        ) : null}
      </div>
      <Checkbox.Field>
        <Checkbox.Root checked={checked} disabled={disabled} onCheckedChange={onCheckedChange}>
          <Checkbox.Indicator />
        </Checkbox.Root>
        <Checkbox.Label>
          <Text typography="body3" weight="bold">
            {question}
          </Text>
        </Checkbox.Label>
      </Checkbox.Field>
    </VStack>
  );
}
