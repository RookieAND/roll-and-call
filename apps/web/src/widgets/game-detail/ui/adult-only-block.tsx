import { GameTagBlock } from "./game-tag-block";

const ADULT_ONLY_LABEL = { on: "성인 전용", off: "전체 이용가" } as const;
const ADULT_ONLY_NOTE_LINES = ["서버 규칙에 따라 성인만 신청할 수 있습니다."] as const;

interface AdultOnlyBlockProps {
  adultOnly: boolean;
}

export function AdultOnlyBlock({ adultOnly }: AdultOnlyBlockProps) {
  return (
    <GameTagBlock
      label="성인 전용"
      tags={[adultOnly ? ADULT_ONLY_LABEL.on : ADULT_ONLY_LABEL.off]}
      noteLines={adultOnly ? ADULT_ONLY_NOTE_LINES : undefined}
    />
  );
}
