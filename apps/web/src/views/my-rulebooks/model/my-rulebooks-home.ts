import { uniq } from "es-toolkit";

import { CERT_STATE, certApplyHref, setStatus, type MyRulebooks } from "@/entities/rulebook";

import { recentUnopenedSets } from "./recent-unopened-sets";
import { suspensionNotice } from "./suspension-notice";
import { toOwnedCategory } from "./to-owned-category";
import { toRequestRow } from "./to-request-row";
import { toStatusRow } from "./to-status-row";

const STATUS_ORDER = [CERT_STATE.rejected, CERT_STATE.revoked, CERT_STATE.pending] as const;
const STATUS_WORD = { rejected: "반려", revoked: "취소", pending: "심사 중" } as const;

export function myRulebooksHome(data: MyRulebooks, now: Date) {
  const { rulebooks, sets, suspended, suspendedUntil } = data;
  const inStatus = STATUS_ORDER.map((state) =>
    rulebooks.filter((rulebook) => rulebook.state === state && !rulebook.unlockedBy),
  );
  const statusRows = inStatus.flat().map((rulebook) => toStatusRow({ rulebook, now }));
  const statusSummary = STATUS_ORDER.flatMap((state, index) =>
    inStatus[index]!.length > 0 ? `${STATUS_WORD[state]} ${inStatus[index]!.length}` : [],
  ).join(" · ");
  const certified = rulebooks.filter((rulebook) => rulebook.state === CERT_STATE.certified);
  const owned = uniq(certified.map((rulebook) => rulebook.categoryId)).map((categoryId) =>
    toOwnedCategory({ categoryId, rulebooks, sets }),
  );
  const requests = data.requests.map(toRequestRow);
  const [suggested] = recentUnopenedSets(data);
  return {
    suspension: suspensionNotice({ suspended, suspendedUntil }),
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
            "인증해 두면 계속 열 수 있습니다.",
          ],
          href: certApplyHref({ rulebookIds: setStatus(suggested).missing.map((core) => core.id) }),
        }
      : null,
  };
}
