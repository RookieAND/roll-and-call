import {
  CERT_FORMAT,
  CERT_PROOF,
  CERT_PROOF_LABEL,
  CERT_PROOFS,
  CERT_SHOT_LABEL,
  CERT_SHOTS,
  type MyRulebook,
} from "@/entities/rulebook";

import type { BookResult } from "./to-book-result";

export function bookThumbs(
  application: NonNullable<MyRulebook["latestApplication"]>,
): BookResult["thumbs"] {
  const flagged = (key: string) => application.flaggedShots.includes(key as never);
  if (application.format === CERT_FORMAT.ebook) {
    return CERT_PROOFS.map((proof) => ({
      label: CERT_PROOF_LABEL[proof],
      url:
        (proof === CERT_PROOF.order ? application.purchaseCaptureUrl : application.receiptUrl) ??
        "",
      flagged: flagged(proof),
    }));
  }
  return CERT_SHOTS.map((shot) => ({
    label: CERT_SHOT_LABEL[shot],
    url: application.photoUrls[shot] ?? "",
    flagged: flagged(shot),
  }));
}
