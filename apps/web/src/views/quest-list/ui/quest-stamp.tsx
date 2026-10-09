import { cn } from "@roll-and-call/ui";
import { Check } from "lucide-react";

interface QuestStampProps {
  // 방금 클리어해 돌아왔을 때만 찍는 모션을 낸다. 줄인 동작 설정이면 이미 찍힌 모양이다.
  animate: boolean;
}

export function QuestStamp({ animate }: QuestStampProps) {
  return (
    <span
      className={cn(
        "absolute top-0 right-0 flex rotate-[-8deg] items-center gap-050 rounded-300 border-2 border-success-600 bg-success-50 py-050 pr-125 pl-100 text-body4 font-extrabold text-success-700",
        animate && "motion-safe:animate-quest-stamp",
      )}
    >
      <Check size={14} strokeWidth={3.2} aria-hidden />
      클리어
    </span>
  );
}
