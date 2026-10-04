import type { CertManageStatus } from "@/shared/lib";

// 주소 쿼리 q·status·edition·user·rulebook. user·rulebook은 다른 화면의 링크가 거는 ID 필터다.
export interface CertManageFilter {
  query?: string;
  status?: CertManageStatus;
  edition?: string;
  userId?: string;
  rulebookId?: string;
}
