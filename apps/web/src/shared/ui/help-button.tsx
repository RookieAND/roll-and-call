import { IconButton } from "@roll-and-call/ui";
import { CircleHelp } from "lucide-react";
import Link from "next/link";

export function HelpButton() {
  return (
    <IconButton
      render={<Link href="/help" />}
      variant="ghost"
      aria-label="도움말"
      className="h-11 w-11 text-gray-600"
    >
      <CircleHelp size={20} />
    </IconButton>
  );
}
