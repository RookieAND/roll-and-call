import { GameFormSkeleton } from "@/widgets/game-form";

// 1단계에는 신청자 안내 박스가 한 장 더 온다.
export default function Loading() {
  return <GameFormSkeleton title="구인 수정" edit />;
}
