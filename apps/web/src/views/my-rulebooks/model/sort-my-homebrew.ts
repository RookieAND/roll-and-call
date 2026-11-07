import type { MyHomebrewApplication } from "@roll-and-call/database/homebrew";
import {
  HOMEBREW_APPLICATION_STATUS,
  type HomebrewApplicationStatus,
} from "@roll-and-call/database/homebrew/model";
import { sortBy } from "es-toolkit";

const STATUS_ORDER: Partial<Record<HomebrewApplicationStatus, number>> = {
  [HOMEBREW_APPLICATION_STATUS.approved]: 0,
  [HOMEBREW_APPLICATION_STATUS.pending]: 1,
  [HOMEBREW_APPLICATION_STATUS.rejected]: 2,
};

type SortableHomebrew = Pick<MyHomebrewApplication, "status" | "createdAt">;

// 승인됨 → 심사 중 → 반려됨, 같은 상태 안에서는 늦게 신청한 것이 위다.
export function sortMyHomebrew<Application extends SortableHomebrew>(applications: Application[]) {
  return sortBy(applications, [
    (application) => STATUS_ORDER[application.status] ?? Infinity,
    (application) => -application.createdAt.getTime(),
  ]);
}
