export const FEATURE_FLAG_ENV = {
  multiRound: "FEATURE_MULTI_ROUND",
  multiRoundCoordinated: "FEATURE_MULTI_ROUND_COORDINATED",
} as const;

export type FeatureFlag = keyof typeof FEATURE_FLAG_ENV;
