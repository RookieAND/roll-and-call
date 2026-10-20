import type { Server } from "@roll-and-call/database";
import {
  loadUnsyncedCertStaffMessages,
  markCertStaffMessagesSynced,
} from "@roll-and-call/database/certifications";
import {
  editDiscordMessage,
  getDiscordMessage,
  sendDiscordMessage,
  startMessageThread,
} from "@roll-and-call/discord";

import { CERT_RESULT_FIELD_NAME, certNoticeResult } from "./cert-notice-result";

const THREAD_NAME = "룰북 인증 심사";

// 신청자의 인증 신청 알림에 결정을 반영한다: 임베드에 결과 칸·색을 고치고, 메시지 스레드에 누가 처리했는지 남긴다.
// 반영하지 못한 결정은 다음 결정 때 함께 반영된다. 메시지가 지워졌으면 반영한 것으로 친다.
// ponytail: 두 운영진이 같은 묶음을 동시에 처리하면 스레드 줄이 겹칠 수 있다. 드물어 잠그지 않는다.
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
      const { field, color, threadLines } = certNoticeResult(applications);
      const fields = (embed.fields ?? []).filter(({ name }) => name !== CERT_RESULT_FIELD_NAME);
      await editDiscordMessage({
        channelId,
        messageId,
        input: { embeds: [{ ...embed, fields: [...fields, field], color: color ?? embed.color }] },
      });
      if (threadLines.length > 0) {
        await sendDiscordMessage({
          channelId: await startMessageThread({ channelId, messageId, name: THREAD_NAME }),
          input: { content: threadLines.join("\n") },
        });
      }
    }
    await markCertStaffMessagesSynced({
      serverId: server.id,
      applicationIds: applications
        .filter((application) => application.pendingSync)
        .map((application) => application.id),
    });
  }
}
