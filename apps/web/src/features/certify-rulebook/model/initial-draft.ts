import {
  CERT_FORMAT,
  CERT_PROOFS,
  CERT_SHOTS,
  CERT_STATE,
  type CertProof,
  type CertShot,
  type MyRulebook,
} from "@/entities/rulebook";

import type { BookDraft } from "./book-draft";
import { OTHER_SELLER } from "./other-seller";
import { PHOTO_SLOT, type PhotoSlot } from "./photo-slot";

export function initialDraft({
  rulebook,
  sellers,
  previews,
}: {
  rulebook: MyRulebook;
  sellers: string[];
  previews: Record<string, string>;
}): BookDraft {
  const kept = ({
    key,
    flagged,
  }: {
    key: string | null | undefined;
    flagged: boolean;
  }): PhotoSlot =>
    key && !flagged
      ? { status: PHOTO_SLOT.previous, key, previewUrl: previews[key] ?? "" }
      : { status: PHOTO_SLOT.empty };
  const previous = rulebook.state === CERT_STATE.rejected ? rulebook.latestApplication : null;
  const flagged = (key: string) => previous?.flaggedShots.includes(key as CertShot) ?? false;
  const ebook = previous?.format === CERT_FORMAT.ebook;
  const proofKey: Record<CertProof, string | null | undefined> = {
    order: ebook ? previous?.purchaseCaptureUrl : null,
    receipt: previous?.receiptUrl,
  };
  const seller = previous?.seller ?? "";
  const known = sellers.includes(seller);
  return {
    format: previous?.format ?? CERT_FORMAT.physical,
    shots: Object.fromEntries(
      CERT_SHOTS.map((shot) => [
        shot,
        kept({ key: previous?.photoUrls[shot], flagged: flagged(shot) }),
      ]),
    ) as Record<CertShot, PhotoSlot>,
    proofs: Object.fromEntries(
      CERT_PROOFS.map((proof) => [proof, kept({ key: proofKey[proof], flagged: flagged(proof) })]),
    ) as Record<CertProof, PhotoSlot>,
    seller: seller && !known ? OTHER_SELLER : seller,
    sellerOther: seller && !known ? seller : "",
    orderNumber: ebook ? (previous?.orderNumber ?? "") : "",
    orderDate: ebook ? (previous?.orderDate ?? "") : "",
  };
}
