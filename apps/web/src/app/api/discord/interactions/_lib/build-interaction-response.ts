import { embedResponse } from "./embed-response";
import { formatAbilityScores } from "./format-ability-scores";
import { formatDiceRoll } from "./format-dice-roll";
import type { DiscordInteraction, DiscordInteractionResponse } from "./interaction-types";
import { messageResponse } from "./message-response";
import { rollAbilityScores } from "./roll-ability-scores";
import { rollDiceNotation } from "./roll-dice-notation";

const INTERACTION_PING = 1;
const INTERACTION_APPLICATION_COMMAND = 2;
const RESPONSE_PONG = 1;
const DICE_OPTION_NAME = "식";

export function buildInteractionResponse(
  interaction: DiscordInteraction,
): DiscordInteractionResponse {
  if (interaction.type === INTERACTION_PING) return { type: RESPONSE_PONG };
  if (interaction.type !== INTERACTION_APPLICATION_COMMAND) {
    return messageResponse("지원하지 않는 요청입니다.");
  }

  const user = interaction.member?.user ?? interaction.user;
  const nickname = interaction.member?.nick || user?.global_name || user?.username || "";
  const playerName = nickname.replace(/\s+/g, " ").trim() || "플레이어";

  switch (interaction.data?.name) {
    case "능력치":
      return embedResponse(formatAbilityScores(playerName, rollAbilityScores()));
    case "주사위": {
      const option = interaction.data.options?.find(({ name }) => name === DICE_OPTION_NAME);
      const roll = rollDiceNotation(String(option?.value ?? ""));
      if (!roll) return messageResponse("`1d10`, `3d6+2` 처럼 입력해 주세요.");
      return embedResponse(formatDiceRoll(playerName, roll));
    }
    default:
      return messageResponse("모르는 커맨드입니다.");
  }
}
