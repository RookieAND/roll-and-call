import {
  CERT_STATE,
  certApplyHref,
  isCertEnforced,
  setStatus,
  type MyRulebooks,
} from "@/entities/rulebook";
import { ddayKst, formatDate } from "@/shared/lib";

import { recentUnopenedSets } from "./recent-unopened-sets";
import { toOwnedCategory } from "./to-owned-category";
import { toRequestRow } from "./to-request-row";
import { toStatusRow } from "./to-status-row";

const STATUS_ORDER = [CERT_STATE.rejected, CERT_STATE.revoked, CERT_STATE.pending] as const;
const STATUS_WORD = { rejected: "반려", revoked: "취소", pending: "심사 중" } as const;

// 내 룰북 화면 한 장. 인증 현황(반려 → 취소 → 심사 중) → 인증한 룰북(카테고리별) → 추가 요청.
export function myRulebooksHome(data: MyRulebooks, now: Date) {
  const { rulebooks, sets, enforcementDate, suspended, suspendedUntil } = data;
  const inStatus = STATUS_ORDER.map((state) =>
    rulebooks.filter((rulebook) => rulebook.state === state && !rulebook.unlockedBy),
  );
  const statusRows = inStatus.flat().map((rulebook) => toStatusRow({ rulebook, now }));
  const statusSummary = STATUS_ORDER.flatMap((state, index) =>
    inStatus[index]!.length > 0 ? `${STATUS_WORD[state]} ${inStatus[index]!.length}` : [],
  ).join(" · ");
  const certified = rulebooks.filter((rulebook) => rulebook.state === CERT_STATE.certified);
  const owned = [...new Set(certified.map((rulebook) => rulebook.categoryId))].map((categoryId) =>
    toOwnedCategory({ categoryId, rulebooks, sets }),
  );
  const requests = data.requests.map(toRequestRow);
  const dday =
    enforcementDate && !isCertEnforced(enforcementDate, now) ? ddayKst(enforcementDate, now) : null;
  const [suggested] = recentUnopenedSets(data);
  return {
    banner:
      dday !== null && !suspended
        ? {
            title: `${formatDate(enforcementDate!)}부터 룰북 인증이 필요합니다`,
            dday: dday === 0 ? "D-DAY" : `D-${dday}`,
          }
        : null,
    suspension: suspended
      ? suspendedUntil
        ? `활동 정지는 ${formatDate(suspendedUntil)}에 해제됩니다.`
        : "정지가 풀리면 다시 신청할 수 있습니다."
      : null,
    statusRows,
    statusSummary,
    owned,
    ownedSummary: `${certified.length}권`,
    requests,
    empty: statusRows.length === 0 && owned.length === 0 && requests.length === 0,
    suggestion: suggested
      ? {
          lines: [
            `최근에 ${suggested.label} 구인을 열었습니다.`,
            dday !== null
              ? `${formatDate(enforcementDate!)} 전에 인증해 두세요.`
              : "인증해 두면 계속 열 수 있습니다.",
          ],
          href: certApplyHref(setStatus(suggested).missing.map((core) => core.id)),
        }
      : null,
  };
}
