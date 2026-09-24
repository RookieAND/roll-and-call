import type { CertApplication } from "@/shared/server";

import { CERT_SHOT_LABEL } from "./cert-shot";

// 반려 사유 한 줄. 지적된 사진이 있으면 그 칸을, 없으면 사유 첫 줄을 쓴다.
export function rejectionSummary(application: CertApplication | null) {
  if (application?.flaggedShots.length) {
    return `${application.flaggedShots.map((shot) => CERT_SHOT_LABEL[shot]).join("·")} 사진을 다시 올려 주세요`;
  }
  return application?.rejectReason?.split("\n")[0] || "다시 신청해 주세요";
}
