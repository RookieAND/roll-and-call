import Image from "next/image";

// 워드마크가 두 장이라 테마 전환을 CSS로 맡긴다. JS로 고르면 첫 페인트에 반대 색이 번쩍인다.
export function BrandLogo({ label }: { label: string }) {
  return (
    <span className="flex items-center">
      <Image
        src="/empty-states/logo_light.png"
        alt={label}
        width={106}
        height={26}
        priority
        className="dark:hidden"
      />
      <Image
        src="/empty-states/logo_dark.png"
        alt=""
        width={100}
        height={26}
        priority
        aria-hidden
        className="hidden dark:block"
      />
    </span>
  );
}
