import { BULK_CERT_MAX_BOOKS } from "@roll-and-call/database/certifications/model";
import { Text, VStack } from "@roll-and-call/ui";
import { BookOpen, ChevronRight, Library } from "lucide-react";

import { APPLY_MODE, type ApplyMode } from "../model/apply-mode";

interface ApplyModeStepProps {
  onChoose: (mode: ApplyMode) => void;
}

const OPTIONS = [
  {
    mode: APPLY_MODE.single,
    icon: BookOpen,
    title: "한 권 신청",
    description: "책 한 권의 사진을 올립니다",
  },
  {
    mode: APPLY_MODE.bulk,
    icon: Library,
    title: "여러 권 함께 신청",
    description: `사진 한 묶음으로 최대 ${BULK_CERT_MAX_BOOKS}권까지 신청합니다`,
  },
] as const;

export function ApplyModeStep({ onChoose }: ApplyModeStepProps) {
  return (
    <VStack gap="100">
      {OPTIONS.map(({ icon: Icon, ...option }) => (
        // ponytail: 두 줄 정보를 담은 선택 행이라 Button 모양 대신 손으로 둔다.
        <button
          key={option.mode}
          type="button"
          onClick={() => onChoose(option.mode)}
          className="group flex min-h-15 w-full cursor-pointer items-center gap-150 rounded-500 border border-gray-200 bg-surface px-175 py-150 text-left transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
        >
          <span
            aria-hidden
            className="flex size-11 flex-none items-center justify-center rounded-400 bg-tinted-bg text-tinted-ink"
          >
            <Icon size={22} strokeWidth={2.1} />
          </span>
          <VStack gap="025" className="min-w-0 flex-1">
            <Text typography="subtitle2">{option.title}</Text>
            <Text typography="body4" foreground="muted" className="break-keep">
              {option.description}
            </Text>
          </VStack>
          <ChevronRight size={16} aria-hidden className="flex-none text-hint" />
        </button>
      ))}
    </VStack>
  );
}
