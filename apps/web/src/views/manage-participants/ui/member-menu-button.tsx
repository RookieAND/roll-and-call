import { IconButton } from "@trpg/ui";
import { MoreHorizontal } from "lucide-react";

export function MemberMenuButton({ username, onClick }: { username: string; onClick: () => void }) {
  return (
    <IconButton
      variant="outline"
      aria-label={`${username} 메뉴`}
      onClick={onClick}
      className="h-11 w-11 shrink-0 rounded-[10px] border-gray-200 text-gray-600"
    >
      <MoreHorizontal size={16} aria-hidden />
    </IconButton>
  );
}
