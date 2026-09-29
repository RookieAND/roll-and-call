import Image from "next/image";

const SIZES = {
  sm: { light: { width: 106, height: 26 }, dark: { width: 100, height: 26 } },
  lg: { light: { width: 248, height: 61 }, dark: { width: 248, height: 64 } },
} as const;

interface BrandLogoProps {
  label: string;
  size?: keyof typeof SIZES;
}

// 워드마크가 두 장이라 테마 전환을 CSS로 맡긴다. JS로 고르면 첫 페인트에 반대 색이 번쩍인다.
// preload는 두 장을 다 받으므로 lazy + fetchPriority로 보이는 한 장만 서둘러 받는다.
export function BrandLogo({ label, size = "sm" }: BrandLogoProps) {
  const { light, dark } = SIZES[size];

  return (
    <span className="flex items-center">
      <Image
        src="/empty-states/logo_light.png"
        alt={label}
        width={light.width}
        height={light.height}
        fetchPriority="high"
        className="dark:hidden"
      />
      <Image
        src="/empty-states/logo_dark.png"
        alt=""
        width={dark.width}
        height={dark.height}
        fetchPriority="high"
        aria-hidden
        className="hidden dark:block"
      />
    </span>
  );
}
