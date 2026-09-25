"use client";

import { Select } from "@roll-and-call/ui";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const ALL = "all";

interface UrlSelectProps {
  param: string;
  allLabel: string;
  options: { label: string; value: string }[];
  // 쿼리가 없을 때 고른 것으로 보이는 값. 이때 첫 칸은 all을 쿼리에 남긴다.
  defaultValue?: string;
  className?: string;
}

// 첫 칸(allLabel)은 쿼리를 지운다.
export function UrlSelect({ param, allLabel, options, defaultValue, className }: UrlSelectProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const items = [{ label: allLabel, value: ALL }, ...options];

  return (
    <div className={className}>
      <Select.Root
        items={items}
        value={searchParams.get(param) ?? defaultValue ?? ALL}
        onValueChange={(value) => {
          const next = new URLSearchParams(searchParams);
          next.delete("page");
          if (value === (defaultValue ?? ALL)) next.delete(param);
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
