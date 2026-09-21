"use client";

import { useQuery } from "@tanstack/react-query";
import { Button, HStack, Text, VStack, cn } from "@trpg/ui";
import { useState } from "react";

import { Sheet, toast, useAction, useDebouncedValue } from "@/shared/ui";

import { addParticipants } from "../api/add-participants";
import type { Candidate } from "../model/candidate";
import { candidateSearchQuery } from "../model/candidate-search-query";
import { searchKeyword } from "../model/search-keyword";
import { CandidateRow } from "./candidate-row";
import { CandidateSearchEmpty } from "./candidate-search-empty";
import { CandidateSearchInput } from "./candidate-search-input";
import { CandidateSearchSkeleton } from "./candidate-search-skeleton";
import { SeatsFullNotice } from "./seats-full-notice";
import { SelectedCandidateChip } from "./selected-candidate-chip";

const MIN_QUERY_LENGTH = 2;
const SEARCH_DELAY_MS = 300;

interface DirectConfirmSheetBaseProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  confirmedCount: number;
  maxPlayers: number;
}

// 게임이 있으면 바로 확정하고, 구인 등록처럼 게임이 없으면 고른 사람만 돌려준다.
type DirectConfirmSheetProps = DirectConfirmSheetBaseProps &
  (
    | { gameId: string; onPick?: never; excludeIds?: never }
    | { gameId?: never; onPick: (candidates: Candidate[]) => void; excludeIds: readonly string[] }
  );

// 열자마자 검색에 집중하도록 목록을 미리 채우지 않는다. 남은 자리만큼만 고를 수 있다.
export function DirectConfirmSheet({
  gameId,
  onPick,
  excludeIds,
  open,
  onOpenChange,
  confirmedCount,
  maxPlayers,
}: DirectConfirmSheetProps) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Candidate[]>([]);
  const { pending, run } = useAction();

  const openSeats = Math.max(maxPlayers - confirmedCount, 0);
  const noSeats = openSeats === 0;
  const seatsFilled = selected.length >= openSeats;
  const keyword = searchKeyword(query);
  const debouncedKeyword = useDebouncedValue(keyword, SEARCH_DELAY_MS);
  const typedEnough = keyword.length >= MIN_QUERY_LENGTH;
  // 검색 실패로 시트 밖 화면까지 에러 경계로 넘기지 않고, 목록 자리에 한 줄로 알린다.
  const {
    data: results,
    isPending,
    isError,
  } = useQuery({
    ...candidateSearchQuery(gameId, debouncedKeyword),
    enabled: debouncedKeyword.length >= MIN_QUERY_LENGTH,
    throwOnError: false,
  });
  // 입력이 멈추길 기다리는 동안과 새 검색어의 결과가 오기 전까지는 뼈대를 보여 준다.
  const searching = typedEnough && (debouncedKeyword !== keyword || isPending);
  const shown = results?.filter((candidate) => !excludeIds?.includes(candidate.userId)) ?? [];

  function reset(nextOpen: boolean) {
    if (!nextOpen) {
      setQuery("");
      setSelected([]);
    }
    onOpenChange(nextOpen);
  }

  function toggle(candidate: Candidate) {
    setSelected((current) =>
      current.some((picked) => picked.userId === candidate.userId)
        ? current.filter((picked) => picked.userId !== candidate.userId)
        : [...current, candidate],
    );
  }

  function confirm() {
    if (!gameId) {
      onPick?.(selected);
      reset(false);
      return;
    }
    run(
      () =>
        addParticipants(
          gameId,
          selected.map((candidate) => candidate.userId),
        ),
      {
        onSuccess: () => {
          toast.success(
            selected.length === 1
              ? `${selected[0]!.username}님을 참여자로 넣었습니다`
              : `${selected.length}명을 참여자로 넣었습니다`,
          );
          reset(false);
        },
      },
    );
  }

  const seatsLabel = noSeats
    ? `${maxPlayers}자리 모두 찼음`
    : seatsFilled
      ? `${openSeats}자리 모두 채움`
      : `${maxPlayers}자리 중 ${openSeats - selected.length}자리 남음`;

  return (
    <Sheet.Root open={open} onOpenChange={reset}>
      <Sheet.Content className="max-h-[85dvh] overflow-y-auto px-0 pb-0">
        <VStack gap="150">
          <HStack align="baseline" gap="100" className="px-250">
            <Sheet.Title className="mb-0 flex-1 text-heading3 font-extrabold text-gray-900">
              참여자 찾기
            </Sheet.Title>
            <Text
              numeric
              typography="body4"
              weight="bold"
              className={cn(
                "text-gray-600",
                noSeats && "text-warning-600",
                !noSeats && seatsFilled && "text-primary-ink",
              )}
            >
              {seatsLabel}
            </Text>
          </HStack>

          {noSeats && gameId && <SeatsFullNotice gameId={gameId} onClose={() => reset(false)} />}

          {selected.length > 0 && (
            <HStack gap="075" wrap className="px-250">
              {selected.map((candidate) => (
                <SelectedCandidateChip
                  key={candidate.userId}
                  candidate={candidate}
                  onRemove={() => toggle(candidate)}
                />
              ))}
            </HStack>
          )}

          <div className="px-250">
            <CandidateSearchInput value={query} onChange={setQuery} />
          </div>

          {!typedEnough ? (
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
          ) : searching ? (
            <CandidateSearchSkeleton />
          ) : isError ? (
            <Text
              typography="body3"
              foreground="danger"
              render={<p />}
              className="px-400 pt-150 pb-500 text-center"
            >
              사람을 찾지 못했습니다. 잠시 뒤 다시 적어 주세요.
            </Text>
          ) : shown.length === 0 ? (
            <CandidateSearchEmpty keyword={keyword} onClear={() => setQuery("")} />
          ) : (
            <VStack gap={0} className="pb-125">
              <Text typography="body4" weight="bold" foreground="hint" className="px-250 pb-100">
                검색 결과 {shown.length}명
              </Text>
              {/* 줄 높이 62px × 4줄까지만 보이고 나머지는 목록 안에서 스크롤한다. */}
              <VStack gap={0} className="max-h-[248px] overflow-y-auto overscroll-contain">
                {shown.map((candidate) => {
                  const picked = selected.some((choice) => choice.userId === candidate.userId);
                  return (
                    <CandidateRow
                      key={candidate.userId}
                      candidate={candidate}
                      picked={picked}
                      capped={noSeats || (!picked && seatsFilled)}
                      onToggle={() => toggle(candidate)}
                    />
                  );
                })}
              </VStack>
            </VStack>
          )}

          <div className="sticky bottom-0 border-t border-gray-100 bg-surface px-250 pt-150 pb-250">
            <Button
              className="h-12 w-full rounded-500"
              disabled={selected.length === 0}
              loading={pending}
              onClick={confirm}
            >
              {selected.length > 0 ? `${selected.length}명 확정하기` : "확정하기"}
            </Button>
          </div>
        </VStack>
      </Sheet.Content>
    </Sheet.Root>
  );
}
