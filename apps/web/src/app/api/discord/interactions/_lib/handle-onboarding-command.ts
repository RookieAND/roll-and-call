import { getServerByGuildId } from "@roll-and-call/database/servers";

import { serverPath } from "@/shared/lib";
import { siteOrigin } from "@/shared/server";

import { ephemeralResponse } from "./ephemeral-response";
import type { DiscordInteraction, DiscordInteractionResponse } from "./interaction-types";

// /온보딩: 튜토리얼 퀘스트 목록 링크를 본인에게만 보여 준다. 서버 상태는 바꾸지 않는다.
export async function handleOnboardingCommand(
  interaction: DiscordInteraction,
): Promise<DiscordInteractionResponse> {
  if (!interaction.guild_id) return ephemeralResponse("서버 안에서만 쓸 수 있는 명령입니다.");
  try {
    const server = await getServerByGuildId(interaction.guild_id);
    if (!server) return ephemeralResponse("이 서버에서는 쓸 수 없는 명령입니다.");
    const url = `${siteOrigin() ?? ""}${serverPath({ slug: server.slug, path: "/onboarding?from=me" })}`;
    return ephemeralResponse(`튜토리얼 퀘스트에서 롤앤콜을 체험해 볼 수 있습니다.\n${url}`);
  } catch (error) {
    console.error("디스코드 /온보딩 실패", { error });
    return ephemeralResponse("링크를 만들지 못했습니다. 잠시 뒤에 다시 시도해 주세요.");
  }
}
