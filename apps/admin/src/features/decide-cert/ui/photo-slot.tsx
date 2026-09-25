import { Button, Text, VStack, cn } from "@roll-and-call/ui";
import { FileText, ImageIcon } from "lucide-react";
import type { CSSProperties } from "react";

interface PhotoSlotProps {
  url?: string;
  placeholder: string;
  className?: string;
  imageStyle?: CSSProperties;
  // 버튼 안(사진 카드)에서는 링크를 둘 수 없어 확대 화면에서만 연다.
  pdfLink?: boolean;
}

// ponytail: 업로드된 사진은 외부 저장소 주소라 next/image 대신 img로 그린다. 저장소가 정해지면 remotePatterns와 함께 바꾼다.
// 전자책 영수증은 PDF로도 받는다. PDF는 미리 그리지 않고 새 창으로 연다.
export function PhotoSlot({
  url,
  placeholder,
  className,
  imageStyle,
  pdfLink = false,
}: PhotoSlotProps) {
  if (url && new URL(url).pathname.toLowerCase().endsWith(".pdf")) {
    return (
      <VStack align="center" justify="center" gap="100" className={cn("bg-gray-100", className)}>
        <FileText size={28} aria-hidden className="text-hint" />
        <Text typography="body4" foreground="muted">
          PDF 문서
        </Text>
        {pdfLink ? (
          <Button
            variant="outline"
            colorPalette="gray"
            size="sm"
            render={<a href={url} target="_blank" rel="noreferrer" />}
          >
            새 창에서 열기
          </Button>
        ) : null}
      </VStack>
    );
  }
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
