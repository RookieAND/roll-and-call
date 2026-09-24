import { Text } from "@roll-and-call/ui";
import { Ban, CircleCheck } from "lucide-react";

import { formatDate, formatMonthDay } from "@/shared/lib";
import type { UserDetail } from "@/shared/server";
import { EntityHead, IconBadge, UserInitial } from "@/shared/ui";

const NO_SHOW_WARNING_COUNT = 2;

interface UserStateCardProps {
  user: UserDetail;
}

export function UserStateCard({ user }: UserStateCardProps) {
  const { sanction } = user;
  const sanctionPeriod = sanction?.until
    ? `${formatMonthDay(sanction.until)}까지`
    : "해제될 때까지";
  return (
    <div className="p-200 pb-150">
      <EntityHead
        title={user.nickname}
        lead={<UserInitial nickname={user.nickname} />}
        badges={
          sanction ? (
            <IconBadge icon={Ban} colorPalette="danger">
              제재 중
            </IconBadge>
          ) : (
            <IconBadge icon={CircleCheck} colorPalette="success">
              정상
            </IconBadge>
          )
        }
        meta={`${formatDate(user.joinedAt)} 가입 · 디스코드 @${user.discordHandle}`}
        description={
          sanction ? (
            <Text typography="body4" foreground="danger" className="mt-025">
              {sanctionPeriod} 모든 활동(참가·대기 신청, 구인 개설)을 할 수 없습니다.
            </Text>
          ) : null
        }
        facts={[
          { label: "연 세션", value: `${user.hostedCount}회` },
          { label: "참여 세션", value: `${user.playedCount}회` },
          {
            label: "최근 3개월 불참",
            value: `${user.recentNoShowCount}회`,
            danger: user.recentNoShowCount >= NO_SHOW_WARNING_COUNT,
          },
          { label: "인증 룰북", value: `${user.certifications.length}개` },
        ]}
      />
    </div>
  );
}
