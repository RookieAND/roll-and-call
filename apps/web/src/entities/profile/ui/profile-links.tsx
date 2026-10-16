"use client";

import { HStack, Text, Tooltip, cn } from "@roll-and-call/ui";
import { Link2 } from "lucide-react";

import { ACCENT_TINT_HOVER, ACCENT_TINT_TEXT } from "../model/accent-tint";
import { linkHref, linkLabel, linkServiceOf, type ProfileLink } from "../model/link-services";
import { BrandMark } from "./brand-mark";

const ICON_CLASS = {
  square: "flex h-10 w-10 items-center justify-center rounded-full text-muted",
  // 마이페이지: 테두리 없이 강조색 아이콘만
  circle: cn("flex h-10 w-10 items-center justify-center rounded-full", ACCENT_TINT_TEXT),
} as const;

interface ProfileLinksProps {
  links: readonly ProfileLink[];
  discordId?: string;
  variant?: keyof typeof ICON_CLASS;
}

// 클라이언트 컴포넌트다: 서버에서 만든 요소를 Tooltip(render 복제)에 넘기면 lazy 참조라 undefined가 된다.
export function ProfileLinks({ links, discordId, variant = "square" }: ProfileLinksProps) {
  if (links.length === 0) {
    return (
      <HStack
        align="center"
        gap="125"
        className="min-h-11 rounded-400 border border-dashed border-gray-300 px-150"
      >
        <Link2 size={16} className="flex-none text-hint" aria-hidden />
        <Text typography="body4" foreground="hint" className="min-w-0 flex-1">
          등록한 링크가 없습니다
        </Text>
      </HStack>
    );
  }

  return (
    <HStack gap="100" wrap>
      {links.map((link, index) => {
        const label = linkLabel(link);
        const href = linkHref(link, discordId);
        const service = linkServiceOf(link.service).key;
        const mark = <BrandMark service={service} size={24} />;

        return href ? (
          // 같은 서비스를 둘 이상 적을 수 있어 순서를 키에 같이 쓴다.
          <Tooltip key={`${link.service}-${index}`} content={label}>
            <a
              href={href}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={label}
              className={cn(
                ICON_CLASS[variant],
                "transition-colors",
                variant === "circle" ? ACCENT_TINT_HOVER : "hover:bg-gray-50",
              )}
            >
              {mark}
            </a>
          </Tooltip>
        ) : (
          <Tooltip key={`${link.service}-${index}`} content={label}>
            <span role="img" aria-label={label} tabIndex={0} className={ICON_CLASS[variant]}>
              {mark}
            </span>
          </Tooltip>
        );
      })}
    </HStack>
  );
}
