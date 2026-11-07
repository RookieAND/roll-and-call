import { formatFullDate } from "@roll-and-call/app-kit/date";
import type { MyHomebrewApplicationDetail } from "@roll-and-call/database/homebrew";
import { HOMEBREW_APPLICATION_STATUS } from "@roll-and-call/database/homebrew/model";

export const HOMEBREW_DETAIL_ACTION = { withdraw: "withdraw", reapply: "reapply" } as const;
export type HomebrewDetailAction =
  (typeof HOMEBREW_DETAIL_ACTION)[keyof typeof HOMEBREW_DETAIL_ACTION];

type Application = Pick<
  MyHomebrewApplicationDetail,
  | "status"
  | "hidden"
  | "createdAt"
  | "processedAt"
  | "approvedAt"
  | "rejectTag"
  | "rejectReason"
  | "reapplied"
>;

export interface HomebrewDetailState {
  badge: { colorPalette: "gray" | "danger" | "success"; label: string };
  dateLabel: string;
  callout: { colorPalette: "danger" | "warning"; title: string; lines: string[] } | null;
  editable: boolean;
  action: HomebrewDetailAction | null;
  // 정보 카드 아래 한 줄 안내.
  guide: string | null;
}

const APPROVED_GUIDE = "심사 자료를 바꾸려면 운영진에게 문의해 주세요.";
const REAPPLIED_GUIDE = "이 신청은 고쳐서 다시 신청했습니다.";

// 자작 룰 상세의 상태별 배지·날짜·안내·하단 버튼. 거둔 신청은 조회가 걸러 여기 오지 않는다.
export function homebrewDetailState(application: Application): HomebrewDetailState {
  const appliedLabel = `${formatFullDate(application.createdAt)} 신청`;
  if (application.status === HOMEBREW_APPLICATION_STATUS.rejected) {
    const reason = application.rejectReason || application.rejectTag;
    return {
      badge: { colorPalette: "danger", label: "반려됨" },
      dateLabel: appliedLabel,
      callout: {
        colorPalette: "warning",
        title: "내가 만든 룰 신청이 반려되었습니다.",
        lines: reason ? [`사유: ${reason}`] : [],
      },
      editable: false,
      action: application.reapplied ? null : HOMEBREW_DETAIL_ACTION.reapply,
      guide: application.reapplied ? REAPPLIED_GUIDE : null,
    };
  }
  if (application.status === HOMEBREW_APPLICATION_STATUS.approved) {
    const approvedAt = application.approvedAt ?? application.processedAt ?? application.createdAt;
    return {
      badge: { colorPalette: "success", label: "승인됨" },
      dateLabel: `${formatFullDate(approvedAt)} 승인`,
      callout: application.hidden
        ? {
            colorPalette: "warning",
            title: "운영진이 이 룰을 숨겼습니다.",
            lines: ["새 구인에서 고를 수 없습니다.", "이미 열린 구인은 그대로 진행됩니다."],
          }
        : null,
      editable: !application.hidden,
      action: null,
      guide: APPROVED_GUIDE,
    };
  }
  return {
    badge: { colorPalette: "gray", label: "심사 중" },
    dateLabel: appliedLabel,
    callout: null,
    editable: false,
    action: HOMEBREW_DETAIL_ACTION.withdraw,
    guide: null,
  };
}
