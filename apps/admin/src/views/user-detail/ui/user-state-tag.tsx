import { MEMBERSHIP_LABEL, MEMBERSHIP_STATUS } from "@/shared/lib";
import type { UserDetail } from "@/shared/server";
import { Tag } from "@/shared/ui";

interface UserStateTagProps {
  user: UserDetail;
  discordBanFailed: boolean;
}

export function UserStateTag({ user, discordBanFailed }: UserStateTagProps) {
  if (user.membership === MEMBERSHIP_STATUS.banned) {
    return <Tag>{discordBanFailed ? "이탈 처리됨" : MEMBERSHIP_LABEL.banned}</Tag>;
  }
  if (user.sanction) return <Tag>제재 중</Tag>;
  if (user.membership === MEMBERSHIP_STATUS.left) return <Tag>{MEMBERSHIP_LABEL.left}</Tag>;
  return (
    <>
      <Tag>정상</Tag>
      {user.rejoinedAt ? <Tag>재가입</Tag> : null}
    </>
  );
}
