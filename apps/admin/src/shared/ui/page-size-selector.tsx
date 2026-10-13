"use client";

import { Select } from "@roll-and-call/ui";
import { ChevronDown } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from "@/shared/lib";

const ITEMS = PAGE_SIZE_OPTIONS.map((option) => ({
  label: `${option}개씩`,
  value: String(option),
}));

interface PageSizeSelectorProps {
  value: number;
}

export function PageSizeSelector({ value }: PageSizeSelectorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const changePageSize = (selected: string) => {
    const next = new URLSearchParams(searchParams);
    next.delete("page");
    if (Number(selected) === PAGE_SIZE) next.delete("pageSize");
    else next.set("pageSize", selected);
    router.replace(next.size ? `${pathname}?${next}` : pathname, { scroll: false });
  };

  return (
    <div className="w-[104px] shrink-0">
      <Select.Root items={ITEMS} value={String(value)} onValueChange={changePageSize}>
        <Select.Trigger
          aria-label="한 쪽에 보일 개수"
          icon={<ChevronDown size={14} aria-hidden />}
          className="h-8 whitespace-nowrap"
        />
        <Select.Popup>
          {ITEMS.map((item) => (
            <Select.Item key={item.value} value={item.value}>
              {item.label}
            </Select.Item>
          ))}
        </Select.Popup>
      </Select.Root>
    </div>
  );
}
