"use client";

import { Container } from "@roll-and-call/ui";
import { useParams } from "next/navigation";

import { AppBar, DESKTOP_CARD_CLASS, PageShell } from "@/shared/ui";

import { UserSessionsEmptyCard } from "./user-sessions-empty-card";

interface UserSessionsErrorProps {
  retry: () => void;
}

export function UserSessionsError({ retry }: UserSessionsErrorProps) {
  const { id } = useParams<{ id: string }>();
  return (
    <PageShell appBar={<AppBar back={`/users/${id}`} title="세션" />}>
      <div className={DESKTOP_CARD_CLASS}>
        <Container size="sm" className="desktop:max-w-none">
          <div className="py-250">
            <UserSessionsEmptyCard
              image="empty-error"
              title="세션 기록을 불러오지 못했습니다"
              description="잠시 뒤 다시 시도해 주세요."
              retry={retry}
              retryLabel="다시 시도"
            />
          </div>
        </Container>
      </div>
    </PageShell>
  );
}
