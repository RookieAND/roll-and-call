import { Grid, HStack, Text, VStack } from "@roll-and-call/ui";

import { formatDate, withSubjectParticle } from "@/shared/lib";
import type { UserDetail } from "@/shared/server";
import { FactRows, UserInitial } from "@/shared/ui";

import { rejoinedNotice } from "../model/rejoined-notice";
import { UserStateTag } from "./user-state-tag";

const NO_SHOW_WARNING_COUNT = 2;

interface UserStateCardProps {
  user: UserDetail;
  // 추방했는데 디스코드 차단만 실패한 상태(이탈 처리됨)
  discordBanFailed: boolean;
}

export function UserStateCard({ user, discordBanFailed }: UserStateCardProps) {
  const { sanction, ban, previousNickname } = user;
  const sanctionPeriod = sanction?.until ? `${formatDate(sanction.until)}까지` : "해제될 때까지";
  const noShowForeground = user.recentNoShowCount >= NO_SHOW_WARNING_COUNT ? "danger" : "normal";
  return (
    <div className="p-200 pb-150">
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
            {ban && !discordBanFailed ? (
              <Text typography="body4" foreground="danger">
                {`${formatDate(ban.at)}에 ${withSubjectParticle(ban.by)} 서버에서 추방했습니다. 디스코드에서도 차단된 상태입니다.`}
              </Text>
            ) : null}
            {user.rejoinedAt && !ban ? (
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
            {sanction && !ban ? (
              <Text typography="body4" foreground="danger">
                {sanctionPeriod} 모든 활동(참가·대기 신청, 구인 개설)을 할 수 없습니다.
              </Text>
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
            labelWidth={100}
            items={[
              {
                label: "최근 30일 불참",
                value: (
                  <Text typography="body3" weight="medium" foreground={noShowForeground}>
                    {user.recentNoShowCount}회
                  </Text>
                ),
              },
              { label: "인증 룰북", value: `${user.certifications.length}개` },
            ]}
          />
        </Grid>
      </section>
    </div>
  );
}
