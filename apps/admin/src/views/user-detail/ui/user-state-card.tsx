import { Grid, HStack, Text, VStack } from "@roll-and-call/ui";
import { Ban, CircleCheck } from "lucide-react";

import { formatDate } from "@/shared/lib";
import type { UserDetail } from "@/shared/server";
import { FactRows, IconBadge, UserInitial } from "@/shared/ui";

const NO_SHOW_WARNING_COUNT = 2;

interface UserStateCardProps {
  user: UserDetail;
}

export function UserStateCard({ user }: UserStateCardProps) {
  const { sanction } = user;
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
              {sanction ? (
                <IconBadge icon={Ban} colorPalette="danger">
                  제재 중
                </IconBadge>
              ) : (
                <IconBadge icon={CircleCheck} colorPalette="success">
                  정상
                </IconBadge>
              )}
            </HStack>
            {sanction ? (
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
                label: "최근 3개월 불참",
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
