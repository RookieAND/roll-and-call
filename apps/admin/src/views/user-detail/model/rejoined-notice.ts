import { formatDate } from "@/shared/lib";

// 재가입하면 그 서버의 예전 인증과 GM 권한이 그대로 살아 있다. 인증이 없으면 가입한 날만 알린다.
export function rejoinedNotice({ at, certifiedCount }: { at: Date; certifiedCount: number }) {
  if (certifiedCount === 0) return `${formatDate(at)}에 다시 가입했습니다.`;
  return `${formatDate(at)}에 다시 가입해서 이전 룰북 인증 ${certifiedCount}개와 GM 권한이 복구되었습니다.`;
}
