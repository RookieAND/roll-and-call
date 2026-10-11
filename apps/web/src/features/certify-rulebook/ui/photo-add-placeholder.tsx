import { Text, VStack } from "@roll-and-call/ui";
import { Plus } from "lucide-react";

interface PhotoAddPlaceholderProps {
  label: string;
  onPick: () => void;
}

export function PhotoAddPlaceholder({ label, onPick }: PhotoAddPlaceholderProps) {
  return (
    <VStack gap="075" className="min-w-0 flex-1">
      {/* ponytail: 칸 전체가 누르는 자리라 Button 모양을 쓸 수 없다. */}
      <button
        type="button"
        aria-label={`${label} 올리기`}
        onClick={onPick}
        className="flex aspect-[3/4] w-full items-center justify-center rounded-500 border-2 border-dashed border-gray-200 text-hint transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
      >
        <Plus size={28} strokeWidth={2} aria-hidden />
      </button>
      <Text typography="body3" weight="bold" foreground="hint" className="text-center">
        {label}
      </Text>
    </VStack>
  );
}
