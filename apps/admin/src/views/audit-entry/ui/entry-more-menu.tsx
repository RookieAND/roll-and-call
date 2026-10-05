"use client";

import { ScrollText } from "lucide-react";

import type { AuditSubjectKind } from "@/shared/server";
import { MoreMenu } from "@/shared/ui";

import { SUBJECT_OPEN_ITEM } from "../model/subject-open-item";

interface EntryMoreMenuProps {
  subjectKind: AuditSubjectKind;
  openPath?: string;
  sameTargetHref: string;
}

export function EntryMoreMenu({ subjectKind, openPath, sameTargetHref }: EntryMoreMenuProps) {
  const openItem = SUBJECT_OPEN_ITEM[subjectKind];
  return (
    <MoreMenu
      label="더 보기"
      items={[
        ...(openItem && openPath ? [{ ...openItem, href: openPath }] : []),
        { label: "같은 대상의 조치 보기", icon: ScrollText, href: sameTargetHref },
      ]}
    />
  );
}
