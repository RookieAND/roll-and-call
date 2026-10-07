import { UiImage } from "@roll-and-call/ui";

const SIZES = {
  sm: { width: 106, height: 26 },
  lg: { width: 248, height: 62 },
} as const;

interface BrandLogoProps {
  label: string;
  size?: keyof typeof SIZES;
}

// 워드마크가 라이트·다크 두 장이라 테마 전환은 UiImage가 CSS로 맡는다.
export function BrandLogo({ label, size = "sm" }: BrandLogoProps) {
  return (
    <span className="flex items-center">
      <UiImage name="logo" alt={label} loading="eager" fetchPriority="high" {...SIZES[size]} />
    </span>
  );
}
