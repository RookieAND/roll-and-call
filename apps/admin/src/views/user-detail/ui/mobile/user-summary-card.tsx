import { Grid, HStack, Text, VStack } from "@roll-and-call/ui";

import type { UserDetail } from "@/entities/user/server";
import { formatDate, MEMBERSHIP_STATUS } from "@/shared/lib";

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
    { label: "연 세션", value: `${user.hostedCount}회` },
    { label: "참여 세션", value: `${user.playedCount}회` },
    { label: "인증 룰북", value: `${user.certifications.length}개` },
    { label: "30일 불참", value: `${user.recentNoShowCount}회`, danger: frequentNoShow },
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
          <Text typography="body4" foreground="hint">
            가입 {formatDate(user.joinedAt)}
          </Text>
        </HStack>
        {ban ? (
          <Text typography="body4" foreground="danger">
            {`${formatDate(ban.at)}에 추방했습니다. 사유: ${ban.reason} (${ban.by})`}
          </Text>
        ) : null}
        {left && leftAt ? (
          <Text typography="body4" foreground="hint">
            {`${formatDate(leftAt)}에 서버를 나갔습니다. 다시 가입하면 제재와 기록이 이어집니다.`}
          </Text>
        ) : null}
        {user.rejoinedAt && !ban && !left ? (
          <Text typography="body4" foreground="hint">
            {rejoinedNotice({ at: user.rejoinedAt, certifiedCount: user.certifications.length })}
          </Text>
        ) : null}
        {previousNickname ? (
          <Text typography="body4" foreground="hint">
            {`이전 닉네임: ${previousNickname.nickname} (${formatDate(previousNickname.at)} 운영진이 수정)`}
          </Text>
        ) : null}
      </VStack>
      <Grid
        render={<dl />}
        className="m-0 grid-cols-4 gap-100 border-t border-(--rc-color-border-subtle) pt-150"
      >
        {facts.map((fact) => (
          <VStack key={fact.label} gap="025" className="min-w-0">
            <Text typography="body4" foreground="hint" render={<dt />}>
              {fact.label}
            </Text>
            {/* 시안은 값이 라벨 위다. 읽는 순서는 라벨 → 값으로 둔다. */}
            <Text
              typography="subtitle1"
              weight="bold"
              foreground={fact.danger ? "danger" : "normal"}
              render={<dd />}
              className="m-0 -order-1"
            >
              {fact.value}
            </Text>
          </VStack>
        ))}
      </Grid>
    </VStack>
  );
}
