"use client";

import { UNDO_WINDOW_MS } from "@roll-and-call/database/notifications/model";
import { Button, Callout, HStack, Sheet, VStack } from "@roll-and-call/ui";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { SheetCloseIcon, toast, useAction, useDebouncedValue } from "@/shared/ui";

import { addLateParticipant } from "../api/add-late-participant";
import { undoLateParticipant } from "../api/undo-late-participant";
import type { Candidate } from "../model/candidate";
import { candidateSearchQuery } from "../model/candidate-search-query";
import { searchKeyword } from "../model/search-keyword";
import { CandidateSearchInput } from "./candidate-search-input";
import { CandidateSearchResults } from "./candidate-search-results";

const MIN_QUERY_LENGTH = 1;
const SEARCH_DELAY_MS = 300;
const NOTICE_LINES = [
  "추가한 만큼 정원이 늘어납니다.",
  "중간에 합류한 참여자는 출석한 회차가 순위에 들어가고, 완주로는 인정되지 않습니다.",
];

interface LateJoinSheetProps {
  gameId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// 다회차 1회차 시작 뒤 [참여자 추가]. 서버 멤버 한 명을 골라 넣고, 토스트의 [되돌리기]로 되돌릴 수 있다.
export function LateJoinSheet({ gameId, open, onOpenChange }: LateJoinSheetProps) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Candidate | null>(null);
  const { pending, run } = useAction();
  const keyword = searchKeyword(query);
  const debouncedKeyword = useDebouncedValue({ value: keyword, delay: SEARCH_DELAY_MS });
  const typedEnough = keyword.length >= MIN_QUERY_LENGTH;
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

  function reset(nextOpen: boolean) {
    if (!nextOpen) {
      setQuery("");
      setSelected(null);
    }
    onOpenChange(nextOpen);
  }

  function toggle(candidate: Candidate) {
    setSelected((current) => (current?.userId === candidate.userId ? null : candidate));
  }

  function undo({ picked, notificationIds }: { picked: Candidate; notificationIds: string[] }) {
    run(() => undoLateParticipant({ gameId, userId: picked.userId, notificationIds }), {
      onSuccess: () => toast.success(`${picked.username}님 추가를 되돌렸습니다.`),
    });
  }

  function add() {
    if (!selected) return;
    const picked = selected;
    run(() => addLateParticipant({ gameId, userId: picked.userId }), {
      onSuccess: (result) => {
        reset(false);
        toast.success(`${picked.username}님이 참여자로 추가되었습니다.`, {
          duration: UNDO_WINDOW_MS,
          action: {
            label: "되돌리기",
            onClick: () => undo({ picked, notificationIds: result.notificationIds ?? [] }),
          },
        });
      },
    });
  }

  return (
    <Sheet.Root open={open} onOpenChange={reset}>
      <Sheet.Popup className="max-h-[85dvh] overflow-y-auto px-0 pb-0">
        <Sheet.Handle />
        <VStack gap="150">
          <HStack align="center" className="px-250">
            <Sheet.Title className="mb-0 flex-1">참여자 추가</Sheet.Title>
            <SheetCloseIcon />
          </HStack>
          <div className="px-250">
            <Callout.Root colorPalette="gray" size="sm">
              <Callout.Icon />
              <Callout.Description>
                {NOTICE_LINES[0]}
                <br />
                {NOTICE_LINES[1]}
              </Callout.Description>
            </Callout.Root>
          </div>
          <div className="px-250">
            <CandidateSearchInput value={query} onChange={setQuery} />
          </div>
          <CandidateSearchResults
            typedEnough={typedEnough}
            searching={searching}
            isError={isError}
            keyword={keyword}
            candidates={results ?? []}
            selected={selected ? [selected] : []}
            noSeats={false}
            seatsFilled={Boolean(selected)}
            onClear={() => setQuery("")}
            onToggle={toggle}
          />
          <div className="sticky bottom-0 border-t border-gray-100 bg-surface px-250 pt-150 pb-250">
            <Button
              size="lg"
              className="w-full"
              disabled={!selected}
              loading={pending}
              onClick={add}
            >
              추가하기
            </Button>
          </div>
        </VStack>
      </Sheet.Popup>
    </Sheet.Root>
  );
}
