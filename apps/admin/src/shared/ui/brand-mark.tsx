import { UiImage, VStack } from "@roll-and-call/ui";
import Image from "next/image";

const SIZES = {
  md: { icon: 52, wordmark: { width: 106, height: 26 } },
  sm: { icon: 46, wordmark: { width: 90, height: 22 } },
} as const;

interface BrandMarkProps {
  size?: keyof typeof SIZES;
}

export function BrandMark({ size = "md" }: BrandMarkProps) {
  const { icon, wordmark } = SIZES[size];
  return (
    <VStack align="center" gap="175">
      <Image src="/icon.png" alt="" width={icon} height={icon} priority className="rounded-600" />
      <UiImage name="logo" alt="Roll & Call" {...wordmark} loading="eager" />
    </VStack>
  );
}
