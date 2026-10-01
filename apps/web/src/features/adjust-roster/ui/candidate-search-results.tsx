import { Card, Text, VStack } from "@roll-and-call/ui";

import type { Candidate } from "../model/candidate";
import { CandidateRow } from "./candidate-row";
import { CandidateSearchEmpty } from "./candidate-search-empty";
import { CandidateSearchSkeleton } from "./candidate-search-skeleton";

interface CandidateSearchResultsProps {
  typedEnough: boolean;
  searching: boolean;
  isError: boolean;
  keyword: string;
  candidates: Candidate[];
  selected: Candidate[];
  noSeats: boolean;
  seatsFilled: boolean;
  onClear: () => void;
  onToggle: (candidate: Candidate) => void;
}

export function CandidateSearchResults({
  typedEnough,
  searching,
  isError,
  keyword,
  candidates,
  selected,
  noSeats,
  seatsFilled,
  onClear,
  onToggle,
}: CandidateSearchResultsProps) {
  if (!typedEnough) {
    return (
      <Text
        typography="body3"
        foreground="hint"
        render={<p />}
        className="px-400 pt-150 pb-500 text-center"
      >
        함께할 사람의 닉네임이나 디스코드 아이디를 적어 주세요.
        <br />
        두 글자부터 찾기 시작합니다.
      </Text>
    );
  }
  if (searching) return <CandidateSearchSkeleton />;
  if (isError) {
    return (
      <Text
        typography="body3"
        foreground="danger"
        render={<p />}
        className="px-400 pt-150 pb-500 text-center"
      >
        사람을 찾지 못했습니다. 잠시 뒤 다시 적어 주세요.
      </Text>
    );
  }
  if (candidates.length === 0) return <CandidateSearchEmpty keyword={keyword} onClear={onClear} />;

  return (
    <VStack gap={0} className="pb-125">
      <Text typography="body4" weight="bold" foreground="hint" className="px-250 pb-100">
        검색 결과 {candidates.length}명
      </Text>
      {/* 줄 높이 60px × 4줄까지만 보이고 나머지는 목록 안에서 스크롤한다. */}
      <Card.Root
        padding="none"
        radius={500}
        className="mx-250 max-h-60 overflow-y-auto overscroll-contain [&>*+*]:border-t [&>*+*]:border-gray-200"
      >
        {candidates.map((candidate) => {
          const picked = selected.some((choice) => choice.userId === candidate.userId);
          return (
            <CandidateRow
              key={candidate.userId}
              candidate={candidate}
              picked={picked}
              capped={noSeats || (!picked && seatsFilled)}
              onToggle={() => onToggle(candidate)}
            />
          );
        })}
      </Card.Root>
      {seatsFilled && !noSeats && (
        <Text typography="body4" foreground="hint" render={<p />} className="px-250 pt-100">
          남은 자리를 모두 채웠습니다.
        </Text>
      )}
    </VStack>
  );
}
