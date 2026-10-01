import { SESSION_ACTION_KIND, type SessionAction } from "./session-card-model";

export function hostMenuAction(gameId: string): SessionAction {
  return {
    kind: SESSION_ACTION_KIND.hostMenu,
    label: "운영 관리",
    href: `/games/${gameId}/manage`,
  };
}
