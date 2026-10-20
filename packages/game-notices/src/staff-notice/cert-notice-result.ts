import { DISCORD_COLOR, type DiscordEmbedField } from "@roll-and-call/discord";

export const CERT_RESULT_FIELD_NAME = "📌 결과";
export const CERT_STAFF_FIELD_NAME = "🧑‍⚖️ 처리한 운영진";

export interface CertNoticeApplication {
  status: "pending" | "approved" | "rejected" | "withdrawn";
  staffNickname: string | null;
  rulebookLabel: string;
  // 결정은 났지만 아직 메시지에 반영하지 않았다.
  pendingSync: boolean;
}

const STATUS_MARK = {
  pending: "⏳",
  approved: "✅",
  rejected: "❌",
  withdrawn: "↩️",
} as const;

const STATUS_TEXT = {
  pending: "심사 대기",
  approved: "승인",
  rejected: "반려",
  withdrawn: "신청자가 철회",
} as const;

const ALL_STATUS_TEXT = {
  approved: "전체 승인",
  rejected: "전체 반려",
  withdrawn: "신청자가 전체 철회",
} as const;

// 결정이 하나도 없으면 색을 바꾸지 않는다. 묶음에 대기가 남아 있어도 처음 색을 둔다.
function resultColor(applications: CertNoticeApplication[]): number | undefined {
  const statuses = new Set(applications.map((application) => application.status));
  if (statuses.has("pending")) return undefined;
  if (statuses.size > 1) return DISCORD_COLOR.waiting;
  if (statuses.has("approved")) return DISCORD_COLOR.confirmed;
  if (statuses.has("rejected")) return DISCORD_COLOR.cancelled;
  return DISCORD_COLOR.left;
}

function resultValue(applications: CertNoticeApplication[]) {
  const [first] = applications;
  if (
    applications.length > 1 &&
    first &&
    first.status !== "pending" &&
    applications.every(({ status }) => status === first.status)
  ) {
    return `${STATUS_MARK[first.status]} ${ALL_STATUS_TEXT[first.status]}`;
  }
  return applications
    .map(({ status, rulebookLabel }) =>
      applications.length === 1
        ? `${STATUS_MARK[status]} ${STATUS_TEXT[status]}`
        : `${STATUS_MARK[status]} ${rulebookLabel} — ${STATUS_TEXT[status]}`,
    )
    .join("\n");
}

// 승인·반려한 운영진. 한 명이면 이름만, 여러 명이면 책마다 적는다.
function staffValue(applications: CertNoticeApplication[]) {
  const decided = applications.filter(
    ({ status }) => status === "approved" || status === "rejected",
  );
  const names = new Set(decided.map(({ staffNickname }) => staffNickname ?? "알 수 없음"));
  if (names.size === 0) return undefined;
  if (names.size === 1) return [...names][0];
  return decided
    .map(
      ({ rulebookLabel, staffNickname }) => `${rulebookLabel} — ${staffNickname ?? "알 수 없음"}`,
    )
    .join("\n");
}

// 신청 알림 임베드에 붙일 결과·처리한 운영진 칸과 색. 사유는 넣지 않는다(D302).
export function certNoticeResult(applications: CertNoticeApplication[]): {
  fields: DiscordEmbedField[];
  color: number | undefined;
} {
  const staff = staffValue(applications);
  return {
    fields: [
      { name: CERT_RESULT_FIELD_NAME, value: resultValue(applications), inline: false },
      ...(staff ? [{ name: CERT_STAFF_FIELD_NAME, value: staff, inline: false }] : []),
    ],
    color: resultColor(applications),
  };
}
