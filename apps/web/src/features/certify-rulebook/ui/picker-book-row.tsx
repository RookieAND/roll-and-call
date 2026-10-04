import { Badge, HStack, Text, VStack } from "@roll-and-call/ui";
import { cva } from "class-variance-authority";
import { BookOpen, ChevronRight, CircleCheck, CircleMinus, Clock, Lock } from "lucide-react";
import Link from "next/link";

import { CERT_OPTION, type CertOptionType } from "@/entities/rulebook";

import { bookTitleForeground } from "./book-title-foreground";

const row = cva(
  "flex min-h-[60px] items-center gap-150 rounded-500 border border-gray-200 px-175 py-150",
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

interface PickerBookRowProps {
  title: string;
  edition: string;
  type: CertOptionType;
  note: string;
  rejected: boolean;
  href: string;
}

export function PickerBookRow({ title, edition, type, note, rejected, href }: PickerBookRowProps) {
  const status = type === CERT_OPTION.pick ? null : STATUS[type];
  const Icon = status?.icon ?? BookOpen;
  const titleForeground = bookTitleForeground(type);
  const body = (
    <>
      <Icon
        size={22}
        strokeWidth={2.1}
        aria-hidden
        className={`flex-none ${status?.className ?? "text-tinted-ink"}`}
      />
      <VStack gap="050" className="min-w-0 flex-1">
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
          <Text
            typography="body4"
            foreground={rejected ? "warning" : "muted"}
            className="break-keep"
          >
            {note}
          </Text>
        )}
      </VStack>
      {status?.badge && (
        <Badge colorPalette={status.badge.palette} className="flex-none">
          {status.badge.label}
        </Badge>
      )}
      {!status && <ChevronRight size={16} aria-hidden className="flex-none text-hint" />}
    </>
  );
  return status ? (
    <div aria-disabled className={row({ pickable: false })}>
      {body}
    </div>
  ) : (
    <Link href={href} className={row({ pickable: true })}>
      {body}
    </Link>
  );
}
