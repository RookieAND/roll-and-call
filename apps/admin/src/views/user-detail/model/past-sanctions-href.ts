import { withQuery } from "@/shared/lib";

// 이 유저로 거르고 조치 「제재」만 남긴 활동 기록. A7이 auditLogHref로 바꾼다.
export function pastSanctionsHref(nickname: string) {
  return withQuery("/log", {}, { target: nickname, actions: "제재" });
}
