import { ActionNotice } from "./action-notice";

// 사유와 기간은 마이페이지 안내 띠가 보인다. 구인 상세에는 막혔다는 사실만 둔다(시안 02).
export function SanctionedActions() {
  return <ActionNotice title="활동 정지 기간에는 신청할 수 없습니다" colorPalette="warning" />;
}
