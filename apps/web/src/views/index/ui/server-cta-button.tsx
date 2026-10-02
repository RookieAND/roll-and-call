import { Button } from "@roll-and-call/ui";
import Link from "next/link";

import { serverJoinPath, serverPath } from "@/shared/lib";
import { ServerIcon, type MenuServer } from "@/shared/ui";

import type { ServerCtaMode } from "../model/server-cta-mode";
import { ServerCtaLabel } from "./server-cta-label";

interface ServerCtaButtonProps {
  server: MenuServer;
  mode: ServerCtaMode;
  compact: boolean;
  className?: string;
}

export function ServerCtaButton({ server, mode, compact, className }: ServerCtaButtonProps) {
  const size = compact ? "sm" : "lg";
  const href =
    mode === "join"
      ? serverJoinPath({ slug: server.slug })
      : serverPath({ slug: server.slug, path: "/" });
  return (
    <Button size={size} render={<Link href={href} />} className={className}>
      {!(compact && mode === "join") && (
        <ServerIcon name={server.name} icon={server.icon} size="sm" />
      )}
      <ServerCtaLabel name={server.name} mode={mode} compact={compact} />
    </Button>
  );
}
