"use client";

import { Button, Text, cn } from "@trpg/ui";
import { useState, useTransition } from "react";
import { toast } from "@/shared/lib/toast";
import type { JoinActionResult } from "../api/join-game";

type Props = {
  gameId: string;
  action: (gameId: string) => Promise<JoinActionResult>;
  label: string;
  variant?: "primary" | "outline";
  successMessage: string;
  className?: string;
};

export function JoinButton({
  gameId,
  action,
  label,
  variant = "primary",
  successMessage,
  className,
}: Props) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const buttonVariant = variant === "outline" ? "outline" : "solid";

  function onClick() {
    setError(null);
    startTransition(async () => {
      const result = await action(gameId);
      if (result.error) setError(result.error);
      else toast.success(successMessage);
    });
  }

  return (
    <div className="flex flex-col gap-1">
      <Button
        variant={buttonVariant}
        size="lg"
        className={cn("w-full", className)}
        loading={pending}
        onClick={onClick}
      >
        {label}
      </Button>
      {error && (
        <Text typography="body2" foreground="danger">
          {error}
        </Text>
      )}
    </div>
  );
}
