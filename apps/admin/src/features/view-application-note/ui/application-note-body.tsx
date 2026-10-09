"use client";

import { Button, Callout, Skeleton, Text, VStack } from "@roll-and-call/ui";
import { useEffect, useState } from "react";

import { fetchApplicationNote } from "../api/fetch-application-note";

const NOTE_STATE = { loading: "loading", ready: "ready", failed: "failed" } as const;

type NoteState =
  | { kind: typeof NOTE_STATE.loading }
  | { kind: typeof NOTE_STATE.ready; note: string }
  | { kind: typeof NOTE_STATE.failed };

const SKELETON_WIDTHS = ["100%", "92%", "64%"];

interface ApplicationNoteBodyProps {
  gameId: string;
  userId: string;
}

export function ApplicationNoteBody({ gameId, userId }: ApplicationNoteBodyProps) {
  const [state, setState] = useState<NoteState>({ kind: NOTE_STATE.loading });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setState({ kind: NOTE_STATE.loading });
    fetchApplicationNote({ gameId, userId })
      .then((result) => {
        if (cancelled) return;
        setState(
          result.ok ? { kind: NOTE_STATE.ready, note: result.note } : { kind: NOTE_STATE.failed },
        );
      })
      .catch(() => !cancelled && setState({ kind: NOTE_STATE.failed }));
    return () => {
      cancelled = true;
    };
  }, [gameId, userId, attempt]);

  if (state.kind === NOTE_STATE.loading) {
    return (
      <VStack gap="125" aria-busy="true">
        <Text className="sr-only">신청글을 불러오는 중입니다</Text>
        {SKELETON_WIDTHS.map((width) => (
          <Skeleton key={width} width={width} height={20} />
        ))}
      </VStack>
    );
  }
  if (state.kind === NOTE_STATE.failed) {
    return (
      <VStack gap="125" align="start">
        <Callout.Root colorPalette="danger" size="sm" className="self-stretch">
          <Callout.Icon />
          <Callout.Title>신청글을 불러오지 못했습니다.</Callout.Title>
          <Callout.Description>다시 시도해 주세요.</Callout.Description>
        </Callout.Root>
        <Button
          variant="outline"
          colorPalette="gray"
          size="sm"
          onClick={() => setAttempt((count) => count + 1)}
        >
          다시 시도
        </Button>
      </VStack>
    );
  }
  return (
    <Text
      typography="body3"
      tabIndex={0}
      className="max-h-[40dvh] overflow-y-auto rounded-400 border border-gray-200 bg-gray-50 px-200 py-175 leading-[1.7] break-keep whitespace-pre-wrap"
    >
      {state.note}
    </Text>
  );
}
