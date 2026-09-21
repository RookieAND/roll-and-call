import { Badge, HStack, Text, VStack } from "@trpg/ui";
import { cva } from "class-variance-authority";
import { Check, ChevronRight, ClipboardCheck, Clock, Pencil, Users } from "lucide-react";
import Link from "next/link";

import { IconTile } from "@/shared/ui";

import { MANAGE_ROW_STATE, type ManageRow as Row } from "../model/manage-rows";

const ICONS = {
  clipboard: ClipboardCheck,
  clock: Clock,
  check: Check,
  users: Users,
  pencil: Pencil,
};

const ICON_TONE = {
  open: "primary",
  warning: "primary",
  done: "success",
  locked: "locked",
} as const;

const DETAIL_FOREGROUND = {
  open: "muted",
  warning: "warning",
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
  const done = row.state === MANAGE_ROW_STATE.done;
  const labelForeground = row.state === MANAGE_ROW_STATE.locked ? "hint" : undefined;
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
        <Text typography="subtitle1" foreground={labelForeground}>
          {row.label}
        </Text>
        <Text typography="body4" foreground={DETAIL_FOREGROUND[row.state]}>
          {row.detail}
        </Text>
      </VStack>
      {row.blocked && (
        <span
          role="img"
          aria-label="지금 막혀 있습니다"
          className="h-[7px] w-[7px] flex-none rounded-full bg-danger-solid"
        />
      )}
      {done && (
        <Badge color="success" className="flex-none">
          마침
        </Badge>
      )}
      {row.href && <ChevronRight size={17} className="flex-none text-gray-400" aria-hidden />}
    </HStack>
  );
}
