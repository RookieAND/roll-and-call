"use client";

import { HStack, Text, Tooltip } from "@roll-and-call/ui";
import { Link2 } from "lucide-react";

import {
  linkHref,
  linkLabel,
  linkServiceOf,
  type LinkServiceKey,
  type ProfileLink,
} from "../model/link-services";
import { BrandMark } from "./brand-mark";

const ICON_CLASS =
  "flex h-11 w-11 items-center justify-center rounded-500 border border-gray-200 text-gray-900";

interface ProfileLinksProps {
  links: readonly ProfileLink[];
}

// 내 화면이든 남의 화면이든 44px 아이콘 한 줄. 이름은 Tooltip으로 보인다.
// 클라이언트 컴포넌트다: 서버에서 만든 요소를 Tooltip(render 복제)에 넘기면 lazy 참조라 undefined가 된다.
export function ProfileLinks({ links }: ProfileLinksProps) {
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
        const href = linkHref(link);
        const service = linkServiceOf(link.service).key as LinkServiceKey;
        const mark = <BrandMark service={service} />;

        return href ? (
          // 같은 서비스를 둘 이상 적을 수 있어 순서를 키에 같이 쓴다.
          <Tooltip key={`${link.service}-${index}`} content={label}>
            <a
              href={href}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={label}
              className={`${ICON_CLASS} transition-colors hover:bg-gray-50`}
            >
              {mark}
            </a>
          </Tooltip>
        ) : (
          <Tooltip key={`${link.service}-${index}`} content={label}>
            <span aria-label={label} tabIndex={0} className={ICON_CLASS}>
              {mark}
            </span>
          </Tooltip>
        );
      })}
    </HStack>
  );
}
