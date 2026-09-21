import { SESSION_ACTION_KIND, type SessionAction } from "./session-card-model";

// 목록 카드에 버튼을 늘리지 않는다. GM 도구는 "운영 관리" 한 곳으로 모은다.
export function hostMenuAction(gameId: string): SessionAction {
  return {
    kind: SESSION_ACTION_KIND.hostMenu,
    label: "운영 관리",
    href: `/games/${gameId}/manage`,
  };
}
