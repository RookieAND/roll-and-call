// 내 룰북 한 줄의 상태. 추가 요청 중은 아직 목록에 없는 룰북이라 상세가 없다.
export const CERT_STATE = {
  certified: "certified",
  pending: "pending",
  rejected: "rejected",
  revoked: "revoked",
  requested: "requested",
} as const;

export type CertState = (typeof CERT_STATE)[keyof typeof CERT_STATE];
