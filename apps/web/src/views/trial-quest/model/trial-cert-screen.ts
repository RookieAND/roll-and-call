export const TRIAL_CERT_SCREEN = {
  apply: "apply",
  result: "result",
  mine: "mine",
  detail: "detail",
} as const;
export type TrialCertScreenName = (typeof TRIAL_CERT_SCREEN)[keyof typeof TRIAL_CERT_SCREEN];
