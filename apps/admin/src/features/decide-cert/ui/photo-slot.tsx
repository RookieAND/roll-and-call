import { Text, VStack, cn } from "@roll-and-call/ui";
import { ImageIcon } from "lucide-react";
import type { CSSProperties } from "react";

interface PhotoSlotProps {
  url?: string;
  placeholder: string;
  className?: string;
  imageStyle?: CSSProperties;
}

// ponytail: 업로드된 사진은 외부 저장소 주소라 next/image 대신 img로 그린다. 저장소가 정해지면 remotePatterns와 함께 바꾼다.
export function PhotoSlot({ url, placeholder, className, imageStyle }: PhotoSlotProps) {
  if (url) {
    return (
      <img
        src={url}
        alt={placeholder}
        style={imageStyle}
        className={cn("object-contain", className)}
      />
    );
  }
  return (
    <VStack
      align="center"
      justify="center"
      gap="075"
      className={cn("border border-dashed border-gray-300 bg-gray-100 text-hint", className)}
    >
      <ImageIcon size={24} aria-hidden />
      <Text typography="body4" foreground="hint">
        {placeholder}
      </Text>
    </VStack>
  );
}
