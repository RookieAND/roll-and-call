import { HStack } from "@trpg/ui";

import { GameGmLabel, GameRuleChip } from "@/entities/game";

import type { SessionCardModel } from "../model/session-card-model";
import { SessionCountChip } from "./session-count-chip";

interface SessionCardMetaProps {
  model: SessionCardModel;
  dim: boolean;
}

// 룰 · GM · 숫자는 모양이 서로 달라야 훑어도 구분된다. 숫자는 오른쪽 끝에 붙어 카드끼리 세로로 맞는다.
export function SessionCardMeta({ model, dim }: SessionCardMetaProps) {
  const gmForeground = dim ? "hint" : "muted";

  return (
    <HStack align="center" gap="125" className="mt-150 border-t border-gray-100 pt-150">
      <GameRuleChip rule={model.rule} dim={dim} />
      {model.gm && (
        <GameGmLabel
          name={model.gm.username}
          avatarUrl={model.gm.avatarUrl}
          typography="body4"
          weight="medium"
          foreground={gmForeground}
        />
      )}
      <HStack align="center" gap="075" className="ml-auto flex-none">
        {model.counts.map((count) => (
          <SessionCountChip key={`${count.label}-${count.value}`} count={count} dim={dim} />
        ))}
      </HStack>
    </HStack>
  );
}
