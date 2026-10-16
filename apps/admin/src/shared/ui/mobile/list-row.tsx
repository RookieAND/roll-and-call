import { HStack, Text, VStack, cn } from "@roll-and-call/ui";
import { isString } from "es-toolkit";
import type { ReactNode } from "react";

import { ServerLink } from "../server-link";

interface ListRowProps {
  // 줄 전체가 상세로 가는 링크다. 서버 안 경로를 받는다. 없으면 눌러지지 않는 줄이다(소유자 줄처럼 들어갈 곳이 없을 때).
  path?: string;
  title: ReactNode;
  // 예외일 때만 붙이는 뱃지(전자책, 재신청, 제재 중 등)
  badges?: ReactNode;
  // 오른쪽 끝의 상태 뱃지 또는 핵심 수치 하나
  trailing?: ReactNode;
  description?: ReactNode;
  meta?: ReactNode;
  muted?: boolean;
  // 카테고리 아래 하위 줄. 왼쪽에 ㄴ 모양 선을 긋고, 마지막 줄이면 선이 줄 가운데에서 끝난다.
  indent?: boolean;
  last?: boolean;
}

// 모바일 목록 한 줄: 제목 + 예외 뱃지 + 오른쪽 값, 회색 설명, 더 약한 보조 정보. 모든 줄은 말줄임 한 줄이다.
export function ListRow({
  path,
  title,
  badges,
  trailing,
  description,
  meta,
  muted,
  indent,
  last,
}: ListRowProps) {
  return (
    <VStack
      gap="050"
      render={path ? <ServerLink path={path} /> : <div />}
      className={cn(
        "relative border-b border-(--rc-color-border-subtle) bg-surface py-175 pr-200",
        indent ? "pl-11" : "pl-200",
        path && "active:bg-gray-50",
        muted && "opacity-60",
      )}
    >
      {indent ? (
        <>
          <span
            aria-hidden
            className={cn(
              "absolute top-0 left-6 w-px bg-(--rc-color-border-strong)",
              last ? "bottom-1/2" : "bottom-0",
            )}
          />
          <span
            aria-hidden
            className="absolute top-1/2 left-6 h-px w-3 bg-(--rc-color-border-strong)"
          />
        </>
      ) : null}
      <HStack align="center" gap="075" className="min-h-6 min-w-0">
        <Text typography="body2" weight="bold" truncate className="min-w-0 shrink">
          {title}
        </Text>
        {badges ? (
          <HStack gap="050" className="shrink-0">
            {badges}
          </HStack>
        ) : null}
        {trailing ? (
          <HStack align="center" className="ml-auto shrink-0">
            {isString(trailing) ? (
              <Text typography="body3" foreground="muted">
                {trailing}
              </Text>
            ) : (
              trailing
            )}
          </HStack>
        ) : null}
      </HStack>
      {description ? (
        <Text typography="body3" foreground="muted" truncate className="leading-5">
          {description}
        </Text>
      ) : null}
      {meta ? (
        <Text typography="body4" foreground="hint" truncate className="leading-[18px]">
          {meta}
        </Text>
      ) : null}
    </VStack>
  );
}
