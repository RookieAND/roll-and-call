"use client";

import { Sheet, Text } from "@roll-and-call/ui";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

import { ProfileRow } from "@/entities/profile";
import { ServerLink } from "@/shared/ui";

import type { RecordRow } from "../model/rank-people";

interface HomeRecordTieSheetProps {
  label: string;
  leaders: RecordRow[];
  className: string;
  children: ReactNode;
}

export function HomeRecordTieSheet({
  label,
  leaders,
  className,
  children,
}: HomeRecordTieSheetProps) {
  const sortedLeaders = leaders.toSorted((left, right) =>
    left.person.username.localeCompare(right.person.username, "ko"),
  );

  return (
    <Sheet.Root>
      <Sheet.Trigger aria-label={`공동 1위 ${leaders.length}명 보기`} className={className}>
        {children}
      </Sheet.Trigger>
      <Sheet.Popup>
        <Sheet.Handle />
        <Sheet.Title className="mb-075 text-heading3">{label} · 공동 1위</Sheet.Title>
        <Sheet.Body>
          {sortedLeaders.map(({ person, score }) => (
            <Sheet.Item
              key={person.id}
              render={<ServerLink path={`/users/${person.id}`} />}
              className="min-h-14 justify-start gap-150 px-100"
            >
              <ProfileRow name={person.username} avatarUrl={person.avatarUrl} />
              <Text
                typography="subtitle2"
                weight="extrabold"
                foreground="primary"
                numeric
                className="flex-none"
              >
                {score}점
              </Text>
              <ChevronRight size={16} aria-hidden className="flex-none text-hint" />
            </Sheet.Item>
          ))}
        </Sheet.Body>
      </Sheet.Popup>
    </Sheet.Root>
  );
}
