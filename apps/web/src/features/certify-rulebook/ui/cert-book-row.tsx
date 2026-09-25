import { Badge, Button, Checkbox, HStack, Text, VStack } from "@roll-and-call/ui";
import { cva } from "class-variance-authority";
import { ArrowUp, CircleCheck, CircleMinus, Clock, Lock, type LucideIcon } from "lucide-react";

import {
  CERT_OPTION,
  CERT_STATE,
  RULEBOOK_KIND_LABEL,
  type CertOptionType,
  type MyRulebook,
} from "@/entities/rulebook";

const row = cva("-mx-125 flex min-h-14 items-center gap-150 rounded-400 px-125 py-100", {
  variants: {
    selected: { true: "bg-primary-50", false: "" },
    pickable: { true: "cursor-pointer hover:bg-gray-50", false: "" },
  },
  compoundVariants: [{ selected: true, pickable: true, className: "hover:bg-primary-50" }],
});

// 고를 수 없는 줄의 왼쪽 아이콘과 오른쪽 배지.
const STATIC_ROW: Record<
  Exclude<CertOptionType, "pick">,
  { icon: LucideIcon; iconClass: string; status?: { label: string; palette: "success" | "gray" } }
> = {
  free: { icon: CircleMinus, iconClass: "text-gray-600" },
  certified: {
    icon: CircleCheck,
    iconClass: "text-success-700",
    status: { label: "인증됨", palette: "success" },
  },
  unlocked: { icon: CircleCheck, iconClass: "text-success-700" },
  pending: {
    icon: Clock,
    iconClass: "text-gray-600",
    status: { label: "확인 중", palette: "gray" },
  },
  locked: { icon: Lock, iconClass: "text-hint" },
  jump: { icon: Lock, iconClass: "text-hint" },
};

interface CertBookRowProps {
  rulebook: MyRulebook;
  // 카테고리 머리글 아래면 짧은 이름, 혼자 선 줄이면 판본까지 붙인 이름.
  title: string;
  type: CertOptionType;
  note: string;
  selected: boolean;
  onToggle: () => void;
  onJump: () => void;
}

// 룰북 선택 시트의 책 한 권. 고를 수 있으면 체크박스, 아니면 이유 아이콘과 한 줄.
export function CertBookRow({
  rulebook,
  title,
  type,
  note,
  selected,
  onToggle,
  onJump,
}: CertBookRowProps) {
  const pickable = type === CERT_OPTION.pick;
  const muted = type === CERT_OPTION.locked || type === CERT_OPTION.jump;
  const rejected = rulebook.state === CERT_STATE.rejected;
  const noteForeground = rejected ? "warning" : muted ? "hint" : "muted";
  const staticRow = pickable ? null : STATIC_ROW[type];
  const Icon = staticRow?.icon;

  const body = (
    <>
      <span className="flex w-[22px] flex-none justify-center">
        {Icon ? (
          <Icon size={20} strokeWidth={2.1} aria-hidden className={staticRow.iconClass} />
        ) : (
          <Checkbox.Root checked={selected} onCheckedChange={onToggle} aria-label={title}>
            <Checkbox.Indicator />
          </Checkbox.Root>
        )}
      </span>
      <VStack gap="025" className="min-w-0 flex-1">
        <HStack align="center" gap="075" wrap>
          <Text
            typography="body2"
            weight={selected ? "bold" : "medium"}
            foreground={muted ? "muted" : "normal"}
          >
            {title}
          </Text>
          <Badge>{RULEBOOK_KIND_LABEL[rulebook.kind]}</Badge>
        </HStack>
        {note && (
          <Text typography="body4" foreground={noteForeground} className="break-keep">
            {note}
          </Text>
        )}
      </VStack>
      {staticRow?.status && (
        <Badge colorPalette={staticRow.status.palette} className="flex-none">
          {staticRow.status.label}
        </Badge>
      )}
      {pickable && rejected && (
        <Badge colorPalette="warning" className="flex-none">
          반려됨
        </Badge>
      )}
      {type === CERT_OPTION.jump && (
        <Button
          variant="ghost"
          colorPalette="primary"
          size="sm"
          onClick={onJump}
          className="flex-none"
        >
          고르기
          <ArrowUp size={14} strokeWidth={2.4} aria-hidden />
        </Button>
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
