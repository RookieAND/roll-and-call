"use client";

import { Button } from "@trpg/ui";

import { toast } from "@/shared/ui";

interface CopyLinkButtonProps {
  gameId: string;
}

export function CopyLinkButton({ gameId }: CopyLinkButtonProps) {
  async function copy() {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/games/${gameId}`);
      toast.success("구인글 링크를 복사했습니다");
    } catch {
      toast.error("링크를 복사하지 못했습니다");
    }
  }

  return (
    <Button className="h-11 w-full" onClick={copy}>
      링크 복사
    </Button>
  );
}
