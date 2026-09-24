"use client";

import { useRouter } from "next/navigation";

import { AddRulebookDialog } from "@/features/write-rulebook";

interface AddRulebookRouteProps {
  open: boolean;
  closeHref: string;
}

// 주소의 ?add=1로 연다(⌘K의 '룰북 추가하기'가 이 주소로 온다).
export function AddRulebookRoute({ open, closeHref }: AddRulebookRouteProps) {
  const router = useRouter();
  return (
    <AddRulebookDialog
      key={String(open)}
      open={open}
      onOpenChange={(nextOpen) => nextOpen || router.replace(closeHref, { scroll: false })}
    />
  );
}
