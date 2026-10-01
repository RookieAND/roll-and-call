"use client";

import { Button, HStack, Sheet, Text, VStack } from "@roll-and-call/ui";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { toast, useAction, useDebouncedValue } from "@/shared/ui";

import { addParticipants } from "../api/add-participants";
import type { Candidate } from "../model/candidate";
import { candidateSearchQuery } from "../model/candidate-search-query";
import { searchKeyword } from "../model/search-keyword";
import { CandidateSearchInput } from "./candidate-search-input";
import { CandidateSearchResults } from "./candidate-search-results";
import { SeatsFullNotice } from "./seats-full-notice";
import { seatsStatus } from "./seats-status";
import { SelectedCandidateChip } from "./selected-candidate-chip";

const MIN_QUERY_LENGTH = 2;
const SEARCH_DELAY_MS = 300;

interface DirectConfirmSheetBaseProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  confirmedCount: number;
  maxPlayers: number;
}

type DirectConfirmSheetProps = DirectConfirmSheetBaseProps &
  (
    | { gameId: string; onPick?: never; excludeIds?: never }
    | { gameId?: never; onPick: (candidates: Candidate[]) => void; excludeIds: readonly string[] }
  );

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
  const debouncedKeyword = useDebouncedValue({ value: keyword, delay: SEARCH_DELAY_MS });
  const typedEnough = keyword.length >= MIN_QUERY_LENGTH;
  // 검색 실패로 시트 밖 화면까지 에러 경계로 넘기지 않고, 목록 자리에 한 줄로 알린다.
  const {
    data: results,
    isPending,
    isError,
  } = useQuery({
    ...candidateSearchQuery({ gameId, keyword: debouncedKeyword }),
    enabled: debouncedKeyword.length >= MIN_QUERY_LENGTH,
    throwOnError: false,
  });
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
    run(() => addParticipants({ gameId, userIds: selected.map((candidate) => candidate.userId) }), {
      onSuccess: () => {
        toast.success(
          selected.length === 1
            ? `${selected[0]!.username}님을 참여자로 넣었습니다`
            : `${selected.length}명을 참여자로 넣었습니다`,
        );
        reset(false);
      },
    });
  }

  const seats = seatsStatus({ openSeats, pickedCount: selected.length });

  return (
    <Sheet.Root open={open} onOpenChange={reset}>
      <Sheet.Popup className="max-h-[85dvh] overflow-y-auto px-0 pb-0">
        <Sheet.Handle />
        <VStack gap="150">
          <HStack align="baseline" gap="100" className="px-250">
            <Sheet.Title className="mb-0 flex-1">참여자 찾기</Sheet.Title>
            <Text numeric typography="body4" weight="bold" foreground={seats.foreground}>
              {seats.label}
            </Text>
          </HStack>

          {noSeats && gameId && <SeatsFullNotice />}

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
            <CandidateSearchInput value={query} onChange={setQuery} disabled={noSeats} />
          </div>

          <CandidateSearchResults
            typedEnough={typedEnough}
            searching={searching}
            isError={isError}
            keyword={keyword}
            candidates={shown}
            selected={selected}
            noSeats={noSeats}
            seatsFilled={seatsFilled}
            onClear={() => setQuery("")}
            onToggle={toggle}
          />

          <div className="sticky bottom-0 border-t border-gray-100 bg-surface px-250 pt-150 pb-250">
            <Button
              size="lg"
              className="w-full"
              disabled={selected.length === 0}
              loading={pending}
              onClick={confirm}
            >
              {selected.length > 0 ? `${selected.length}명 확정하기` : "확정하기"}
            </Button>
          </div>
        </VStack>
      </Sheet.Popup>
    </Sheet.Root>
  );
}
