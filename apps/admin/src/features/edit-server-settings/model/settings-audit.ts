import { withDirectionParticle } from "./with-direction-particle";

interface SettingsChanges {
  serverName: string;
  fields: { label: string; display: string | null }[];
  inviteChanged: boolean;
}

// 활동 기록 「서버 설정 변경」의 대상·사유. 예: 「TRPIA · 공지 채널」, 「공지 채널 ID를 #운영-공지로 변경」. 바뀐 게 없으면 null.
export function settingsAudit({ serverName, fields, inviteChanged }: SettingsChanges) {
  const labels = [...fields.map((field) => field.label), ...(inviteChanged ? ["초대 링크"] : [])];
  if (labels.length === 0) return null;
  const reasons = [
    ...fields.map((field) =>
      field.display
        ? `${field.label} ID를 ${withDirectionParticle(field.display)} 변경`
        : `${field.label} ID를 비움`,
    ),
    ...(inviteChanged ? ["디스코드 서버 초대 링크 변경"] : []),
  ];
  return { target: `${serverName} · ${labels.join(", ")}`, reason: reasons.join(", ") };
}
