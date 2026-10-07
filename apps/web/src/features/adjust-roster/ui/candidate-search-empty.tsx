import { Button, Text, VStack } from "@roll-and-call/ui";

import { comitativeParticle } from "@/shared/lib";
import { EmptyState } from "@/shared/ui";

interface CandidateSearchEmptyProps {
  keyword: string;
  onClear: () => void;
}

export function CandidateSearchEmpty({ keyword, onClear }: CandidateSearchEmptyProps) {
  return (
    <VStack gap={0}>
      <Text typography="body4" weight="bold" foreground="hint" className="px-250 pb-100">
        검색 결과 0명
      </Text>
      <EmptyState
        size="section"
        image="empty-search"
        className="border-0 px-400 pt-075 pb-400"
        title={`${keyword}${comitativeParticle(keyword)} 맞는 사람이 없습니다`}
        description={
          <>
            닉네임 철자를 확인해 주세요.
            <br />
            디스코드 아이디로도 찾을 수 있습니다.
          </>
        }
        action={
          <Button variant="ghost" colorPalette="primary" size="sm" onClick={onClear}>
            검색어 지우기
          </Button>
        }
      />
    </VStack>
  );
}
