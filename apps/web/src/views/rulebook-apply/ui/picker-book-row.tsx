import { Badge, Checkbox, HStack, Text, VStack, cn } from "@roll-and-call/ui";
import { cva } from "class-variance-authority";
import { BookOpen, ChevronRight, CircleCheck, CircleMinus, Clock, Lock } from "lucide-react";
import Link from "next/link";

import { CERT_OPTION, type CertOptionType } from "@/entities/rulebook";

import { bookTitleForeground } from "./book-title-foreground";

const row = cva(
  "flex min-h-15 items-center gap-150 rounded-500 border border-gray-200 px-175 py-150",
  {
    variants: {
      pickable: {
        true: "bg-surface transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
        false: "bg-gray-50",
      },
    },
  },
);

const STATUS = {
  [CERT_OPTION.certified]: {
    icon: CircleCheck,
    className: "text-success-700",
    badge: { label: "인증됨", palette: "success" },
  },
  [CERT_OPTION.pending]: {
    icon: Clock,
    className: "text-gray-600",
    badge: { label: "심사 중", palette: "gray" },
  },
  [CERT_OPTION.needsCore]: { icon: Lock, className: "text-hint", badge: null },
  [CERT_OPTION.free]: {
    icon: CircleMinus,
    className: "text-hint",
    badge: { label: "인증 불필요", palette: "gray" },
  },
  [CERT_OPTION.unlocked]: { icon: CircleMinus, className: "text-hint", badge: null },
} as const;

// 여러 권 함께 신청 모드에서 행이 고르는 칸이 된다.
export interface PickerBookSelection {
  checked: boolean;
  // 이번 묶음으로 신청할 수 있는 책인지(인증됨·심사 중·기본 룰북이 없는 서플리먼트는 아니다).
  available: boolean;
  // 한도에 닿아 새로 고를 수 없을 때.
  limitReached: boolean;
  onToggle: () => void;
}

interface PickerBookRowProps {
  title: string;
  edition: string;
  type: CertOptionType;
  note: string;
  noteDanger?: boolean;
  rejected: boolean;
  href: string;
  selection: PickerBookSelection | null;
}

export function PickerBookRow({
  title,
  edition,
  type,
  note,
  noteDanger = false,
  rejected,
  href,
  selection,
}: PickerBookRowProps) {
  const selectable = selection?.available ?? false;
  const status = type === CERT_OPTION.pick || selectable ? null : STATUS[type];
  const Icon = status?.icon ?? BookOpen;
  const titleForeground = selectable ? "normal" : bookTitleForeground(type);
  const leading =
    selection && selectable ? null : (
      <Icon
        size={22}
        strokeWidth={2.1}
        aria-hidden
        className={cn("flex-none", status?.className ?? "text-tinted-ink")}
      />
    );
  const rejectedForeground = rejected ? "warning" : "muted";
  const noteForeground = noteDanger ? "danger" : rejectedForeground;
  const body = (
    <>
      {leading}
      <VStack gap="025" className="min-w-0 flex-1">
        <HStack align="baseline" gap="075" wrap>
          <Text typography="body2" weight="medium" foreground={titleForeground}>
            {title}
          </Text>
          {edition && (
            <Text typography="body4" weight="medium" foreground="hint">
              {edition}
            </Text>
          )}
        </HStack>
        {note && (
          <Text typography="body4" foreground={noteForeground} className="break-keep">
            {note}
          </Text>
        )}
      </VStack>
      {status?.badge && (
        <Badge colorPalette={status.badge.palette} className="flex-none">
          {status.badge.label}
        </Badge>
      )}
      {!status && !selection && (
        <ChevronRight size={16} aria-hidden className="flex-none text-hint" />
      )}
    </>
  );
  if (status) {
    return (
      <div aria-disabled className={row({ pickable: false })}>
        {body}
      </div>
    );
  }
  if (selection) {
    const disabled = selection.limitReached && !selection.checked;
    return (
      <label className={cn(row({ pickable: !disabled }), disabled && "opacity-50")}>
        <Checkbox.Root
          checked={selection.checked}
          disabled={disabled}
          onCheckedChange={selection.onToggle}
          aria-label={title}
        >
          <Checkbox.Indicator />
        </Checkbox.Root>
        {body}
      </label>
    );
  }
  return (
    <Link href={href} prefetch={false} className={row({ pickable: true })}>
      {body}
    </Link>
  );
}
