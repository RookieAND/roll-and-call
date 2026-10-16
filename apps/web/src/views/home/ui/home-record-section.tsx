import { HStack, Text } from "@roll-and-call/ui";
import { cn } from "@roll-and-call/ui";
import type { LucideIcon } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";

interface HomeRecordSectionProps {
  label: string;
  kind: string;
  accent: string;
  icon: LucideIcon;
  className?: string;
  children: ReactNode;
}

// 모바일은 작은 제목 한 줄, 데스크톱은 부문 색을 두른 카드로 보인다.
export function HomeRecordSection({
  label,
  kind,
  accent,
  icon: Icon,
  className,
  children,
}: HomeRecordSectionProps) {
  return (
    <div
      style={{ "--accent": accent } as CSSProperties}
      className={cn(
        "desktop:relative desktop:mt-0 desktop:overflow-hidden desktop:rounded-700 desktop:border desktop:border-t desktop:border-[color-mix(in_srgb,var(--accent)_38%,var(--rc-color-border-normal))] desktop:bg-[radial-gradient(90%_55%_at_50%_0%,color-mix(in_srgb,var(--accent)_22%,transparent),transparent_80%),linear-gradient(180deg,color-mix(in_srgb,var(--accent)_12%,var(--rc-color-bg-canvas-raised))_0%,color-mix(in_srgb,var(--accent)_5%,transparent)_60%,transparent_100%)] desktop:px-225 desktop:pt-250 desktop:pb-0",
        className,
      )}
    >
      <Icon
        aria-hidden
        size={150}
        strokeWidth={1.2}
        className="pointer-events-none absolute -top-[26px] -right-6 hidden text-(--accent) opacity-10 desktop:block"
      />
      <Text
        typography="body4"
        weight="extrabold"
        foreground="hint"
        render={<div />}
        className="mb-125 tracking-[0.06em] desktop:hidden"
      >
        {label}
      </Text>
      <HStack align="center" gap="150" className="relative mb-200 hidden desktop:flex">
        <span className="flex h-10 w-10 flex-none items-center justify-center rounded-[12px] bg-[linear-gradient(145deg,color-mix(in_srgb,var(--accent)_70%,white),var(--accent))] text-white shadow-[0_6px_14px_color-mix(in_srgb,var(--accent)_35%,transparent)]">
          <Icon size={22} aria-hidden />
        </span>
        <div className="flex min-w-0 flex-col">
          <Text
            typography="body4"
            weight="extrabold"
            foreground="inherit"
            className="tracking-[0.12em] text-(--accent)"
          >
            {kind}
          </Text>
          <Text typography="subtitle1" weight="extrabold" className="tracking-[-0.02em]">
            {label}
          </Text>
        </div>
      </HStack>
      {children}
    </div>
  );
}
