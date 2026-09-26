// 전자책은 실물 사진 대신 구매 내역 캡처와 영수증(PDF도 된다)을 낸다.
export const CERT_PROOF = { order: "order", receipt: "receipt" } as const;

export type CertProof = (typeof CERT_PROOF)[keyof typeof CERT_PROOF];

export const CERT_PROOFS = [CERT_PROOF.order, CERT_PROOF.receipt] as const;

export const CERT_PROOF_LABEL: Record<CertProof, string> = {
  order: "구매 내역",
  receipt: "영수증",
};
