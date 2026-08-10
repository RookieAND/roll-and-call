"use client";

import { useState, useTransition } from "react";
import { confirmSession } from "../api/confirm-session";

type Option = { iso: string; label: string };

export function ConfirmSessionForm({
  gameId,
  options,
}: {
  gameId: string;
  options: Option[];
}) {
  const [selected, setSelected] = useState(options[0]?.iso ?? "");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  if (options.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        아직 등록된 가능 시간이 없어 확정할 수 없어요.
      </p>
    );
  }

  function confirm() {
    setError(null);
    startTransition(async () => {
      const result = await confirmSession(gameId, selected);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">세션 시간 확정</label>
      <div className="flex items-center gap-2">
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
        >
          {options.map((o) => (
            <option key={o.iso} value={o.iso}>
              {o.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={confirm}
          disabled={pending}
          className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {pending ? "확정 중..." : "이 시간으로 확정"}
        </button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
