import { Badge, Checkbox, Text, VStack } from "@roll-and-call/ui";
import { cva } from "class-variance-authority";
import { CircleCheck, Clock, Lock } from "lucide-react";

import { PICKER_ROW, type PickerRowType } from "../model/picker-row";

const row = cva("-mx-125 flex min-h-14 items-center gap-150 rounded-400 px-125 py-100", {
  variants: {
    selected: { true: "bg-primary-50", false: "" },
    pickable: { true: "cursor-pointer hover:bg-gray-50", false: "" },
  },
  compoundVariants: [{ selected: true, pickable: true, className: "hover:bg-primary-50" }],
});

const STATIC_ICON = {
  certified: { icon: CircleCheck, className: "text-success-700" },
  pending: { icon: Clock, className: "text-gray-600" },
  locked: { icon: Lock, className: "text-hint" },
} as const;

const STATUS_BADGE = {
  certified: { label: "인증됨", palette: "success" },
  pending: { label: "심사 중", palette: "gray" },
} as const;

interface PickerBookRowProps {
  title: string;
  type: PickerRowType;
  note: string;
  selected: boolean;
  rejected: boolean;
  onToggle: () => void;
}

// 책 고르기의 한 권. 고를 수 있으면 체크박스, 아니면 이유 아이콘과 한 줄.
export function PickerBookRow({
  title,
  type,
  note,
  selected,
  rejected,
  onToggle,
}: PickerBookRowProps) {
  const pickable = type === PICKER_ROW.pick;
  const locked = type === PICKER_ROW.locked;
  const noteForeground = rejected ? "warning" : locked ? "hint" : "muted";
  const staticIcon = pickable ? null : STATIC_ICON[type];
  const Icon = staticIcon?.icon;
  const badge =
    type === PICKER_ROW.certified || type === PICKER_ROW.pending ? STATUS_BADGE[type] : null;

  const body = (
    <>
      <span className="flex w-[22px] flex-none justify-center">
        {Icon ? (
          <Icon size={20} strokeWidth={2.1} aria-hidden className={staticIcon.className} />
        ) : (
          <Checkbox.Root checked={selected} onCheckedChange={onToggle} aria-label={title}>
            <Checkbox.Indicator />
          </Checkbox.Root>
        )}
      </span>
      <VStack gap="025" className="min-w-0 flex-1">
        <Text
          typography="body2"
          weight={selected ? "bold" : "medium"}
          foreground={pickable ? "normal" : "muted"}
        >
          {title}
        </Text>
        {note && (
          <Text typography="body4" foreground={noteForeground} className="break-keep">
            {note}
          </Text>
        )}
      </VStack>
      {badge && (
        <Badge colorPalette={badge.palette} className="flex-none">
          {badge.label}
        </Badge>
      )}
      {pickable && rejected && (
        <Badge colorPalette="warning" className="flex-none">
          반려됨
        </Badge>
      )}
    </>
  );

  return pickable ? (
    // ponytail: 줄 전체를 눌러도 체크되도록 label로 감싼다.
    <label className={row({ selected, pickable })}>{body}</label>
  ) : (
    <div aria-disabled className={row({ selected: false, pickable: false })}>
      {body}
    </div>
  );
}
