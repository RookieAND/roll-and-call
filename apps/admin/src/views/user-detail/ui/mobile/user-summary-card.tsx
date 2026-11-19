import { HStack, Text, VStack } from "@roll-and-call/ui";

import type { UserDetail } from "@/entities/user/server";
import { formatFullDate, MEMBERSHIP_STATUS } from "@/shared/lib";
import { KeyValueList } from "@/shared/ui";

import { rejoinedNotice } from "../../model/rejoined-notice";
import { UserStateTag } from "../user-state-tag";

const NO_SHOW_WARNING_COUNT = 2;

interface UserSummaryCardProps {
  user: UserDetail;
  discordBanFailed: boolean;
}

export function UserSummaryCard({ user, discordBanFailed }: UserSummaryCardProps) {
  const { ban, previousNickname, leftAt } = user;
  const left = user.membership === MEMBERSHIP_STATUS.left;
  const frequentNoShow = user.recentNoShowCount >= NO_SHOW_WARNING_COUNT;
  const facts = [
    { label: "가입일", value: formatFullDate(user.joinedAt) },
    { label: "디스코드 ID", value: `@${user.discordHandle}` },
    { label: "연 세션", value: `${user.hostedCount}회` },
    { label: "참여 세션", value: `${user.playedCount}회` },
    {
      label: "최근 30일 불참",
      value: (
        <Text
          typography="body3"
          weight={frequentNoShow ? "bold" : "medium"}
          foreground={frequentNoShow ? "danger" : "normal"}
          render={<span />}
        >
          {user.recentNoShowCount}회
        </Text>
      ),
    },
    { label: "인증 룰북", value: `${user.certifications.length}개` },
  ];
  return (
    <VStack
      gap="150"
      render={<section />}
      className="rounded-600 border border-gray-200 bg-surface px-175 py-150"
    >
      <VStack gap="050">
        <HStack align="center" gap="100" wrap>
          <UserStateTag user={user} discordBanFailed={discordBanFailed} />
        </HStack>
        {ban ? (
          <Text typography="body4" foreground="danger">
            {`${formatFullDate(ban.at)}에 추방했습니다. 사유: ${ban.reason} (${ban.by})`}
          </Text>
        ) : null}
        {left && leftAt ? (
          <Text typography="body4" foreground="hint">
            {`${formatFullDate(leftAt)}에 서버를 나갔습니다. 다시 가입하면 제재와 기록이 이어집니다.`}
          </Text>
        ) : null}
        {user.rejoinedAt && !ban && !left ? (
          <Text typography="body4" foreground="hint">
            {rejoinedNotice({ at: user.rejoinedAt, certifiedCount: user.certifications.length })}
          </Text>
        ) : null}
        {previousNickname ? (
          <Text typography="body4" foreground="hint">
            {`이전 닉네임: ${previousNickname.nickname} (${formatFullDate(previousNickname.at)} 운영진이 수정)`}
          </Text>
        ) : null}
      </VStack>
      <div className="border-t border-(--rc-color-border-subtle)">
        <KeyValueList items={facts} />
      </div>
    </VStack>
  );
}
