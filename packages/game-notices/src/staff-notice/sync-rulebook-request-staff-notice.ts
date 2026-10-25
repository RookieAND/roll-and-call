import type { Server } from "@roll-and-call/database";
import { loadRulebookRequestNotice } from "@roll-and-call/database/rulebooks";
import { editDiscordMessage, getDiscordMessage } from "@roll-and-call/discord";

import { CERT_RESULT_FIELD_NAME, CERT_STAFF_FIELD_NAME } from "./cert-notice-result";
import { rulebookRequestNoticeResult } from "./rulebook-request-notice-result";

// 룰북 추가 요청 알림에 처리 결과를 반영한다: 임베드에 결과·처리한 운영진 칸과 색을 고친다.
// ponytail: 한 번 시도하고 끝낸다. 인증 신청처럼 못 반영한 결정을 다시 시도하려면 처리 쪽에 반영 여부 열을 둔다.
export async function syncRulebookRequestStaffNotice({
  server,
  requestId,
}: {
  server: Pick<Server, "id" | "staffChannelId">;
  requestId: string;
}) {
  const channelId = server.staffChannelId;
  if (!channelId) return;
  const notice = await loadRulebookRequestNotice({ serverId: server.id, id: requestId });
  if (!notice?.staffMessageId || !notice.outcome) return;
  const message = await getDiscordMessage({ channelId, messageId: notice.staffMessageId });
  const [embed] = message?.embeds ?? [];
  if (!embed) return;
  const { fields: resultFields, color } = rulebookRequestNoticeResult({
    outcome: notice.outcome,
    staffNickname: notice.staffNickname,
  });
  const fields = (embed.fields ?? []).filter(
    ({ name }) => name !== CERT_RESULT_FIELD_NAME && name !== CERT_STAFF_FIELD_NAME,
  );
  await editDiscordMessage({
    channelId,
    messageId: notice.staffMessageId,
    input: { embeds: [{ ...embed, fields: [...fields, ...resultFields], color }] },
  });
}
