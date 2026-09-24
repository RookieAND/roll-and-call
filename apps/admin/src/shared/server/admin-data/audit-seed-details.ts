import type { AuditEntry } from "./types";

// 시드 활동 기록의 전후 상태와 함께 처리된 항목. 키는 mock-db가 매기는 활동 기록 id다.
export const AUDIT_SEED_DETAILS: Record<
  string,
  Pick<AuditEntry, "before" | "after" | "related" | "staffMemo">
> = {
  a1: { before: { label: "심사 대기" }, after: { label: "인증됨" } },
  a2: {
    before: { label: "심사 대기" },
    after: { label: "반려됨" },
    staffMemo: "같은 사유로 두 번째 반려입니다.",
  },
  a3: {
    before: { label: "정상" },
    after: { label: "제재 중", sub: "10월 30일까지" },
    staffMemo:
      "불참 3건 중 2건이 같은 GM의 세션에서 기록됐습니다. 사전 연락 기록은 확인되지 않았습니다. 제재를 확정하기 전에 DM으로 상황을 확인했습니다.",
    related: ["GM으로 열어둔 구인 1건 닫힘 · 안개 낀 등대", "확정 참여 2건은 그대로 진행"],
  },
  a4: { before: { label: "유효" }, after: { label: "취소됨" } },
  a5: {
    before: { label: "공개" },
    after: { label: "숨김" },
    related: ["미처리 신고 1건 처리됨"],
  },
  a7: {
    before: { label: "인증됨" },
    after: { label: "인증 취소됨" },
    related: ["더블크로스 3rd로 열어둔 구인 1건은 그대로 진행"],
  },
  a9: { before: { label: "제재 중", sub: "10월 3일까지" }, after: { label: "정상" } },
  a12: { before: { label: "일반 유저" }, after: { label: "운영진" } },
};
