import { HStack, Text } from "@trpg/ui";
import { GameRoundBadge } from "@/entities/game";
import type { SessionCardModel } from "../model/session-card";
import { SessionBadge } from "./session-badge";

// 순수 표시: 제목 · 시간 배지 · 서브라인. 링크/동작 없음(감싸는 쪽이 소유).
// 진행 단계 단어(lead)는 배지가 아니라 서브라인 첫 토큰에 굵게 둔다.
export function SessionCard({ model }: { model: SessionCardModel }) {
  const cardClass = model.urgent
    ? "rounded-[13px] border-[1.5px] border-danger-300 bg-danger-50 p-3.5"
    : "rounded-[13px] border border-gray-200 p-3.5";

  return (
    <div className={cardClass}>
      <HStack justify="between" align="center" gap={2}>
        <HStack align="center" gap={2} className="min-w-0">
          <GameRoundBadge round={model.round} />
          <Text typography="subtitle1" className="truncate">
            {model.title}
          </Text>
        </HStack>
        <SessionBadge badge={model.badge} />
      </HStack>
      <Text
        typography="body4"
        foreground={model.dim ? "hint" : "muted"}
        className="mt-1 block truncate"
      >
        {model.lead && <b className="font-bold text-gray-600">{model.lead}</b>}
        {model.lead ? " · " : ""}
        {model.rest}
      </Text>
    </div>
  );
}
