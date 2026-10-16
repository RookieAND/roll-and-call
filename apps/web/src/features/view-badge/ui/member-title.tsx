"use client";

import { useContext, type ComponentProps, type MouseEvent } from "react";

import { BadgePill } from "@/entities/badge";

import { MemberTitleSheetsContext } from "../model/member-title-sheets-context";
import { BadgeDetailSheet } from "./badge-detail-sheet";

interface MemberTitleProps {
  userId: string;
  size?: ComponentProps<typeof BadgePill>["size"];
}

// 닉네임 옆 대표 칭호. 누르면 그 뱃지의 상세 시트가 열린다. 명단·순위 줄은 통째로 프로필 링크라, 칭호를 눌러도 링크가 따라 열리지 않게 막는다.
export function MemberTitle({ userId, size = "xs" }: MemberTitleProps) {
  const sheet = useContext(MemberTitleSheetsContext)[userId];
  if (!sheet) return null;

  function keepOutOfLink(event: MouseEvent<HTMLSpanElement>) {
    event.stopPropagation();
    // 시트 안(포털)의 링크는 제 길로 가게 두고, 칭호 버튼을 누른 클릭만 바깥 링크 이동을 막는다.
    if (event.currentTarget.contains(event.target as Node)) event.preventDefault();
  }

  return (
    <span className="inline-flex min-w-0 shrink-0" onClick={keepOutOfLink}>
      <BadgeDetailSheet detail={sheet.detail} className="inline-flex min-w-0 items-center">
        <BadgePill size={size} emoji={sheet.emoji} name={sheet.name} look={sheet.look} />
      </BadgeDetailSheet>
    </span>
  );
}
