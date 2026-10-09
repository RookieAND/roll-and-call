"use client";

import { HStack, TextInput, cn } from "@roll-and-call/ui";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const DELAY = 250;

interface UrlSearchInputProps {
  placeholder: string;
  param?: string;
  size?: "md" | "sm";
  className?: string;
}

export function UrlSearchInput({
  placeholder,
  param = "q",
  size = "md",
  className,
}: UrlSearchInputProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get(param) ?? "";
  const [value, setValue] = useState(current);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const pushed = useRef(current);

  // 주소가 밖에서 바뀌면(뒤로 가기) 입력칸을 따라간다. 내가 올린 값이 돌아온 것이면 건드리지 않는다.
  useEffect(() => {
    if (current === pushed.current) return;
    pushed.current = current;
    clearTimeout(timer.current);
    setValue(current);
  }, [current]);

  useEffect(() => () => clearTimeout(timer.current), []);

  const change = (nextValue: string) => {
    setValue(nextValue);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const trimmed = nextValue.trim();
      if (trimmed === pushed.current) return;
      pushed.current = trimmed;
      const next = new URLSearchParams(window.location.search);
      next.delete("page");
      if (trimmed) next.set(param, trimmed);
      else next.delete(param);
      router.replace(next.size ? `${pathname}?${next}` : pathname, { scroll: false });
    }, DELAY);
  };

  return (
    <HStack align="center" className={cn("relative", className)}>
      <Search size={14} aria-hidden className="pointer-events-none absolute left-125 text-hint" />
      <TextInput
        type="search"
        value={value}
        onChange={(event) => change(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className={size === "sm" ? "h-[32px] pl-400 text-body3" : "pl-400 text-body3"}
      />
    </HStack>
  );
}
