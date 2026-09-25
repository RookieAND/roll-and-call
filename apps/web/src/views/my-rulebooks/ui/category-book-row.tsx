import { Badge, Button, HStack, Text, VStack } from "@roll-and-call/ui";
import {
  Ban,
  ChevronRight,
  Circle,
  CircleAlert,
  CircleCheck,
  CirclePlus,
  Clock,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

import { RULEBOOK_KIND_LABEL, type RulebookKind } from "@/entities/rulebook";

import { BOOK_ROW, type BookRowType } from "../model/book-row";

const ROW_CLASS = "flex min-h-[60px] items-center gap-150 border-t border-gray-100 px-175 py-125";

const ROW_ICON: Record<BookRowType | "requested", { icon: LucideIcon; className: string }> = {
  certified: { icon: CircleCheck, className: "text-success-700" },
  unlocked: { icon: CircleCheck, className: "text-success-700" },
  pending: { icon: Clock, className: "text-gray-600" },
  rejected: { icon: CircleAlert, className: "text-warning-600" },
  revoked: { icon: Ban, className: "text-hint" },
  missing: { icon: Circle, className: "text-hint" },
  add: { icon: CirclePlus, className: "text-tinted-ink" },
  requested: { icon: CirclePlus, className: "text-gray-600" },
};

interface CategoryBookRowProps {
  type: BookRowType | "requested";
  title: string;
  kind: RulebookKind | null;
  meta: string;
  // 상세로 가는 줄은 href, 신청 버튼이 붙는 줄은 applyHref.
  href?: string;
  applyHref?: string;
}

// 카테고리 카드 안의 책 한 줄.
export function CategoryBookRow({
  type,
  title,
  kind,
  meta,
  href,
  applyHref,
}: CategoryBookRowProps) {
  const { icon: Icon, className } = ROW_ICON[type];
  const titleForeground = type === BOOK_ROW.missing ? "muted" : "normal";
  const metaForeground =
    type === BOOK_ROW.rejected ? "warning" : type === BOOK_ROW.unlocked ? "muted" : "hint";
  const body = (
    <>
      <Icon size={20} strokeWidth={2.1} aria-hidden className={`flex-none ${className}`} />
      <VStack gap="025" className="min-w-0 flex-1">
        <HStack align="center" gap="075" wrap>
          <Text typography="body3" weight="bold" foreground={titleForeground}>
            {title}
          </Text>
          {kind && <Badge>{RULEBOOK_KIND_LABEL[kind]}</Badge>}
        </HStack>
        <Text typography="body4" foreground={metaForeground} className="break-keep">
          {meta}
        </Text>
      </VStack>
      {applyHref && (
        <Button render={<Link href={applyHref} />} variant="tinted" size="sm" className="flex-none">
          신청
        </Button>
      )}
      {href && <ChevronRight size={16} aria-hidden className="flex-none text-hint" />}
    </>
  );
  return href ? (
    <Link href={href} className={`${ROW_CLASS} transition-colors hover:bg-gray-50`}>
      {body}
    </Link>
  ) : (
    <div className={ROW_CLASS}>{body}</div>
  );
}
