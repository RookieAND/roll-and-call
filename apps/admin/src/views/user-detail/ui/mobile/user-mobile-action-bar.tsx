import { Button, HStack, Text } from "@roll-and-call/ui";

import { auditLogHref } from "@/entities/audit";
import type { UserDetail } from "@/entities/user/server";
import { MEMBERSHIP_STATUS } from "@/shared/lib";
import { MobileActionBar, MobileMoreSheet, ServerLink } from "@/shared/ui";

import { USER_ACTION, type UserAction } from "../../model/user-action";
import { userActionHref } from "../../model/user-action-href";
import type { UserDetailTab } from "../../model/user-detail-tab";

interface UserMobileActionBarProps {
  user: UserDetail;
  tab: UserDetailTab;
  kickBlock: string | null;
}

// 데스크톱 조치 칸을 아래 고정 바로 옮긴다. 주 조치 하나 + [⋯] 시트(닉네임 수정, 추방).
export function UserMobileActionBar({ user, tab, kickBlock }: UserMobileActionBarProps) {
  const actionLink = (action: UserAction) => (
    <ServerLink path={userActionHref(user.id, { tab, action })} scroll={false} />
  );
  if (user.membership === MEMBERSHIP_STATUS.banned) {
    return (
      <MobileActionBar elevated={false}>
        <Button size="lg" render={actionLink(USER_ACTION.unban)}>
          차단 해제
        </Button>
      </MobileActionBar>
    );
  }
  const primary = user.sanction ? (
    <Button size="lg" render={actionLink(USER_ACTION.release)} className="flex-1">
      제재 해제
    </Button>
  ) : (
    <Button
      variant="outline"
      colorPalette="danger"
      size="lg"
      render={<ServerLink path={`/users/${user.id}/sanction`} />}
      className="flex-1"
    >
      제재하기
    </Button>
  );
  return (
    <MobileActionBar elevated={false}>
      <HStack gap="100">
        {primary}
        <MobileMoreSheet title={user.nickname}>
          <Button
            variant="outline"
            size="lg"
            render={<ServerLink path={auditLogHref({ targetUserId: user.id })} />}
          >
            활동 기록에서 보기
          </Button>
          <Button variant="outline" size="lg" render={actionLink(USER_ACTION.nickname)}>
            닉네임 수정
          </Button>
          {kickBlock ? (
            <>
              <Text typography="body4" foreground="hint">
                {kickBlock}
              </Text>
              <Button variant="outline" colorPalette="danger" size="lg" disabled>
                서버에서 추방
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              colorPalette="danger"
              size="lg"
              render={actionLink(USER_ACTION.kick)}
            >
              서버에서 추방
            </Button>
          )}
        </MobileMoreSheet>
      </HStack>
    </MobileActionBar>
  );
}
