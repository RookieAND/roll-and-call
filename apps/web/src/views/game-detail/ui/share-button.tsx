"use client";

import { IconButton } from "@roll-and-call/ui";
import { isFunction } from "es-toolkit";
import { Share2 } from "lucide-react";

import { useServerPath } from "@/shared/lib";
import { toast } from "@/shared/ui";

interface ShareButtonProps {
  gameId: string;
  title: string;
}

// 기기 공유 시트가 있으면 그것을 열고, 없을 때만 주소를 복사한다. 사용자가 공유 시트를 닫은 것은 오류가 아니다(R21).
export function ShareButton({ gameId, title }: ShareButtonProps) {
  const toServerPath = useServerPath();

  async function share() {
    const url = `${window.location.origin}${toServerPath(`/games/${gameId}`)}`;
    if (isFunction(navigator.share)) {
      try {
        await navigator.share({ title, url });
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          toast.error("링크를 공유하지 못했습니다");
        }
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      toast.success("구인글 링크를 복사했습니다");
    } catch {
      toast.error("링크를 복사하지 못했습니다");
    }
  }

  return (
    <IconButton variant="ghost" aria-label="공유" onClick={share}>
      <Share2 size={20} />
    </IconButton>
  );
}
