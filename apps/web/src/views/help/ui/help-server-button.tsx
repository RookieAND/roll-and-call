import { Button } from "@roll-and-call/ui";
import { ExternalLink } from "lucide-react";

import { loadHelpServer } from "../api/load-help-server";

interface HelpServerButtonProps {
  from: string | null;
}

export async function HelpServerButton({ from }: HelpServerButtonProps) {
  const server = await loadHelpServer(from);
  if (!server) return null;
  return (
    <Button
      render={<a href={server.inviteUrl} target="_blank" rel="noreferrer" />}
      variant="outline"
      size="lg"
      className="mt-050 w-full"
    >
      <span className="min-w-0 truncate">{server.name} 디스코드 열기</span>
      <ExternalLink size={15} className="flex-none" aria-hidden />
    </Button>
  );
}
