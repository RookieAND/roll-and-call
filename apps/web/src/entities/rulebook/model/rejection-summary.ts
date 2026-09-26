import type { CertApplication } from "@/shared/server";

import { CERT_SHOT_LABEL } from "./cert-shot";

// 반려 사유 한 줄. 운영진이 고른 사유가 먼저, 없으면 지적된 사진, 그다음 사유 첫 줄.
export function rejectionSummary(application: CertApplication | null) {
  if (application?.rejectTag) return application.rejectTag;
  if (application?.flaggedShots.length) {
    return `${application.flaggedShots.map((shot) => CERT_SHOT_LABEL[shot]).join("·")} 사진을 다시 올려 주세요`;
  }
  return application?.rejectReason?.split("\n")[0] || "다시 신청해 주세요";
}
