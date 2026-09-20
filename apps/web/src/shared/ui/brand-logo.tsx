import Image from "next/image";

const SIZES = {
  sm: { light: { width: 106, height: 26 }, dark: { width: 100, height: 26 } },
  lg: { light: { width: 248, height: 61 }, dark: { width: 248, height: 64 } },
} as const;

// 워드마크가 두 장이라 테마 전환을 CSS로 맡긴다. JS로 고르면 첫 페인트에 반대 색이 번쩍인다.
export function BrandLogo({ label, size = "sm" }: { label: string; size?: keyof typeof SIZES }) {
  const { light, dark } = SIZES[size];

  return (
    <span className="flex items-center">
      <Image
        src="/empty-states/logo_light.png"
        alt={label}
        width={light.width}
        height={light.height}
        priority
        className="dark:hidden"
      />
      <Image
        src="/empty-states/logo_dark.png"
        alt=""
        width={dark.width}
        height={dark.height}
        priority
        aria-hidden
        className="hidden dark:block"
      />
    </span>
  );
}
