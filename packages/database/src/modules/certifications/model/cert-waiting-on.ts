import { rulebookLabel } from "#db/modules/rulebooks/model";

import { supplementCores } from "./supplement-cores";

interface WaitingRulebook {
  id: string;
  name: string;
  edition: string;
  kind: string;
  category: string;
}

interface WaitingApplication {
  id: string;
  userId: string;
  rulebookId: string;
  groupId: string | null;
  status: string;
}

interface WaitingRecords {
  rulebooks: WaitingRulebook[];
  certApplications: WaitingApplication[];
  certifications: { userId: string; rulebookId: string }[];
}

// 신청자가 심사 대기 중인 기본 룰북과 그 신청. 서플리먼트는 그 결정 뒤에 심사한다.
export function certWaitingOn(application: WaitingApplication, records: WaitingRecords) {
  const book = records.rulebooks.find((rulebook) => rulebook.id === application.rulebookId);
  if (book?.kind !== "supplement") return [];
  const mine = (rulebookId: string) => (row: { userId: string; rulebookId: string }) =>
    row.userId === application.userId && row.rulebookId === rulebookId;
  return supplementCores(book, records.rulebooks).flatMap((core) => {
    // 같은 묶음의 기본 룰북은 묶음을 한꺼번에 처리하므로 기다리지 않는다.
    const pendingCore = records.certApplications.find(
      (row) =>
        mine(core.id)(row) &&
        row.status === "pending" &&
        !(application.groupId && row.groupId === application.groupId),
    );
    if (!pendingCore || records.certifications.some(mine(core.id))) return [];
    return [{ label: rulebookLabel(core), applicationId: pendingCore.id }];
  });
}
