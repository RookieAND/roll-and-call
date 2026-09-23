import { Button } from "@roll-and-call/ui";
import Link from "next/link";

import { EmptyState } from "@/shared/ui";

import { LoginRequired } from "./login-required";

interface GmOnlyNoticeProps {
  gameId: string;
  signedIn: boolean;
  description: string;
}

// 조용히 튕기지 않는다: 비로그인·비GM에게 그 자리에서 안내한다.
export function GmOnlyNotice({ gameId, signedIn, description }: GmOnlyNoticeProps) {
  if (!signedIn) return <LoginRequired />;
  return (
    <EmptyState
      image="/empty-states/empty-error.png"
      size="section"
      title="GM만 볼 수 있는 화면입니다"
      description={description}
      action={
        <Button render={<Link href={`/games/${gameId}`} />} variant="outline" className="mt-100">
          구인 상세로 돌아가기
        </Button>
      }
    />
  );
}
