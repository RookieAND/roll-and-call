import { Badge, HStack, Text, VStack } from "@roll-and-call/ui";
import { cva } from "class-variance-authority";
import { BookOpen, ChevronRight, CircleAlert, CircleCheck, Clock } from "lucide-react";
import Link from "next/link";

import type { ListRow } from "../model/list-row";

const ROW_ICON = { check: CircleCheck, alert: CircleAlert, clock: Clock, book: BookOpen } as const;

const icon = cva("flex-none", {
  variants: {
    tone: {
      success: "text-success-700",
      warning: "text-warning-600",
      gray: "text-gray-600",
      primary: "text-tinted-ink",
      danger: "text-danger-600",
    },
  },
});

const ROW_CLASS =
  "flex min-h-[60px] items-center gap-150 border-t border-gray-100 px-175 py-125 first:border-t-0";

interface ListRowItemProps {
  row: ListRow;
}

// 카드 안의 한 줄. 상세나 신청으로 가는 줄은 줄 전체가 링크다.
export function ListRowItem({ row }: ListRowItemProps) {
  const Icon = row.icon ? ROW_ICON[row.icon] : null;
  const body = (
    <>
      {Icon && (
        <Icon size={20} strokeWidth={2.1} aria-hidden className={icon({ tone: row.tone })} />
      )}
      <VStack gap="025" className="min-w-0 flex-1">
        <HStack align="center" gap="100">
          {row.fresh && (
            <span
              role="img"
              aria-label="새 결과"
              className="size-[7px] flex-none rounded-full bg-primary-500"
            />
          )}
          <Text typography="body2" weight="bold" className="break-keep">
            {row.title}
          </Text>
        </HStack>
        {row.sub && (
          <Text typography="body4" foreground={row.subTone ?? "muted"} className="break-keep">
            {row.sub}
          </Text>
        )}
      </VStack>
      {row.badge && (
        <Badge colorPalette={row.badge.palette} className="flex-none">
          {row.badge.label}
        </Badge>
      )}
      {row.href && <ChevronRight size={16} aria-hidden className="flex-none text-hint" />}
    </>
  );
  return row.href ? (
    <Link href={row.href} className={`${ROW_CLASS} transition-colors hover:bg-gray-50`}>
      {body}
    </Link>
  ) : (
    <div className={ROW_CLASS}>{body}</div>
  );
}
