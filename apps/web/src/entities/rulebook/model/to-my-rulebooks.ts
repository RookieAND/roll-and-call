import type { CertApplication, RulebookRecords } from "@/shared/server";

import { CERT_STATE, type CertState } from "./cert-state";
import { deriveCertState } from "./derive-cert-state";
import { editionSets } from "./edition-sets";
import type { RulebookKind } from "./rulebook-kind";
import { rulebookLabel } from "./rulebook-label";

export interface MyRulebook {
  id: string;
  name: string;
  edition: string;
  aliases: string[];
  label: string;
  // 카테고리 이름을 뺀 이름(판본 없이). 카테고리 묶음 안에서 쓴다.
  shortName: string;
  certRequired: boolean;
  kind: RulebookKind;
  categoryId: string;
  categoryName: string;
  supersedesId: string | null;
  state: CertState | null;
  stateAt: Date | null;
  latestApplication: CertApplication | null;
  revokeReason: string | null;
  // 이 책을 대신하는 신판을 인증했으면 그 신판(7판 인증 → 6판도 열림).
  unlockedBy: MyRulebook | null;
}

function shortNameOf(name: string, categoryName: string) {
  return name.startsWith(`${categoryName} `) ? name.slice(categoryName.length + 1) : name;
}

// 룰북 목록마다 내 상태를 붙인다. 신청 기록은 최신순으로 들어온다.
export function toMyRulebooks(records: RulebookRecords) {
  const rulebooks: MyRulebook[] = records.catalog.map((rulebook) => {
    const certification = records.certificationRows.find((row) => row.rulebookId === rulebook.id);
    const latestApplication =
      records.applicationRows.find((row) => row.rulebookId === rulebook.id) ?? null;
    const derived = deriveCertState(certification, latestApplication ?? undefined);
    return {
      ...rulebook,
      label: rulebookLabel(rulebook),
      shortName: shortNameOf(rulebook.name, rulebook.categoryName),
      state: derived?.state ?? null,
      stateAt: derived?.at ?? null,
      latestApplication,
      revokeReason: certification?.revokeReason ?? null,
      unlockedBy: null,
    };
  });
  for (const rulebook of rulebooks) {
    rulebook.unlockedBy =
      rulebooks.find(
        (newer) => newer.supersedesId === rulebook.id && newer.state === CERT_STATE.certified,
      ) ?? null;
  }
  const requests = records.requestRows.map((request) => ({
    id: request.id,
    label: rulebookLabel(request),
    kind: request.kind,
    createdAt: request.createdAt,
    outcome: request.outcome,
    processedAt: request.processedAt,
  }));
  return {
    rulebooks,
    sets: editionSets(rulebooks),
    requests,
    enforcementDate: records.enforcementDate,
    recentRulebookIds: records.recentRulebookIds,
    pendingRequestNames: records.pendingRequestNames.map(rulebookLabel),
    suspended: records.suspended,
    suspendedUntil: records.suspendedUntil,
  };
}

export type MyRulebooks = ReturnType<typeof toMyRulebooks>;
