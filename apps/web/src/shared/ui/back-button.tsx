"use client";

import { IconButton } from "@roll-and-call/ui";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import { BACK_BUTTON_CLASS } from "./back-button-class";
import { navigationHistory } from "./navigation-history";
import { ServerLink } from "./server-link";

interface BackButtonProps {
  // 서버 화면이면 서버 안 경로("/games")다. slug는 ServerLink가 붙인다.
  fallback: string;
}

export function BackButton({ fallback }: BackButtonProps) {
  const router = useRouter();

  return (
    <IconButton
      render={
        <ServerLink
          path={fallback}
          onClick={(event) => {
            if (!navigationHistory.navigatedInApp) return;
            event.preventDefault();
            router.back();
          }}
        />
      }
      variant="ghost"
      aria-label="뒤로"
      className={BACK_BUTTON_CLASS}
    >
      <ChevronLeft size={22} />
    </IconButton>
  );
}
