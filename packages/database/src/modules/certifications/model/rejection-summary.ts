import type { CertShot } from "#/schema/certifications";

import { CERT_SHOT_LABEL } from "./cert-shot-label";

interface RejectedApplication {
  rejectTag?: string | null;
  flaggedShots?: CertShot[] | null;
  rejectReason?: string | null;
}

// 반려 한 줄 요약. 사용자 앱의 내 룰북과 반려 알림(cert_rejected)이 같이 쓴다.
export function rejectionSummary(application: RejectedApplication | null) {
  if (application?.rejectTag) return application.rejectTag;
  if (application?.flaggedShots?.length) {
    return `${application.flaggedShots.map((shot) => CERT_SHOT_LABEL[shot]).join("·")} 사진을 다시 올려 주세요`;
  }
  return application?.rejectReason?.split("\n")[0] || "다시 신청해 주세요";
}
