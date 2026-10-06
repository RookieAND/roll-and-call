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
  // false면 이동 기록과 상관없이 항상 fallback 경로로 간다.
  useHistory?: boolean;
}

export function BackButton({ fallback, useHistory = true }: BackButtonProps) {
  const router = useRouter();

  return (
    <IconButton
      render={
        <ServerLink
          path={fallback}
          onClick={(event) => {
            if (!useHistory || !navigationHistory.navigatedInApp) return;
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
