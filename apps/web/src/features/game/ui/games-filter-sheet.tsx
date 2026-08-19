"use client";

import { Button, Chip } from "@trpg/ui";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Sheet } from "@/shared/ui/sheet";

const SORT = [
  { key: undefined, label: "최신순" },
  { key: "deadline", label: "마감 임박순" },
] as const;

type Props = { q?: string; status?: string; sort?: string };

export function GamesFilterSheet({ q, status, sort }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [so, setSo] = useState<string | undefined>(sort);

  const currentLabel = SORT.find((o) => o.key === sort)?.label ?? "최신순";

  function apply(next: string | undefined = so) {
    const sp = new URLSearchParams();
    if (q) sp.set("q", q);
    if (status) sp.set("status", status);
    if (next) sp.set("sort", next);
    const query = sp.toString();
    router.push(query ? `/games?${query}` : "/games");
    setOpen(false);
  }

  return (
    <>
      <Button
        variant="ghost"
        onClick={() => {
          setSo(sort);
          setOpen(true);
        }}
        className="h-auto shrink-0 px-0 text-[12.5px] font-semibold text-gray-700 hover:bg-transparent"
      >
        {currentLabel} ▾
      </Button>

      <Sheet.Root open={open} onOpenChange={setOpen}>
        <Sheet.Content>
          <div className="mb-1 text-xs font-bold text-gray-500">정렬</div>
          <div className="flex flex-col gap-2">
            {SORT.map((o) => (
              <Chip
                key={o.label}
                shape="block"
                selected={so === o.key}
                onClick={() => setSo(o.key)}
                className="w-full justify-start px-3.5"
              >
                {o.label}
              </Chip>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <Button
              variant="outline"
              className="w-[104px]"
              onClick={() => apply(undefined)}
            >
              초기화
            </Button>
            <Button className="flex-1" onClick={() => apply()}>
              적용하기
            </Button>
          </div>
        </Sheet.Content>
      </Sheet.Root>
    </>
  );
}
