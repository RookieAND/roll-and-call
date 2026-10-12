import { resolvePublicChannelNames } from "@roll-and-call/discord";
import { delay, uniq } from "es-toolkit";

import { pickDiscordLinkTargets } from "./pick-discord-link-targets";

// 저장이 디스코드 응답을 기다리는 시간의 상한. 넘기면 이름 없이 저장하고 칩은 기본 라벨로 보인다.
const LOOKUP_TIMEOUT_MS = 3000;

// 주의 사항의 디스코드 채널 링크 → 칩에 보여 줄 이름(주소 기준). 저장할 때 한 번만 부르고 결과를 games에 담는다.
// 조회에 실패하거나 비공개 채널이면 그 링크는 빠지고, 화면은 기본 라벨(「디스코드 채널」)로 그린다.
export async function resolveNoticeLinkLabels({
  guildId,
  notice,
}: {
  guildId: string;
  notice: string | null;
}): Promise<Record<string, string>> {
  if (!notice) return {};
  const targets = pickDiscordLinkTargets({ notice, guildId });
  if (targets.length === 0) return {};

  const names = await Promise.race([
    resolvePublicChannelNames({
      guildId,
      channelIds: uniq(targets.map((target) => target.channelId)),
    }),
    delay(LOOKUP_TIMEOUT_MS).then((): Record<string, string> => ({})),
  ]);

  const labels: Record<string, string> = {};
  for (const { href, channelId } of targets) {
    const name = names[channelId];
    if (name) labels[href] = name;
  }
  return labels;
}
