import type { CertApplication } from "@roll-and-call/database";
import type { RulebookRecords } from "@roll-and-call/database/certifications";

import { CERT_STATE, type CertState } from "./cert-state";
import { deriveCertState } from "./derive-cert-state";
import { editionSetKey, editionSets } from "./edition-sets";
import { isOpened } from "./is-opened";
import { rejectionSummary } from "./rejection-summary";
import { RULEBOOK_KIND, type RulebookKind } from "./rulebook-kind";
import { rulebookLabel } from "./rulebook-label";

export interface MyRulebook {
  id: string;
  name: string;
  edition: string;
  aliases: string[];
  label: string;
  shortName: string;
  certRequired: boolean;
  kind: RulebookKind;
  categoryId: string;
  categoryName: string;
  supersedesId: string | null;
  state: CertState | null;
  stateAt: Date | null;
  latestApplication: CertApplication | null;
  // 반려 한 줄 요약. 반려로 돌린 옛 취소 기록은 신청 대신 인증 행의 사유를 쓴다.
  rejection: string | null;
  unlockedBy: MyRulebook | null;
}

function shortNameOf({ name, categoryName }: { name: string; categoryName: string }) {
  return name.startsWith(`${categoryName} `) ? name.slice(categoryName.length + 1) : name;
}

// 신청 기록은 최신순으로 들어온다.
export function toMyRulebooks(records: RulebookRecords) {
  const rulebooks: MyRulebook[] = records.catalog.map((rulebook) => {
    const certification = records.certificationRows.find((row) => row.rulebookId === rulebook.id);
    const latestApplication =
      records.applicationRows.find((row) => row.rulebookId === rulebook.id) ?? null;
    const derived = deriveCertState({
      certification,
      latestApplication: latestApplication ?? undefined,
    });
    return {
      ...rulebook,
      label: rulebookLabel(rulebook),
      shortName: shortNameOf({ name: rulebook.name, categoryName: rulebook.categoryName }),
      state: derived?.state ?? null,
      stateAt: derived?.at ?? null,
      latestApplication,
      rejection:
        derived?.state === CERT_STATE.rejected
          ? rejectionSummary(
              latestApplication?.status === "rejected"
                ? latestApplication
                : { rejectReason: certification?.revokeReason },
            )
          : null,
      unlockedBy: null,
    };
  });
  for (const rulebook of rulebooks) {
    rulebook.unlockedBy =
      rulebooks.find(
        (newer) => newer.supersedesId === rulebook.id && newer.state === CERT_STATE.certified,
      ) ?? null;
  }
  // 신판이 덮는 구판 세트의 서플리먼트는 구판 기본 룰북이 열린 이유(신판 인증)로 함께 열린다.
  const cores = rulebooks.filter((rulebook) => rulebook.kind === RULEBOOK_KIND.core);
  for (const rulebook of rulebooks) {
    if (rulebook.kind !== RULEBOOK_KIND.supplement || rulebook.state === CERT_STATE.certified) {
      continue;
    }
    const siblings = cores.filter((core) => editionSetKey(core) === editionSetKey(rulebook));
    if (siblings.every(isOpened)) {
      rulebook.unlockedBy = siblings.find((core) => core.unlockedBy)?.unlockedBy ?? null;
    }
  }
  const requests = records.requestRows.map((request) => ({
    id: request.id,
    label: rulebookLabel(request),
    kind: request.kind,
    createdAt: request.createdAt,
    outcome: request.outcome,
    processedAt: request.processedAt,
    rejectReason: request.rejectReason,
  }));
  return {
    rulebooks,
    sets: editionSets(rulebooks),
    requests,
    enforcementDate: records.enforcementDate,
    recentRulebookIds: records.recentRulebookIds,
    pendingRequestNames: records.pendingRequestNames.map(rulebookLabel),
    sanction: records.sanction,
  };
}

export type MyRulebooks = ReturnType<typeof toMyRulebooks>;
