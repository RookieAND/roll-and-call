export const CERT_PROOF = { order: "order", receipt: "receipt" } as const;

export type CertProof = (typeof CERT_PROOF)[keyof typeof CERT_PROOF];

export const CERT_PROOFS = [CERT_PROOF.order, CERT_PROOF.receipt] as const;

export const CERT_PROOF_LABEL: Record<CertProof, string> = {
  order: "구매 내역",
  receipt: "영수증",
};
