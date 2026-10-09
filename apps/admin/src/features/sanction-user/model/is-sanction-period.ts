import { isString } from "es-toolkit";

import { SANCTION_PERIODS, type SanctionPeriod } from "./sanction-periods";

const PERIOD_VALUES: readonly string[] = SANCTION_PERIODS.map((period) => period.value);

export function isSanctionPeriod(value: unknown): value is SanctionPeriod {
  return isString(value) && PERIOD_VALUES.includes(value);
}
