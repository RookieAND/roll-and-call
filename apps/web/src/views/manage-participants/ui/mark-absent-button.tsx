import { IconButton } from "@roll-and-call/ui";
import { LogOut } from "lucide-react";

interface MarkAbsentButtonProps {
  username: string;
  onClick: () => void;
}

export function MarkAbsentButton({ username, onClick }: MarkAbsentButtonProps) {
  return (
    <IconButton
      aria-label={`${username} 불참으로 내보내기`}
      onClick={onClick}
      className="h-11 w-11 rounded-400 text-danger-600"
    >
      <LogOut size={18} aria-hidden />
    </IconButton>
  );
}
