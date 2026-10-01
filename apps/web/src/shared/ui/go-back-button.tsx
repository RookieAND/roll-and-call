"use client";

import { Button } from "@roll-and-call/ui";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { navigationHistory } from "./navigation-history";

interface GoBackButtonProps {
  fallback: string;
}

export function GoBackButton({ fallback }: GoBackButtonProps) {
  const router = useRouter();

  return (
    <Button
      variant="outline"
      render={
        <Link
          href={fallback}
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
