"use client";

import { Select } from "@roll-and-call/ui";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const ALL = "all";

interface UrlSelectProps {
  param: string;
  allLabel: string;
  options: { label: string; value: string }[];
  defaultValue?: string;
  className?: string;
}

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
