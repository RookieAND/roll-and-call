import { Text } from "@trpg/ui";
import { Box, Crown } from "lucide-react";

import { PLAY_STANCE, type PlayStance } from "@/entities/profile";

// 라벨만 있으면 무엇으로 정했는지 알 수 없어 근거 숫자를 옆에 같이 쓴다.
export function PlayStanceBox({
  label,
  hosted,
  played,
}: {
  label: PlayStance;
  hosted: number;
  played: number;
}) {
  const isGm = label === PLAY_STANCE.gm;
  const Icon = isGm ? Crown : Box;
  const title = isGm ? "GM 성향" : "Player 성향";
  const basis = isGm ? `진행 ${hosted} · 참여 ${played}` : `참여 ${played} · 진행 ${hosted}`;

  return (
    <div className="mt-3 flex items-center gap-2 rounded-[11px] border border-gray-200 px-3 py-2.5">
      <Icon size={16} className="flex-none text-primary-ink" aria-hidden />
      <Text typography="body3" className="min-w-0 flex-1 font-bold text-gray-700">
        {title}
      </Text>
      <Text typography="body4" foreground="hint" className="flex-none text-[12.5px] tabular-nums">
        {basis}
      </Text>
    </div>
  );
}
