"use client";

import { IconButton } from "@roll-and-call/ui";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { BACK_BUTTON_CLASS } from "./back-button-class";
import { navigationHistory } from "./navigation-history";

interface BackButtonProps {
  fallback: string;
}

export function BackButton({ fallback }: BackButtonProps) {
  const router = useRouter();

  return (
    <IconButton asChild variant="ghost" aria-label="뒤로" className={BACK_BUTTON_CLASS}>
      <Link
        href={fallback}
        onClick={(event) => {
          if (!navigationHistory.navigatedInApp) return;
          event.preventDefault();
          router.back();
        }}
      >
        <ChevronLeft size={22} />
      </Link>
    </IconButton>
  );
}
