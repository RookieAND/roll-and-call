import { FEATURE_FLAG_ENV, type FeatureFlag } from "./feature-flag-env";

const ENABLED_VALUES = new Set(["true", "1"]);

function isEnvEnabled(flag: FeatureFlag): boolean {
  return ENABLED_VALUES.has(process.env[FEATURE_FLAG_ENV[flag]] ?? "");
}

export function isFeatureEnabled(flag: FeatureFlag): boolean {
  if (flag === "multiRoundCoordinated") {
    return isEnvEnabled("multiRound") && isEnvEnabled(flag);
  }
  return isEnvEnabled(flag);
}
