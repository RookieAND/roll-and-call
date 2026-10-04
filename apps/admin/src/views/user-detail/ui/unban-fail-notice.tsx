import { Button } from "@roll-and-call/ui";

import { RetryUnbanButton } from "@/features/unban-member";
import { ConflictNotice } from "@/shared/ui";

interface UnbanFailNoticeProps {
  userId: string;
  guildId: string;
}

// 롤앤콜에서는 차단을 풀었지만 디스코드 해제만 실패한 유저. 추방 실패 안내와 같은 모양이다.
export function UnbanFailNotice({ userId, guildId }: UnbanFailNoticeProps) {
  return (
    <ConflictNotice
      title="롤앤콜에서는 차단을 해제했지만, 디스코드 차단 해제는 실패했습니다"
      description="디스코드에서 직접 해제해 주세요."
      actions={
        <>
          <RetryUnbanButton userId={userId} />
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
