import type { Server } from "@roll-and-call/database";
import {
  loadUnsyncedCertStaffMessages,
  markCertStaffMessagesSynced,
} from "@roll-and-call/database/certifications";
import { editDiscordMessage, getDiscordMessage } from "@roll-and-call/discord";

import {
  CERT_RESULT_FIELD_NAME,
  CERT_STAFF_FIELD_NAME,
  certNoticeResult,
} from "./cert-notice-result";

// 신청자의 인증 신청 알림에 결정을 반영한다: 임베드에 결과·처리한 운영진 칸과 색을 고친다.
// 반영하지 못한 결정은 다음 결정 때 함께 반영된다. 메시지가 지워졌으면 반영한 것으로 친다.
export async function syncCertStaffNotices({
  server,
  userId,
}: {
  server: Pick<Server, "id" | "staffChannelId">;
  userId: string;
}) {
  const channelId = server.staffChannelId;
  if (!channelId) return;
  const messages = await loadUnsyncedCertStaffMessages({ serverId: server.id, userId });
  for (const { messageId, applications } of messages) {
    const message = await getDiscordMessage({ channelId, messageId });
    const [embed] = message?.embeds ?? [];
    if (embed) {
      const { fields: resultFields, color } = certNoticeResult(applications);
      const fields = (embed.fields ?? []).filter(
        ({ name }) => name !== CERT_RESULT_FIELD_NAME && name !== CERT_STAFF_FIELD_NAME,
      );
      await editDiscordMessage({
        channelId,
        messageId,
        input: {
          embeds: [{ ...embed, fields: [...fields, ...resultFields], color: color ?? embed.color }],
        },
      });
    }
    await markCertStaffMessagesSynced({
      serverId: server.id,
      applicationIds: applications
        .filter((application) => application.pendingSync)
        .map((application) => application.id),
    });
  }
}
