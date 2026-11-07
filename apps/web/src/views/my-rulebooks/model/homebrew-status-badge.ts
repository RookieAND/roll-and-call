import {
  HOMEBREW_APPLICATION_STATUS,
  type HomebrewApplicationStatus,
} from "@roll-and-call/database/homebrew/model";

type HomebrewBadge = { label: string; palette: "success" | "gray" | "danger" };

// 거둔 신청은 목록에 오지 않는다. 운영진이 숨긴 승인 룰도 시안 M4처럼 승인됨으로 둔다.
export const HOMEBREW_STATUS_BADGE: Partial<Record<HomebrewApplicationStatus, HomebrewBadge>> = {
  [HOMEBREW_APPLICATION_STATUS.approved]: { label: "승인됨", palette: "success" },
  [HOMEBREW_APPLICATION_STATUS.pending]: { label: "심사 중", palette: "gray" },
  [HOMEBREW_APPLICATION_STATUS.rejected]: { label: "반려됨", palette: "danger" },
};
