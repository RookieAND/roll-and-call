import { MEMBERSHIP_LABEL, MEMBERSHIP_STATUS } from "@/shared/lib";
import type { UserDetail } from "@/shared/server";
import { Tag } from "@/shared/ui";

interface UserStateTagProps {
  user: UserDetail;
  discordBanFailed: boolean;
}

// 제재 중이면 배지를 두지 않는다. 위쪽 빨간 안내가 알린다(D294(7), D295(4)).
export function UserStateTag({ user, discordBanFailed }: UserStateTagProps) {
  if (user.membership === MEMBERSHIP_STATUS.banned) {
    return <Tag>{discordBanFailed ? "이탈 처리됨" : MEMBERSHIP_LABEL.banned}</Tag>;
  }
  if (user.membership === MEMBERSHIP_STATUS.left) return <Tag>{MEMBERSHIP_LABEL.left}</Tag>;
  if (user.sanction) return null;
  return (
    <>
      <Tag>정상</Tag>
      {user.rejoinedAt ? <Tag>재가입</Tag> : null}
    </>
  );
}
