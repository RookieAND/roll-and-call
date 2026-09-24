import type { CertApplication, RulebookRecords } from "@/shared/server";

import type { CertState } from "./cert-state";
import { deriveCertState } from "./derive-cert-state";
import { rulebookLabel } from "./rulebook-label";

export interface MyRulebook {
  id: string;
  name: string;
  edition: string;
  aliases: string[];
  label: string;
  certRequired: boolean;
  state: CertState | null;
  stateAt: Date | null;
  gameCount: number;
  latestApplication: CertApplication | null;
  revokeReason: string | null;
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
      state: derived?.state ?? null,
      stateAt: derived?.at ?? null,
      gameCount: records.gameCounts.find((row) => row.rulebookId === rulebook.id)?.count ?? 0,
      latestApplication,
      revokeReason: certification?.revokeReason ?? null,
    };
  });
  const requests = records.requestRows.map((request) => ({
    id: request.id,
    label: rulebookLabel(request),
    createdAt: request.createdAt,
  }));
  return { rulebooks, requests, enforcementDate: records.enforcementDate };
}

export type MyRulebooks = ReturnType<typeof toMyRulebooks>;
