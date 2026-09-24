"use client";

import { Select } from "@roll-and-call/ui";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const ALL = "all";

interface UrlSelectProps {
  param: string;
  allLabel: string;
  options: { label: string; value: string }[];
  className?: string;
}

// 첫 칸(allLabel)은 쿼리를 지운다.
export function UrlSelect({ param, allLabel, options, className }: UrlSelectProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const items = [{ label: allLabel, value: ALL }, ...options];

  return (
    <div className={className}>
      <Select.Root
        items={items}
        value={searchParams.get(param) ?? ALL}
        onValueChange={(value) => {
          const next = new URLSearchParams(searchParams);
          if (value === ALL) next.delete(param);
          else next.set(param, value);
          router.replace(next.size ? `${pathname}?${next}` : pathname, { scroll: false });
        }}
      >
        <Select.Trigger className="whitespace-nowrap" />
        <Select.Popup>
          {items.map((item) => (
            <Select.Item key={item.value} value={item.value}>
              {item.label}
            </Select.Item>
          ))}
        </Select.Popup>
      </Select.Root>
    </div>
  );
}
