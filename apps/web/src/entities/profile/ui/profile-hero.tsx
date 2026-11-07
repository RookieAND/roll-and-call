import { Avatar, cn, HStack } from "@roll-and-call/ui";
import type { CSSProperties, ReactNode } from "react";

import { BannerImage } from "@/shared/ui";

interface ProfileHeroProps {
  name: string;
  avatarUrl: string | null | undefined;
  bannerUrl: string | null | undefined;
  accentColor: string | null | undefined;
  action?: ReactNode;
  departed?: boolean;
  className?: string;
}

// 배너가 없으면 강조색 면, 강조색도 없으면 기본 면이다. 나간 멤버는 회색 면에 흐린 아바타다.
export function ProfileHero({
  name,
  avatarUrl,
  bannerUrl,
  accentColor,
  action,
  departed,
  className,
}: ProfileHeroProps) {
  const accent = accentColor ? ({ "--acc": accentColor } as CSSProperties) : undefined;
  const faceClass = accentColor
    ? "bg-[color-mix(in_srgb,var(--acc)_28%,var(--rc-color-bg-canvas-base))]"
    : "bg-primary-100";

  return (
    <div style={accent} className={cn("-mx-200", className)}>
      <div
        className={cn(
          "relative aspect-[3/1] w-full overflow-hidden",
          faceClass,
          departed && "bg-gray-100",
        )}
      >
        {bannerUrl && <BannerImage src={bannerUrl} />}
      </div>
      <HStack align="end" gap="100" className="relative z-10 -mt-600 px-200 desktop:-mt-13">
        <span
          className={cn("flex flex-none rounded-full bg-surface p-050", departed && "opacity-50")}
        >
          <Avatar
            src={avatarUrl}
            name={name}
            size="3xl"
            className="size-21 desktop:size-25 desktop:text-3xl"
          />
        </span>
        <span className="flex-1" />
        {action}
      </HStack>
    </div>
  );
}
