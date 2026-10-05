"use client";

import { Flag } from "lucide-react";

import { withQuery } from "@/shared/lib";
import { MoreMenu } from "@/shared/ui";

interface NoShowRowMenuProps {
  recordId: string;
}

export function NoShowRowMenu({ recordId }: NoShowRowMenuProps) {
  return (
    <MoreMenu
      label="더 보기"
      widthClassName="w-[160px]"
      items={[
        { label: "기록 열기", icon: Flag, href: withQuery("/noshow", {}, { record: recordId }) },
      ]}
    />
  );
}
