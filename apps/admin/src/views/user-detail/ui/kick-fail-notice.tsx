import { Button } from "@roll-and-call/ui";

import { RetryBanButton } from "@/features/kick-member";
import { ConflictNotice } from "@/shared/ui";

interface KickFailNoticeProps {
  userId: string;
  nickname: string;
  guildId: string;
}

// 추방했지만 디스코드 차단만 실패한 유저. 시안의 공통 안내(Conflict)와 같은 모양이다.
export function KickFailNotice({ userId, nickname, guildId }: KickFailNoticeProps) {
  return (
    <ConflictNotice
      title="롤앤콜에서는 이탈 처리됐지만, 디스코드 차단은 실패했습니다"
      description={`${nickname}의 역할이 봇 역할보다 높습니다. 디스코드에서 직접 차단해 주세요.`}
      actions={
        <>
          <RetryBanButton userId={userId} />
          <Button
            size="sm"
            render={
              <a
                href={`https://discord.com/channels/${guildId}`}
                target="_blank"
                rel="noreferrer"
              />
            }
          >
            디스코드 열기
          </Button>
        </>
      }
    />
  );
}
