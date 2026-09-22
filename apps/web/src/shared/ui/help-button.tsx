import { IconButton } from "@roll-and-call/ui";
import { CircleHelp } from "lucide-react";
import Link from "next/link";

export function HelpButton() {
  return (
    <IconButton asChild variant="ghost" aria-label="도움말" className="h-11 w-11 text-gray-600">
      <Link href="/help">
        <CircleHelp size={20} />
      </Link>
    </IconButton>
  );
}
