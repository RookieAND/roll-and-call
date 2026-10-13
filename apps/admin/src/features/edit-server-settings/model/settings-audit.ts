import { compactChanges, scalarChange } from "@roll-and-call/database/moderation/model";

import { withDirectionParticle } from "./with-direction-particle";

interface SettingsChanges {
  serverName: string;
  // previous는 저장 전 채널 이름(`#이름`)이고 못 찾으면 ID다. display는 저장 뒤 채널 이름이다.
  fields: { label: string; display: string | null; previous: string | null }[];
  invite: { changed: boolean; before: string | null; after: string | null };
}

// 활동 기록 「서버 설정 변경」의 대상·사유·바뀐 칸. 예: 「TRPIA · 공지 채널」, 「공지 채널 ID를 #운영-공지로 변경」. 바뀐 게 없으면 null.
export function settingsAudit({ serverName, fields, invite }: SettingsChanges) {
  const labels = [...fields.map((field) => field.label), ...(invite.changed ? ["초대 링크"] : [])];
  if (labels.length === 0) return null;
  const reasons = [
    ...fields.map((field) =>
      field.display
        ? `${field.label} ID를 ${withDirectionParticle(field.display)} 변경`
        : `${field.label} ID를 비움`,
    ),
    ...(invite.changed ? ["디스코드 서버 초대 링크 변경"] : []),
  ];
  const changes = compactChanges([
    ...fields.map((field) => scalarChange(field.label, field.previous, field.display)),
    ...(invite.changed ? [scalarChange("초대 링크", invite.before, invite.after)] : []),
  ]);
  return { target: `${serverName} · ${labels.join(", ")}`, reason: reasons.join(", "), changes };
}
