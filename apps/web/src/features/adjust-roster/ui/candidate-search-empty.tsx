import { Button, Text, VStack } from "@roll-and-call/ui";

import { comitativeParticle } from "@/shared/lib";
import { EmptyState } from "@/shared/ui";

interface CandidateSearchEmptyProps {
  keyword: string;
  onClear: () => void;
}

// 결과 영역만 바뀌고 검색 바는 그대로라, 머릿줄도 목록과 같은 자리에 "0명"으로 둔다.
export function CandidateSearchEmpty({ keyword, onClear }: CandidateSearchEmptyProps) {
  return (
    <VStack gap={0}>
      <Text typography="body4" weight="bold" foreground="hint" className="px-250 pb-100">
        검색 결과 0명
      </Text>
      <EmptyState
        size="section"
        image="/empty-states/empty-search.png"
        className="border-0 px-400 pt-075 pb-400"
        title={`‘${keyword}’${comitativeParticle(keyword)} 맞는 사람이 없습니다`}
        description={"닉네임 철자를 확인해 주세요.\n디스코드 아이디로도 찾을 수 있습니다."}
        action={
          <Button variant="outline" className="text-primary-ink" onClick={onClear}>
            검색어 지우기
          </Button>
        }
      />
    </VStack>
  );
}
