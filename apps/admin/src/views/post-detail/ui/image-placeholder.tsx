import { Text, VStack } from "@roll-and-call/ui";
import { ImageIcon } from "lucide-react";

interface ImagePlaceholderProps {
  label: string;
  className?: string;
}

export function ImagePlaceholder({ label, className }: ImagePlaceholderProps) {
  return (
    <VStack
      align="center"
      justify="center"
      gap="050"
      className={`shrink-0 rounded-300 border border-dashed border-gray-300 bg-gray-50 text-hint ${className ?? ""}`}
    >
      <ImageIcon size={16} aria-hidden />
      <Text typography="body4" foreground="hint">
        {label}
      </Text>
    </VStack>
  );
}
