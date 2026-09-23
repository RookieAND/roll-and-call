"use client";

import { Button } from "@roll-and-call/ui";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { navigationHistory } from "./navigation-history";

interface GoBackButtonProps {
  fallback: string;
}

// 글자 버튼 "돌아가기". 앱 안에서 들어왔으면 뒤로, 아니면 폴백 주소로 간다(BackButton과 같은 규칙).
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
