"use client";

import { Button } from "@roll-and-call/ui";
import { ScrollText } from "lucide-react";

import type { AuditSubjectKind } from "@/entities/audit";
import { MoreMenu, ServerLink } from "@/shared/ui";

import { SUBJECT_OPEN_ITEM } from "../model/subject-open-item";

interface EntryMoreMenuProps {
  subjectKind: AuditSubjectKind;
  openPath?: string;
  sameTargetHref: string;
}

export function EntryMoreMenu({ subjectKind, openPath, sameTargetHref }: EntryMoreMenuProps) {
  const openItem = SUBJECT_OPEN_ITEM[subjectKind];
  if (!(openItem && openPath)) {
    return (
      <Button
        variant="outline"
        colorPalette="gray"
        size="sm"
        render={<ServerLink path={sameTargetHref} />}
      >
        <ScrollText size={14} aria-hidden />
        같은 대상의 조치 보기
      </Button>
    );
  }
  return (
    <MoreMenu
      label="더 보기"
      items={[
        { ...openItem, href: openPath },
        { label: "같은 대상의 조치 보기", icon: ScrollText, href: sameTargetHref },
      ]}
    />
  );
}
