"use client";

import { Button } from "@roll-and-call/ui";
import { useRouter } from "next/navigation";

export function ReloadButton() {
  const router = useRouter();
  return (
    <Button variant="outline" size="lg" className="w-full" onClick={() => router.refresh()}>
      다시 불러오기
    </Button>
  );
}
