import { Callout, Text, Tooltip, VStack } from "@roll-and-call/ui";
import { Ban, CircleCheck, Gavel, Mail, RefreshCw, User } from "lucide-react";

import { MEMBERSHIP_STATUS } from "@/shared/lib";
import type { UserDetail } from "@/shared/server";
import { ActionCard, ServerLink } from "@/shared/ui";

import { USER_ACTION, type UserAction } from "../model/user-action";
import { userActionHref } from "../model/user-action-href";
import type { UserDetailTab } from "../model/user-detail-tab";
import { UserActionsAsideFrame } from "./user-actions-aside-frame";

interface UserActionsAsideProps {
  user: UserDetail;
  tab: UserDetailTab;
  // 서버 소유자·운영진·본인이면 추방 카드를 막는 이유
  kickBlock: string | null;
}

// 유저 전체에 거는 조치만 둔다. 추방은 「서버 멤버십」 묶음으로 제재와 나눈다.
export function UserActionsAside({ user, tab, kickBlock }: UserActionsAsideProps) {
  const actionLink = (action: UserAction) => (
    <ServerLink path={userActionHref(user.id, { tab, action })} scroll={false} />
  );
  const dmCard = (
    <ActionCard
      icon={Mail}
      title="디스코드 DM 보내기"
      description="사정을 묻거나 안내할 때 사용합니다"
      link={
        <a href={`https://discord.com/users/${user.discordId}`} target="_blank" rel="noreferrer" />
      }
    />
  );

  if (user.membership === MEMBERSHIP_STATUS.banned) {
    return (
      <UserActionsAsideFrame>
        <VStack gap="075" className="p-150">
          <ActionCard
            icon={RefreshCw}
            tone="primary"
            title="차단 해제"
            description="디스코드 차단도 함께 해제합니다"
            link={actionLink(USER_ACTION.unban)}
          />
          {dmCard}
        </VStack>
      </UserActionsAsideFrame>
    );
  }

  const kickCard = (
    <ActionCard
      icon={Gavel}
      tone="danger"
      title="서버에서 추방"
      description="디스코드에서 차단해 서버에서 내보냅니다"
      link={kickBlock ? <button type="button" disabled /> : actionLink(USER_ACTION.kick)}
    />
  );
  return (
    <UserActionsAsideFrame>
      <VStack gap="075" className="p-150">
        {user.sanction ? (
          <ActionCard
            icon={CircleCheck}
            tone="primary"
            title="제재 해제"
            description="남은 제재를 지금 해제합니다"
            link={actionLink(USER_ACTION.release)}
          />
        ) : (
          <ActionCard
            icon={Ban}
            tone="danger"
            title="제재"
            description="참가 신청·구인 개설·룰북 인증 신청을 막습니다"
            link={<ServerLink path={`/users/${user.id}/sanction`} />}
          />
        )}
        <ActionCard
          icon={User}
          title="닉네임 수정"
          description="부적절한 닉네임을 운영진이 바꿉니다"
          link={actionLink(USER_ACTION.nickname)}
        />
        {dmCard}
      </VStack>
      <VStack gap="075" className="px-150 pb-150">
        <Text
          typography="body4"
          weight="bold"
          foreground="hint"
          className="border-t border-(--rc-color-border-subtle) pt-100 pb-025"
        >
          서버 멤버십
        </Text>
        {kickBlock ? (
          <Tooltip content={kickBlock}>
            <span tabIndex={0} className="block">
              {kickCard}
            </span>
          </Tooltip>
        ) : (
          kickCard
        )}
      </VStack>
      <VStack className="px-150 pb-150">
        <Callout.Root colorPalette="gray" size="sm">
          <Callout.Description>제재에는 사용자에게 보여 줄 사유가 필요합니다.</Callout.Description>
        </Callout.Root>
      </VStack>
    </UserActionsAsideFrame>
  );
}
