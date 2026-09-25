"use client";

import { useRouter } from "next/navigation";

import { AddRulebookDialog } from "@/features/write-rulebook";
import type { RulebookRow } from "@/shared/server";

interface AddRulebookRouteProps {
  open: boolean;
  rulebooks: RulebookRow[];
  initialCategory?: string;
  closeHref: string;
}

// 주소의 ?add=1로 연다(⌘K의 '룰북 추가하기'가 이 주소로 온다). 룰북 상세의 [이 카테고리에 책 추가]는 &category=를 붙인다.
export function AddRulebookRoute({
  open,
  rulebooks,
  initialCategory,
  closeHref,
}: AddRulebookRouteProps) {
  const router = useRouter();
  return (
    <AddRulebookDialog
      key={`${open}-${initialCategory}`}
      open={open}
      rulebooks={rulebooks}
      initialCategory={initialCategory}
      onOpenChange={(nextOpen) => nextOpen || router.replace(closeHref, { scroll: false })}
    />
  );
}
