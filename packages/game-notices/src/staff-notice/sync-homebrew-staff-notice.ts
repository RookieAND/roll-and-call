import type { Server } from "@roll-and-call/database";
import { loadHomebrewNotice } from "@roll-and-call/database/homebrew";
import { editDiscordMessage, getDiscordMessage } from "@roll-and-call/discord";

import { CERT_RESULT_FIELD_NAME, CERT_STAFF_FIELD_NAME } from "./cert-notice-result";
import { homebrewNoticeResult } from "./homebrew-notice-result";

// 자작 룰 신청 알림에 처리 결과(승인·반려·철회)를 반영한다.
// ponytail: 룰북 추가 요청과 같이 한 번 시도하고 끝낸다. 놓친 반영을 다시 시도하려면 반영 시각 열을 둔다.
export async function syncHomebrewStaffNotice({
  server,
  applicationId,
}: {
  server: Pick<Server, "id" | "staffChannelId">;
  applicationId: string;
}) {
  const channelId = server.staffChannelId;
  if (!channelId) return;
  const notice = await loadHomebrewNotice({ serverId: server.id, id: applicationId });
  if (!notice?.staffMessageId || notice.status === "pending") return;
  const message = await getDiscordMessage({ channelId, messageId: notice.staffMessageId });
  const [embed] = message?.embeds ?? [];
  if (!embed) return;
  const { fields: resultFields, color } = homebrewNoticeResult({
    outcome: notice.status,
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
