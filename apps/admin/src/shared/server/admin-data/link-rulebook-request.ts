import "server-only";
import { findRulebookRequest } from "./find-rulebook-request";
import { db } from "./mock-db";
import { recordAudit } from "./record-audit";
import type { RulebookActionResult } from "./rulebook-action-result";
import { rulebookLabel } from "./rulebook-label";

export interface RulebookLinkInput {
  rulebookId: string;
  addAlias: boolean;
}

// 요청을 이미 있는 룰북으로 처리한다. 요청한 이름이 이미 그 룰북의 이름이면 다른 이름에 넣지 않는다.
export async function linkRulebookRequest(
  id: string,
  actor: string,
  input: RulebookLinkInput,
): Promise<RulebookActionResult> {
  const { request, requester } = findRulebookRequest(id);
  if (request.processed) return { ok: false, conflict: request.processed };
  const rulebook = db.rulebooks.find((candidate) => candidate.id === input.rulebookId);
  if (!rulebook) throw new Error("연결할 룰북을 찾을 수 없습니다");
  const label = rulebookLabel(rulebook);
  const aliasAdded =
    input.addAlias && request.name !== label && !rulebook.aliases.includes(request.name);
  if (aliasAdded) rulebook.aliases.push(request.name);
  request.processed = { action: "룰북 연결", by: actor, at: new Date() };
  recordAudit({
    actor,
    action: "룰북 연결",
    target: `${request.name} · ${label}`,
    reason: `${requester}의 추가 요청을 기존 룰북으로 처리`,
    related: aliasAdded ? [`「${request.name}」을 다른 이름에 추가`] : undefined,
  });
  return { ok: true };
}
