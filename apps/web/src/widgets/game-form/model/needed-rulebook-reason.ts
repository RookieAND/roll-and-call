import { formatDate } from "@/shared/lib";

// 인증이 필요한 줄 오른쪽의 짧은 이유. 안내 기간에는 적용일을, 잠긴 줄은 확인 중일 때만 적는다.
export function neededRulebookReason(
  pickable: boolean,
  pending: boolean,
  enforcementDate: Date | null,
) {
  if (pickable) return enforcementDate ? `${formatDate(enforcementDate)}부터 인증 필요` : null;
  return pending ? "확인 중" : null;
}
