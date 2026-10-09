import type { ShotKey } from "@/shared/server";

import { SHOTS } from "./shots";

export function shotLabels(flaggedShots: ShotKey[]) {
  return SHOTS.filter((shot) => flaggedShots.includes(shot.key)).map((shot) => shot.label);
}
