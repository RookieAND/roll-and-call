import { Button, Callout, HStack, Text, VStack } from "@roll-and-call/ui";
import { Ban, BookOpen, CircleCheck, FileText, Mail, Shield } from "lucide-react";
import Link from "next/link";

import type { UserDetail } from "@/shared/server";
import { ActionCard } from "@/shared/ui";

import { revokeHref } from "../model/revoke-href";
import { USER_ACTION } from "../model/user-action";
import { userActionHref } from "../model/user-action-href";
import { USER_DETAIL_TAB, type UserDetailTab } from "../model/user-detail-tab";

interface UserActionsAsideProps {
  user: UserDetail;
  tab: UserDetailTab;
}

export function UserActionsAside({ user, tab }: UserActionsAsideProps) {
  const logHref = `/log?target=${encodeURIComponent(user.nickname)}`;
  return (
    <VStack
      render={<aside />}
      className="sticky top-(--rc-size-appbar) h-[calc(100dvh-var(--rc-size-appbar))] w-[288px] shrink-0 overflow-y-auto border-l border-gray-200 bg-surface"
    >
      <Text
        typography="subtitle2"
        foreground="muted"
        render={<h2 />}
        className="border-b border-(--rc-color-border-subtle) bg-gray-50 px-175 py-125"
      >
        조치
      </Text>
      <VStack gap="075" className="p-150">
        {user.sanction ? (
          <ActionCard
            icon={CircleCheck}
            tone="primary"
            title="제재 해제"
            description="남은 제재를 지금 해제합니다"
            link={
              <Link
                href={userActionHref(user.id, { tab, action: USER_ACTION.release })}
                scroll={false}
              />
            }
          />
        ) : (
          <ActionCard
            icon={Ban}
            tone="danger"
            title="제재"
            description="정해진 기간 동안 활동을 제한합니다"
            link={<Link href={`/users/${user.id}/sanction`} />}
          />
        )}
        {user.certifications.length ? (
          <ActionCard
            icon={BookOpen}
            title="룰북 인증 취소"
            description="취소한 룰북으로는 구인을 열 수 없습니다"
            link={<Link href={revokeHref(user.id)} />}
          />
        ) : null}
        <ActionCard
          icon={FileText}
          title="운영진 메모 추가"
          description="사용자에게 보이지 않는 메모를 남깁니다"
          link={
            <Link
              href={userActionHref(user.id, {
                tab: USER_DETAIL_TAB.memo,
                action: USER_ACTION.memo,
              })}
              scroll={false}
            />
          }
        />
        <ActionCard
          icon={Mail}
          title="디스코드 DM 보내기"
          description="사정을 묻거나 안내할 때 사용합니다"
          link={
            <a
              href={`https://discord.com/users/${user.discordId}`}
              target="_blank"
              rel="noreferrer"
            />
          }
        />
        <Callout.Root colorPalette="gray" size="sm" className="mt-050">
          <Callout.Icon>
            <Shield size={14} />
          </Callout.Icon>
          <Callout.Description>
            제재와 인증 취소에는 사용자에게 보여줄 사유가 필요합니다.
          </Callout.Description>
        </Callout.Root>
        <HStack justify="end">
          <Button variant="outline" colorPalette="gray" size="sm" render={<Link href={logHref} />}>
            활동 기록에서 보기
          </Button>
        </HStack>
      </VStack>
    </VStack>
  );
}
