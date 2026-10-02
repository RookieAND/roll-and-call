"use client";

import { useRouter } from "next/navigation";

import { AddRulebookDialog } from "@/features/write-rulebook";
import type { RulebookRow } from "@/shared/server";
import { useServerPath } from "@/shared/ui";

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
  const toServerPath = useServerPath();
  return (
    <AddRulebookDialog
      key={`${open}-${initialCategory}`}
      open={open}
      rulebooks={rulebooks}
      initialCategory={initialCategory}
      onOpenChange={(nextOpen) =>
        nextOpen || router.replace(toServerPath(closeHref), { scroll: false })
      }
    />
  );
}
