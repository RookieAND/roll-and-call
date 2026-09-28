"use client";

import { useEffect, useState } from "react";

type ReviewDraft = { body: string; spoiler: boolean };

const storageKey = (gameId: string) => `review-draft:${gameId}`;

// 새로 쓰는 글만 이 기기에 임시 저장한다. 사진은 저장하지 않는다(나가면 지운다).
// 저장소를 못 쓰는 환경(사생활 보호 창 등)에서는 조용히 넘어간다.
export function useReviewDraft(
  gameId: string,
  enabled: boolean,
  onRestore: (draft: ReviewDraft) => void,
) {
  const [restored, setRestored] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    try {
      const saved = localStorage.getItem(storageKey(gameId));
      const draft = saved ? (JSON.parse(saved) as ReviewDraft) : null;
      if (!draft?.body.trim()) return;
      onRestore(draft);
      setRestored(true);
    } catch {}
    // oxlint-disable-next-line react-hooks/exhaustive-deps -- 처음 열 때 한 번만 불러온다. 폼이 매 렌더 새로 만드는 콜백을 따라 다시 부르면 쓰던 글을 덮는다.
  }, [gameId, enabled]);

  function save(draft: ReviewDraft) {
    if (!enabled) return;
    try {
      if (draft.body.trim()) localStorage.setItem(storageKey(gameId), JSON.stringify(draft));
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
