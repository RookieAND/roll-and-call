import { CERT_STATE, type MyRulebook, type MyRulebooks } from "@/entities/rulebook";

export type WaitingItem =
  | { kind: "pending"; at: Date; rulebook: MyRulebook }
  | { kind: "requested"; at: Date; id: string; label: string };

const byNewest = (left: { at: Date }, right: { at: Date }) =>
  right.at.getTime() - left.at.getTime();

// 인증 완료된 룰은 인증일 최신순, 처리 중인 룰은 반려됨을 맨 위에 두고 신청일 최신순이다.
export function rulebookSections({ rulebooks, requests }: MyRulebooks) {
  const withState = (state: string) =>
    rulebooks
      .filter((rulebook) => rulebook.state === state)
      .toSorted((left, right) => right.stateAt!.getTime() - left.stateAt!.getTime());

  const waiting: WaitingItem[] = [
    ...withState(CERT_STATE.pending).map((rulebook) => ({
      kind: "pending" as const,
      at: rulebook.stateAt!,
      rulebook,
    })),
    ...requests.map((request) => ({
      kind: "requested" as const,
      at: request.createdAt,
      id: request.id,
      label: request.label,
    })),
  ].toSorted(byNewest);

  return {
    usable: withState(CERT_STATE.certified),
    rejected: withState(CERT_STATE.rejected),
    waiting,
  };
}
