import { withQuery } from "./with-query";

interface AuditLogHrefOptions {
  targetUserId?: string;
  targetGameId?: string;
  target?: string;
}

// 대상의 활동 기록 주소. ID가 있으면 ID로 거르고(닉네임·제목이 바뀌어도 옛 기록까지), ID가 없는 대상만 이름으로 거른다.
export function auditLogHref({ targetUserId, targetGameId, target }: AuditLogHrefOptions) {
  const byId = Boolean(targetUserId || targetGameId);
  return withQuery(
    "/log",
    {},
    { targetUser: targetUserId, targetGame: targetGameId, target: byId ? undefined : target },
  );
}
