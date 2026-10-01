import type { CertApplication } from "@/shared/server";

import { CERT_SHOT_LABEL } from "./cert-shot";

export function rejectionSummary(application: CertApplication | null) {
  if (application?.rejectTag) return application.rejectTag;
  if (application?.flaggedShots.length) {
    return `${application.flaggedShots.map((shot) => CERT_SHOT_LABEL[shot]).join("·")} 사진을 다시 올려 주세요`;
  }
  return application?.rejectReason?.split("\n")[0] || "다시 신청해 주세요";
}
