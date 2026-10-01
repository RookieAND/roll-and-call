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
