import { HStack, Text, VStack } from "@roll-and-call/ui";
import { cva } from "class-variance-authority";
import { Check, ChevronRight, ClipboardCheck, Clock, Pencil, Users } from "lucide-react";
import Link from "next/link";

import { IconTile } from "@/shared/ui";

import type { ManageRow as Row } from "../model/manage-rows";

const ICONS = {
  clipboard: ClipboardCheck,
  clock: Clock,
  check: Check,
  users: Users,
  pencil: Pencil,
};

const ICON_TONE = {
  open: "primary",
  blocked: "urgent",
  done: "success",
  locked: "locked",
} as const;

const LABEL_FOREGROUND = {
  open: "normal",
  blocked: "danger",
  done: "normal",
  locked: "hint",
} as const;

const DETAIL_FOREGROUND = {
  open: "muted",
  blocked: "danger",
  done: "muted",
  locked: "hint",
} as const;

// 막힌 줄은 줄 전체를 붉게 칠한다 — 목록 카드·할 일 카드와 같은 신호다.
const manageRow = cva("min-h-16 px-175 py-150", {
  variants: {
    interactive: { true: "transition-colors hover:bg-gray-50", false: "" },
    blocked: { true: "bg-danger-50 hover:bg-danger-50", false: "" },
  },
});

interface ManageRowProps {
  row: Row;
}

export function ManageRow({ row }: ManageRowProps) {
  const container = row.href ? <Link href={row.href} /> : <div />;

  return (
    <HStack
      align="center"
      gap="150"
      render={container}
      className={manageRow({ interactive: Boolean(row.href), blocked: row.state === "blocked" })}
    >
      <IconTile icon={ICONS[row.icon]} tone={ICON_TONE[row.state]} />
      <VStack gap="025" className="min-w-0 flex-1">
        <Text typography="subtitle1" foreground={LABEL_FOREGROUND[row.state]}>
          {row.label}
        </Text>
        <Text typography="body4" foreground={DETAIL_FOREGROUND[row.state]}>
          {row.detail}
        </Text>
      </VStack>
      {row.href && <ChevronRight size={17} className="flex-none text-hint" aria-hidden />}
    </HStack>
  );
}
