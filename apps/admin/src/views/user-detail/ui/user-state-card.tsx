import { Grid, HStack, Text, VStack } from "@roll-and-call/ui";

import { formatDate, MEMBERSHIP_STATUS } from "@/shared/lib";
import type { UserDetail } from "@/shared/server";
import { FactRows, UserInitial } from "@/shared/ui";

import { rejoinedNotice } from "../model/rejoined-notice";
import { PastSanctionsLink } from "./past-sanctions-link";
import { SanctionCallout } from "./sanction-callout";
import { UserStateTag } from "./user-state-tag";

const NO_SHOW_WARNING_COUNT = 2;

interface UserStateCardProps {
  user: UserDetail;
  // 추방했는데 디스코드 차단만 실패한 상태(이탈 처리됨)
  discordBanFailed: boolean;
}

export function UserStateCard({ user, discordBanFailed }: UserStateCardProps) {
  const { sanction, ban, previousNickname, leftAt } = user;
  const left = user.membership === MEMBERSHIP_STATUS.left;
  const noShowForeground = user.recentNoShowCount >= NO_SHOW_WARNING_COUNT ? "danger" : "normal";
  const showPastSanctions = !sanction && user.pastSanctionCount > 0;
  return (
    <VStack gap="150" className="p-200 pb-150">
      {sanction ? (
        <SanctionCallout
          sanction={sanction}
          nickname={user.nickname}
          pastSanctionCount={user.pastSanctionCount}
        />
      ) : null}
      <section className="rounded-600 border border-gray-200 bg-surface">
        <HStack align="center" gap="150" className="px-200 py-175">
          <UserInitial nickname={user.nickname} />
          <VStack gap="050" className="min-w-0 flex-1">
            <HStack align="center" gap="100" wrap>
              <Text typography="heading3" render={<h2 />}>
                {user.nickname}
              </Text>
              <UserStateTag user={user} discordBanFailed={discordBanFailed} />
            </HStack>
            {ban ? (
              <Text typography="body4" foreground="danger">
                {`${formatDate(ban.at)}에 추방했습니다.`}
                <br />
                {`사유: ${ban.reason} (${ban.by})`}
              </Text>
            ) : null}
            {left && leftAt ? (
              <Text typography="body4" foreground="hint">
                {`${formatDate(leftAt)}에 서버를 나갔습니다.`}
                <br />
                다시 가입하면 제재와 기록이 이어집니다.
              </Text>
            ) : null}
            {user.rejoinedAt && !ban && !left ? (
              <Text typography="body4" foreground="hint">
                {rejoinedNotice({
                  at: user.rejoinedAt,
                  certifiedCount: user.certifications.length,
                })}
              </Text>
            ) : null}
            {previousNickname ? (
              <Text typography="body4" foreground="hint">
                {`이전 닉네임: ${previousNickname.nickname} (${formatDate(previousNickname.at)} 운영진이 수정)`}
              </Text>
            ) : null}
            {showPastSanctions ? (
              <PastSanctionsLink nickname={user.nickname} count={user.pastSanctionCount} />
            ) : null}
          </VStack>
        </HStack>
        <Grid className="grid-cols-3 items-start gap-x-300 border-t border-(--rc-color-border-subtle) px-200 py-100">
          <FactRows
            labelWidth={72}
            items={[
              { label: "가입일", value: formatDate(user.joinedAt) },
              { label: "디스코드 ID", value: `@${user.discordHandle}` },
            ]}
          />
          <FactRows
            labelWidth={72}
            items={[
              { label: "연 세션", value: `${user.hostedCount}회` },
              { label: "참여 세션", value: `${user.playedCount}회` },
            ]}
          />
          <FactRows
            labelWidth={104}
            items={[
              {
                label: "최근 30일 불참",
                value: (
                  <Text
                    typography="body3"
                    weight={noShowForeground === "danger" ? "bold" : "medium"}
                    foreground={noShowForeground}
                  >
                    {user.recentNoShowCount}회
                  </Text>
                ),
              },
              { label: "인증 룰북", value: `${user.certifications.length}개` },
            ]}
          />
        </Grid>
      </section>
    </VStack>
  );
}
