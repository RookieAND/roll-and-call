import type { CertManageStatus } from "@/shared/lib";

export const CERT_GRANT_METHOD = { photo: "photo", staff: "staff" } as const;
export type CertGrantMethod = (typeof CERT_GRANT_METHOD)[keyof typeof CERT_GRANT_METHOD];

// 인증 관리 한 행 = 유저 × 책(D288). edition은 「카테고리 판본」.
export interface CertManageRow {
  key: string;
  userId: string;
  nickname: string;
  discordId: string;
  discordHandle: string;
  sanctioned: boolean;
  rulebookId: string;
  rulebook: string;
  edition: string;
  // 인증됨 행에만 있다. 그 판본의 기본 룰북을 모두 가져 구인을 열 수 있는지.
  editionEligible: boolean | null;
  method: CertGrantMethod;
  status: CertManageStatus;
  changedAt: Date;
  applicationId: string | null;
}
