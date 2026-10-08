import { Text, VStack } from "@roll-and-call/ui";

interface GmTopCardProps {
  rank: number;
  nickname: string;
  count: number;
  share: number;
  colorVariable: string;
}

export function GmTopCard({ rank, nickname, count, share, colorVariable }: GmTopCardProps) {
  return (
    <VStack gap="025" className="rounded-400 border border-gray-200 px-150 py-125">
      <Text typography="body4" foreground="muted" className="flex items-center gap-075">
        <span
          aria-hidden
          className="size-[10px] shrink-0 rounded-100"
          style={{ background: `var(${colorVariable})` }}
        />
        {rank}위 · {nickname}
      </Text>
      <Text typography="subtitle2" numeric>
        {count}건
      </Text>
      <Text typography="body5" foreground="hint">
        전체의 {share}%
      </Text>
    </VStack>
  );
}
