"use client";

import { Button, Select } from "@trpg/ui";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "@/shared/lib/toast";
import { confirmSession } from "../api/confirm-session";

type Option = { iso: string; label: string };

export function ConfirmSessionForm({
  gameId,
  options,
}: {
  gameId: string;
  options: Option[];
}) {
  const router = useRouter();
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
      if (result?.error) {
        setError(result.error);
        return;
      }
      toast.success("세션이 확정되었습니다");
      if (result?.redirect) router.push(result.redirect);
    });
  }

  return (
    <div className="rounded-[14px] border border-gray-200 p-4">
      <div className="text-sm font-bold">세션 확정</div>
      <p className="mt-1 mb-3 text-xs text-gray-500">
        겹치는 인원이 많은 순으로 후보를 보여줍니다.
      </p>
      <Select.Root
        items={options.map((o) => ({ label: o.label, value: o.iso }))}
        value={selected}
        onValueChange={setSelected}
      >
        <Select.Trigger />
        <Select.Popup>
          {options.map((o) => (
            <Select.Item key={o.iso} value={o.iso}>
              {o.label}
            </Select.Item>
          ))}
        </Select.Popup>
      </Select.Root>
      <Button
        variant="confirm"
        className="mt-3 h-[46px] w-full"
        loading={pending}
        onClick={confirm}
      >
        이 시간으로 확정
      </Button>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
