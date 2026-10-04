// open: 심사 가능 / waiting: 기본 룰북 심사를 기다리는 서플리먼트 / processed: 이미 승인·반려됨 / withdrawn: 신청자가 거둠
export const CERT_REVIEW_STATE = {
  open: "open",
  waiting: "waiting",
  processed: "processed",
  withdrawn: "withdrawn",
} as const;

export type CertReviewState = (typeof CERT_REVIEW_STATE)[keyof typeof CERT_REVIEW_STATE];
