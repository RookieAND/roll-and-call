import { Text, cn } from "@trpg/ui";
import { Check, ChevronRight, Clock, Pencil, Users } from "lucide-react";
import Link from "next/link";

import type { ManageRow as Row } from "../model/manage-rows";

const ICONS = { clock: Clock, check: Check, users: Users, pencil: Pencil };

const DETAIL_CLASS = {
  normal: "text-gray-600",
  warning: "text-warning-600",
  success: "text-success-700",
};

export function ManageRow({ row }: { row: Row }) {
  const Icon = ICONS[row.icon];
  const iconClass =
    row.tone === "success" ? "bg-success-50 text-success-700" : "bg-primary-50 text-primary-ink";

  return (
    <Link
      href={row.href}
      className="flex min-h-[60px] items-center gap-3 border-gray-100 px-3.5 py-3 transition-colors not-first:border-t hover:bg-gray-50"
    >
      <span
        className={cn(
          "flex h-[34px] w-[34px] flex-none items-center justify-center rounded-400",
          iconClass,
        )}
      >
        <Icon size={18} aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <Text typography="subtitle1" className="block">
          {row.label}
        </Text>
        <Text typography="body3" className={cn("mt-0.5 block", DETAIL_CLASS[row.tone])}>
          {row.detail}
        </Text>
      </div>
      {row.blocked && (
        <span
          aria-label="지금 막혀 있습니다"
          className="h-[7px] w-[7px] flex-none rounded-full bg-danger-solid"
        />
      )}
      <ChevronRight size={17} className="flex-none text-gray-400" aria-hidden />
    </Link>
  );
}
