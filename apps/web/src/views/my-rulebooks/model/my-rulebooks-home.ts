import {
  certApplyHref,
  isCertEnforced,
  RULEBOOK_KIND,
  SET_STATUS,
  setStatus,
  type MyRulebooks,
} from "@/entities/rulebook";
import { ddayKst, formatDate } from "@/shared/lib";

import { nextTodos } from "./next-todos";
import { recentUnopenedSets } from "./recent-unopened-sets";
import { toExtraRow } from "./to-extra-row";
import { toRequestRow } from "./to-request-row";
import { toSetRow } from "./to-set-row";

const ROW_ORDER = ["warning", "danger", "primary", "gray", "success"];

// 내 룰북 화면 한 장. 판본별 GM 자격은 손볼 것(반려·취소) → 남은 책 → 심사 중 → GM 가능 순.
export function myRulebooksHome(data: MyRulebooks, now: Date) {
  const { rulebooks, sets, enforcementDate, suspended, suspendedUntil } = data;
  const rows = sets
    .flatMap((set) => toSetRow(set, rulebooks, now) ?? [])
    .toSorted((left, right) => ROW_ORDER.indexOf(left.tone) - ROW_ORDER.indexOf(right.tone));
  const extras = rulebooks
    .filter((rulebook) => rulebook.kind !== RULEBOOK_KIND.core && rulebook.state)
    .map((rulebook) => toExtraRow(rulebook, now));
  const requests = data.requests.map(toRequestRow);
  const count = (status: string) => sets.filter((set) => setStatus(set).status === status).length;
  const ready = sets.filter((set) => set.earned).length;
  const pending = count(SET_STATUS.pending);
  const summary = [ready && `GM 가능 ${ready}`, pending && `심사 중 ${pending}`]
    .filter(Boolean)
    .join(" · ");
  const dday =
    enforcementDate && !isCertEnforced(enforcementDate, now) ? ddayKst(enforcementDate, now) : null;
  const [suggested] = recentUnopenedSets(data);
  return {
    banner:
      dday !== null && !suspended
        ? {
            text: `${formatDate(enforcementDate!)}부터 인증한 GM만 구인을 열 수 있습니다.`,
            dday: dday === 0 ? "D-DAY" : `D-${dday}`,
          }
        : null,
    suspension: suspended
      ? suspendedUntil
        ? `정지는 ${formatDate(suspendedUntil)}에 풀립니다.`
        : "정지가 풀리면 다시 신청할 수 있습니다."
      : null,
    todos: suspended ? [] : nextTodos(data, now),
    summary,
    rows,
    extras,
    requests,
    empty: rows.length === 0 && extras.length === 0 && requests.length === 0,
    suggestion: suggested
      ? {
          lines: [
            `최근에 ${suggested.label} 구인을 열었습니다.`,
            dday !== null
              ? `${formatDate(enforcementDate!)} 전에 인증해 두세요.`
              : "인증해 두면 계속 열 수 있습니다.",
          ],
          button: `${suggested.edition || suggested.categoryName} 인증 신청하기`,
          href: certApplyHref(setStatus(suggested).missing.map((core) => core.id)),
        }
      : null,
  };
}
