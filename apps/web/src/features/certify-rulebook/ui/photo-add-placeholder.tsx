import { Text, VStack } from "@roll-and-call/ui";
import { Plus } from "lucide-react";

// 첫 사진을 올리면 이 자리에 다음 사진 칸이 생긴다는 걸 미리 보여 주는 자리표시다. 누를 수 없다.
interface PhotoAddPlaceholderProps {
  label: string;
}

export function PhotoAddPlaceholder({ label }: PhotoAddPlaceholderProps) {
  return (
    <VStack gap="075" className="min-w-0 flex-1" aria-hidden>
      <div className="flex aspect-[3/4] w-full items-center justify-center rounded-500 border-2 border-dashed border-gray-200 text-hint">
        <Plus size={28} strokeWidth={2} />
      </div>
      <Text typography="body3" weight="bold" foreground="hint" className="text-center">
        {label}
      </Text>
    </VStack>
  );
}
