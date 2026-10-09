import type { ShotKey } from "@/shared/server";

import { SHOTS } from "./shots";

export function isShotKey(value: unknown): value is ShotKey {
  return SHOTS.some((shot) => shot.key === value);
}
