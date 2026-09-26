import { HStack, Text, VStack } from "@roll-and-call/ui";
import { ChevronRight, Lock } from "lucide-react";

import type { PickerCategory } from "../model/picker-categories";

interface PickerCategoryRowProps {
  category: PickerCategory;
  onPick: () => void;
}

// 카테고리 한 줄. 무료 배포 룰은 인증할 게 없어 누를 수 없다.
export function PickerCategoryRow({ category, onPick }: PickerCategoryRowProps) {
  const meta = category.free ? "인증 없이 구인을 열 수 있습니다" : category.meta;
  const body = (
    <>
      <VStack gap="025" className="min-w-0 flex-1">
        <HStack align="baseline" gap="100">
          <Text typography="body2" weight="bold" foreground={category.free ? "muted" : "normal"}>
            {category.name}
          </Text>
          {category.alias && (
            <Text typography="body4" foreground="hint" truncate>
              {category.alias}
            </Text>
          )}
        </HStack>
        <Text typography="body4" foreground="muted">
          {meta}
        </Text>
      </VStack>
      {category.free ? (
        <Lock size={16} aria-hidden className="flex-none text-hint" />
      ) : (
        <ChevronRight size={16} aria-hidden className="flex-none text-hint" />
      )}
    </>
  );
  const rowClass =
    "flex min-h-[60px] w-full items-center gap-150 border-b border-gray-200 py-100 text-left";
  return category.free ? (
    <div aria-disabled className={rowClass}>
      {body}
    </div>
  ) : (
    // ponytail: 두 줄 정보를 담은 목록 행이라 Button 모양 대신 손으로 둔다.
    <button
      type="button"
      onClick={onPick}
      className={`${rowClass} hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus`}
    >
      {body}
    </button>
  );
}
