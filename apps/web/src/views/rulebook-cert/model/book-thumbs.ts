import {
  CERT_BULK_PHOTO_KEYS,
  CERT_FORMAT,
  CERT_PROOF,
  CERT_PROOF_LABEL,
  CERT_PROOFS,
  CERT_SHOT_LABEL,
  CERT_SHOTS,
  type MyRulebook,
} from "@/entities/rulebook";

import type { BookResult } from "./to-book-result";

// src는 서명 URL이다. 파일 키가 없으면 null, 서명하지 못했으면 빈 문자열(빈 칸으로 그린다).
export function bookThumbs({
  application,
  signedUrls,
}: {
  application: NonNullable<MyRulebook["latestApplication"]>;
  signedUrls: Map<string, string>;
}): BookResult["thumbs"] {
  const flagged = (key: string) => application.flaggedShots.includes(key as never);
  const src = (key: string | null | undefined) => (key ? (signedUrls.get(key) ?? "") : null);
  if (application.format === CERT_FORMAT.ebook) {
    return CERT_PROOFS.map((proof) => ({
      label: CERT_PROOF_LABEL[proof],
      src: src(
        proof === CERT_PROOF.order ? application.purchaseCaptureUrl : application.receiptUrl,
      ),
      flagged: flagged(proof),
    }));
  }
  if (application.groupId) {
    // 묶음 사진은 앞면·뒷면이 아니라 올린 순서대로 부르고, 올리지 않은 칸은 보이지 않는다.
    return CERT_BULK_PHOTO_KEYS.filter((key) => application.photoUrls[key]).map((key, index) => ({
      label: `사진 ${index + 1}`,
      src: src(application.photoUrls[key]),
      flagged: false,
    }));
  }
  return CERT_SHOTS.map((shot) => ({
    label: CERT_SHOT_LABEL[shot],
    src: src(application.photoUrls[shot]),
    flagged: flagged(shot),
  }));
}
