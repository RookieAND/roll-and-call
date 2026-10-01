"use client";

import { HStack, TextInput } from "@roll-and-call/ui";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

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

  useEffect(() => {
    if (value.trim() === current) return;
    const timer = setTimeout(() => {
      const next = new URLSearchParams(searchParams);
      next.delete("page");
      if (value.trim()) next.set(param, value.trim());
      else next.delete(param);
      router.replace(next.size ? `${pathname}?${next}` : pathname, { scroll: false });
    }, DELAY);
    return () => clearTimeout(timer);
  }, [value, current, param, pathname, router, searchParams]);

  return (
    <HStack align="center" className={`relative ${className ?? ""}`}>
      <Search size={14} aria-hidden className="pointer-events-none absolute left-125 text-hint" />
      <TextInput
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className={size === "sm" ? "h-[32px] pl-400 text-body3" : "pl-400 text-body3"}
      />
    </HStack>
  );
}
