"use client";

import { useState, useTransition } from "react";
import type { JoinActionResult } from "../api/join-game";

type Props = {
  gameId: string;
  action: (gameId: string) => Promise<JoinActionResult>;
  label: string;
  variant?: "primary" | "danger";
};

const variantClass = {
  primary: "bg-black text-white hover:bg-gray-800",
  danger: "border border-red-300 text-red-600 hover:bg-red-50",
} as const;

export function JoinButton({ gameId, action, label, variant = "primary" }: Props) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onClick() {
    setError(null);
    startTransition(async () => {
      const result = await action(gameId);
      if (result.error) setError(result.error);
    });
  }

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={onClick}
        disabled={pending}
        className={`rounded-md px-4 py-2 font-medium disabled:opacity-50 ${variantClass[variant]}`}
      >
        {pending ? "처리 중..." : label}
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
