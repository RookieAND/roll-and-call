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

const kept = ({ url, flagged }: { url: string | null | undefined; flagged: boolean }): PhotoSlot =>
  url && !flagged ? { status: PHOTO_SLOT.previous, url } : { status: PHOTO_SLOT.empty };

export function initialDraft({
  rulebook,
  sellers,
}: {
  rulebook: MyRulebook;
  sellers: string[];
}): BookDraft {
  const previous = rulebook.state === CERT_STATE.rejected ? rulebook.latestApplication : null;
  const flagged = (key: string) => previous?.flaggedShots.includes(key as CertShot) ?? false;
  const ebook = previous?.format === CERT_FORMAT.ebook;
  const proofUrl: Record<CertProof, string | null | undefined> = {
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
        kept({ url: previous?.photoUrls[shot], flagged: flagged(shot) }),
      ]),
    ) as Record<CertShot, PhotoSlot>,
    proofs: Object.fromEntries(
      CERT_PROOFS.map((proof) => [proof, kept({ url: proofUrl[proof], flagged: flagged(proof) })]),
    ) as Record<CertProof, PhotoSlot>,
    seller: seller && !known ? OTHER_SELLER : seller,
    sellerOther: seller && !known ? seller : "",
    orderNumber: ebook ? (previous?.orderNumber ?? "") : "",
    orderDate: ebook ? (previous?.orderDate ?? "") : "",
  };
}
