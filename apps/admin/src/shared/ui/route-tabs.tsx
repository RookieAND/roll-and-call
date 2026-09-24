"use client";

import { SegmentedControl } from "@roll-and-call/ui";
import { useRouter } from "next/navigation";

interface RouteSegmentsProps {
  label: string;
  items: { label: string; href: string }[];
  value: string;
}

// 머리말 아래의 세그먼트. 칸마다 다른 주소로 옮겨 간다.
export function RouteSegments({ label, items, value }: RouteSegmentsProps) {
  const router = useRouter();
  return (
    <div className="border-b border-gray-200 bg-surface px-225 py-100">
      <SegmentedControl.Root
        size="sm"
        value={value}
        onValueChange={(href) => router.push(href)}
        aria-label={label}
      >
        {items.map((item) => (
          <SegmentedControl.Item key={item.href} value={item.href} className="text-body3">
            {item.label}
          </SegmentedControl.Item>
        ))}
      </SegmentedControl.Root>
    </div>
  );
}
