import { Text, VStack } from "@roll-and-call/ui";
import {
  Check,
  ChevronRight,
  ClipboardCheck,
  Clock,
  MessageSquareText,
  Pencil,
  Users,
} from "lucide-react";

import { IconTile } from "@/shared/ui";

import type { ManageRow } from "../model/manage-row-state";

const ICONS = {
  clipboard: ClipboardCheck,
  message: MessageSquareText,
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

interface ManageRowContentProps {
  row: ManageRow;
  chevron: boolean;
}

export function ManageRowContent({ row, chevron }: ManageRowContentProps) {
  return (
    <>
      <IconTile icon={ICONS[row.icon]} tone={ICON_TONE[row.state]} />
      <VStack gap="025" render={<span />} className="min-w-0 flex-1">
        <Text typography="subtitle1" foreground={LABEL_FOREGROUND[row.state]}>
          {row.label}
        </Text>
        <Text typography="body4" foreground={DETAIL_FOREGROUND[row.state]}>
          {row.detail}
        </Text>
      </VStack>
      {chevron && <ChevronRight size={17} className="flex-none text-hint" aria-hidden />}
    </>
  );
}
