import { HStack, Text, VStack } from "@trpg/ui";
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
  blocked: "danger",
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

const manageRow = cva("min-h-[60px] border-gray-100 px-175 py-150 not-first:border-t", {
  variants: {
    interactive: { true: "transition-colors hover:bg-gray-50", false: "" },
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
      className={manageRow({ interactive: Boolean(row.href) })}
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
      {row.href && <ChevronRight size={17} className="flex-none text-gray-400" aria-hidden />}
    </HStack>
  );
}
