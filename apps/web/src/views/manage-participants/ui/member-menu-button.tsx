import { IconButton } from "@trpg/ui";
import { MoreHorizontal } from "lucide-react";

// ponytail: 시안의 40px 대신 44px — 행 안에서 보이는 차이는 없고 터치 타깃만 지킨다.
export function MemberMenuButton({ username, onClick }: { username: string; onClick: () => void }) {
  return (
    <IconButton
      aria-label={`${username} 메뉴`}
      onClick={onClick}
      className="h-11 w-11 shrink-0 rounded-[11px]"
    >
      <MoreHorizontal size={18} aria-hidden />
    </IconButton>
  );
}
