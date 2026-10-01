"use client";

import { Button } from "@roll-and-call/ui";
import { useRouter } from "next/navigation";

import { navigationHistory } from "./navigation-history";
import { ServerLink } from "./server-link";

interface GoBackButtonProps {
  // 서버 화면이면 서버 안 경로("/games")다. slug는 ServerLink가 붙인다.
  fallback: string;
}

export function GoBackButton({ fallback }: GoBackButtonProps) {
  const router = useRouter();

  return (
    <Button
      variant="outline"
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
    >
      돌아가기
    </Button>
  );
}
