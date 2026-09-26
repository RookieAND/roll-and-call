import { CERT_PROOF, type CertProof, type CertShot } from "@/entities/rulebook";

import type { BookDraft } from "./book-draft";

export type SlotKey = CertShot | CertProof;

export function isProofKey(key: SlotKey): key is CertProof {
  return key in CERT_PROOF;
}

export function slotOf(draft: BookDraft, key: SlotKey) {
  return isProofKey(key) ? draft.proofs[key] : draft.shots[key];
}
