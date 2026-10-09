"use client";

import { useEffect, useEffectEvent, useState } from "react";
import { z } from "zod";

import { parseJson, richTextLength } from "@/shared/lib";

const reviewDraftSchema = z.object({ body: z.string(), spoiler: z.boolean() });

type ReviewDraft = z.infer<typeof reviewDraftSchema>;

const storageKey = (gameId: string) => `review-draft:${gameId}`;

// 새로 쓰는 글만 이 기기에 임시 저장한다. 사진은 저장하지 않는다(나가면 지운다).
// 저장소를 못 쓰는 환경(사생활 보호 창 등)에서는 조용히 넘어간다.
export function useReviewDraft({
  gameId,
  enabled,
  onRestore,
}: {
  gameId: string;
  enabled: boolean;
  onRestore: (draft: ReviewDraft) => void;
}) {
  const [restored, setRestored] = useState(false);
  // 폼이 매 렌더 새로 만드는 콜백을 따라 다시 불러오면 쓰던 글을 덮으므로 처음 열 때 한 번만 부른다.
  const restore = useEffectEvent(onRestore);

  useEffect(() => {
    if (!enabled) return;
    try {
      const draft = parseJson(reviewDraftSchema, localStorage.getItem(storageKey(gameId)));
      if (!draft || !richTextLength(draft.body)) return;
      restore(draft);
      setRestored(true);
    } catch {}
  }, [gameId, enabled]);

  function save(draft: ReviewDraft) {
    if (!enabled) return;
    try {
      if (richTextLength(draft.body))
        localStorage.setItem(storageKey(gameId), JSON.stringify(draft));
      else localStorage.removeItem(storageKey(gameId));
    } catch {}
  }

  function clear() {
    setRestored(false);
    try {
      localStorage.removeItem(storageKey(gameId));
    } catch {}
  }

  return { restored, save, clear };
}
