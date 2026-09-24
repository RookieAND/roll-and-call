import { VStack } from "@roll-and-call/ui";
import Image from "next/image";

const SIZES = {
  md: { icon: 52, wordmark: { width: 106, height: 26 } },
  sm: { icon: 46, wordmark: { width: 90, height: 22 } },
} as const;

interface BrandMarkProps {
  size?: keyof typeof SIZES;
}

// 어드민은 라이트만 다루므로 밝은 워드마크 한 장만 쓴다.
export function BrandMark({ size = "md" }: BrandMarkProps) {
  const { icon, wordmark } = SIZES[size];
  return (
    <VStack align="center" gap="175">
      <Image src="/icon.png" alt="" width={icon} height={icon} priority className="rounded-600" />
      <Image src="/logo_light.png" alt="Roll & Call" {...wordmark} priority />
    </VStack>
  );
}
