"use client";

import { Chip, HStack } from "@roll-and-call/ui";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { ALL_AUDIT_PERIOD, AUDIT_PERIODS } from "@/entities/audit";

interface PeriodChipsProps {
  defaultPeriod: string;
}

const CHOICES = [
  ...AUDIT_PERIODS.map(({ label, value }) => ({ label, value: value as string })),
  { label: "전체 기간", value: ALL_AUDIT_PERIOD as string },
];

// 데스크톱의 기간 선택 상자를 한 줄 칩으로 바꾼다(주소 값은 같다).
export function PeriodChips({ defaultPeriod }: PeriodChipsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get("period") ?? defaultPeriod;

  const choose = (value: string) => {
    const next = new URLSearchParams(searchParams);
    next.delete("page");
    if (value === defaultPeriod) next.delete("period");
    else next.set("period", value);
    router.replace(next.size ? `${pathname}?${next}` : pathname, { scroll: false });
  };

  return (
    <HStack gap="075" className="-mx-200 overflow-x-auto px-200 scrollbar-none">
      {CHOICES.map((choice) => (
        <Chip
          key={choice.value}
          selected={choice.value === current}
          aria-pressed={choice.value === current}
          onClick={() => choose(choice.value)}
          className="min-h-11"
        >
          {choice.label}
        </Chip>
      ))}
    </HStack>
  );
}
