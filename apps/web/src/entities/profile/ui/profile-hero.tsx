import { Avatar, cn, HStack } from "@roll-and-call/ui";
import type { CSSProperties, ReactNode } from "react";

interface ProfileHeroProps {
  name: string;
  avatarUrl: string | null | undefined;
  bannerUrl: string | null | undefined;
  accentColor: string | null | undefined;
  // 아바타 오른쪽 끝(편집 버튼 등)
  action?: ReactNode;
  className?: string;
}

// 프로필 맨 위 4:1 배너(높이는 200px까지)와 겹쳐 놓인 아바타. 배너가 없으면 강조색 면(강조색도 없으면 기본 면)이다.
// 좌우 여백을 가진 부모 안에서 쓰고, 배너는 여백을 뚫고 가장자리까지 펼친다. 폭은 읽기 좋은 640px 열(PageShell readable) 안이고,
export function ProfileHero({
  name,
  avatarUrl,
  bannerUrl,
  accentColor,
  action,
  className,
}: ProfileHeroProps) {
  const accent = accentColor ? ({ "--acc": accentColor } as CSSProperties) : undefined;
  const faceClass = accentColor
    ? "bg-[color-mix(in_srgb,var(--acc)_28%,var(--rc-color-bg-canvas-base))]"
    : "bg-primary-100";
  const ringClass = accentColor ? "shadow-[0_0_0_2px_var(--acc)]" : "";

  return (
    <div style={accent} className={cn("-mx-200", className)}>
      <div className={cn("relative aspect-[4/1] max-h-50 w-full overflow-hidden", faceClass)}>
        {/* ponytail: 업로드한 이미지는 외부 저장소 주소라 next/image 대신 img로 그린다. */}
        {bannerUrl && <img src={bannerUrl} alt="" className="size-full object-cover" />}
      </div>
      <HStack align="end" gap="100" className="relative z-10 -mt-13 px-200">
        <span className={cn("flex flex-none rounded-full bg-surface p-050", ringClass)}>
          <Avatar
            src={avatarUrl}
            name={name}
            size="3xl"
            className="size-23 desktop:size-25 desktop:text-3xl"
          />
        </span>
        <span className="flex-1" />
        {action}
      </HStack>
    </div>
  );
}
