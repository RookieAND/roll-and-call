import { DISCORD_COLOR, type DiscordEmbedField } from "@roll-and-call/discord";

export const CERT_RESULT_FIELD_NAME = "📌 결과";

export interface CertNoticeApplication {
  status: "pending" | "approved" | "rejected" | "withdrawn";
  staffNickname: string | null;
  rulebookLabel: string;
  // 결정은 났지만 아직 메시지·스레드에 반영하지 않았다.
  pendingSync: boolean;
}

const STATUS_MARK = {
  pending: "⏳",
  approved: "✅",
  rejected: "❌",
  withdrawn: "↩️",
} as const;

function statusText({ status, staffNickname }: CertNoticeApplication) {
  switch (status) {
    case "pending":
      return "심사 대기";
    case "approved":
      return `승인 · ${staffNickname ?? "알 수 없음"}`;
    case "rejected":
      return `반려 · ${staffNickname ?? "알 수 없음"}`;
    case "withdrawn":
      return "신청자가 철회";
  }
}

function threadLine(application: CertNoticeApplication) {
  const { status, staffNickname, rulebookLabel } = application;
  const staff = staffNickname ?? "알 수 없음";
  switch (status) {
    case "approved":
      return `${STATUS_MARK.approved} ${staff}님이 ${rulebookLabel} 인증을 승인했습니다.`;
    case "rejected":
      return `${STATUS_MARK.rejected} ${staff}님이 ${rulebookLabel} 인증을 반려했습니다.`;
    case "withdrawn":
      return `${STATUS_MARK.withdrawn} 신청자가 ${rulebookLabel} 신청을 철회했습니다.`;
    case "pending":
      return null;
  }
}

// 결정이 하나도 없으면 색을 바꾸지 않는다. 묶음에 대기가 남아 있어도 처음 색을 둔다.
function resultColor(applications: CertNoticeApplication[]): number | undefined {
  const statuses = new Set(applications.map((application) => application.status));
  if (statuses.has("pending")) return undefined;
  if (statuses.size > 1) return DISCORD_COLOR.waiting;
  if (statuses.has("approved")) return DISCORD_COLOR.confirmed;
  if (statuses.has("rejected")) return DISCORD_COLOR.cancelled;
  return DISCORD_COLOR.left;
}

// 신청 알림 임베드에 붙일 결과 칸·색과, 스레드에 새로 남길 줄. 사유는 넣지 않는다(D302).
export function certNoticeResult(applications: CertNoticeApplication[]): {
  field: DiscordEmbedField;
  color: number | undefined;
  threadLines: string[];
} {
  const single = applications.length === 1;
  const value = applications
    .map((application) =>
      single
        ? `${STATUS_MARK[application.status]} ${statusText(application)}`
        : `${STATUS_MARK[application.status]} ${application.rulebookLabel} — ${statusText(application)}`,
    )
    .join("\n");
  return {
    field: { name: CERT_RESULT_FIELD_NAME, value, inline: false },
    color: resultColor(applications),
    threadLines: applications
      .filter((application) => application.pendingSync)
      .flatMap((application) => threadLine(application) ?? []),
  };
}
