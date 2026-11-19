import { Text, Tooltip, VStack } from "@roll-and-call/ui";
import { Info } from "lucide-react";

const MULTI_ROUND_HINT = "여러 번 나눠 진행한 세션은 마지막 회차까지 함께하면 1개로 셉니다.";

interface SessionCountValueProps {
  attendedRoundCount: number;
  playedCount: number;
}

export function SessionCountValue({ attendedRoundCount, playedCount }: SessionCountValueProps) {
  return (
    <VStack gap="025">
      <span>참여 {attendedRoundCount}회</span>
      <Text
        typography="body3"
        weight="medium"
        numeric
        render={<span />}
        className="inline-flex items-center gap-050"
      >
        완주한 세션 {playedCount}개
        <Tooltip content={MULTI_ROUND_HINT}>
          <button type="button" aria-label="세션 집계 안내" className="inline-flex text-hint">
            <Info size={14} aria-hidden />
          </button>
        </Tooltip>
      </Text>
    </VStack>
  );
}
