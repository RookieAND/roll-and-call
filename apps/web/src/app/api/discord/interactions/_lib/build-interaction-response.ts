import { embedResponse } from "./embed-response";
import { formatAbilityScores } from "./format-ability-scores";
import { formatCocCheck } from "./format-coc-check";
import { formatDiceRoll } from "./format-dice-roll";
import { formatDndAbilityScores } from "./format-dnd-ability-scores";
import { formatRandomPick } from "./format-random-pick";
import type { DiscordInteraction, DiscordInteractionResponse } from "./interaction-types";
import { judgeCocCheck } from "./judge-coc-check";
import { messageResponse } from "./message-response";
import { pickRandomOption } from "./pick-random-option";
import { rollAbilityScores } from "./roll-ability-scores";
import { rollDiceNotation } from "./roll-dice-notation";
import { rollDndAbilityScores } from "./roll-dnd-ability-scores";
import { rollPercentile } from "./roll-percentile";

const INTERACTION_PING = 1;
const INTERACTION_APPLICATION_COMMAND = 2;
const RESPONSE_PONG = 1;
const DICE_OPTION_NAME = "식";
const RULE_OPTION_NAME = "규칙";
const TARGET_OPTION_NAME = "목표값";
const MODIFIER_OPTION_NAME = "보정";
const PICK_OPTION_PREFIX = "항목";
const RULE_DND = "dnd";

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
    case "능력치": {
      const rule = interaction.data.options?.find(({ name }) => name === RULE_OPTION_NAME)?.value;
      if (rule === RULE_DND) {
        return embedResponse(
          formatDndAbilityScores({ playerName, scores: rollDndAbilityScores() }),
        );
      }
      return embedResponse(formatAbilityScores({ playerName, scores: rollAbilityScores() }));
    }
    case "판정": {
      const options = interaction.data.options ?? [];
      const target = Number(options.find(({ name }) => name === TARGET_OPTION_NAME)?.value);
      const modifier = Number(
        options.find(({ name }) => name === MODIFIER_OPTION_NAME)?.value ?? 0,
      );
      const { roll, candidates } = rollPercentile(modifier);
      const level = judgeCocCheck({ roll, target });
      return embedResponse(
        formatCocCheck({ playerName, target, modifier, roll, candidates, level }),
      );
    }
    case "선택": {
      const options = (interaction.data.options ?? [])
        .filter(({ name }) => name.startsWith(PICK_OPTION_PREFIX))
        .map(({ value }) => String(value).trim())
        .filter(Boolean);
      if (options.length < 2) return messageResponse("항목을 두 개 이상 적어 주세요.");
      return embedResponse(
        formatRandomPick({ playerName, options, picked: pickRandomOption(options) }),
      );
    }
    case "주사위": {
      const option = interaction.data.options?.find(({ name }) => name === DICE_OPTION_NAME);
      const roll = rollDiceNotation(String(option?.value ?? ""));
      if (!roll) return messageResponse("`1d10`, `3d6+2` 처럼 입력해 주세요.");
      return embedResponse(formatDiceRoll({ playerName, roll }));
    }
    default:
      return messageResponse("모르는 커맨드입니다.");
  }
}
