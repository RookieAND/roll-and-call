import { Button } from "@roll-and-call/ui";
import Link from "next/link";

import { serverPath } from "@/shared/lib";
import { ServerIcon, type MenuServer } from "@/shared/ui";

import { ServerCtaLabel } from "./server-cta-label";

interface ServerCtaButtonProps {
  server: MenuServer;
  compact: boolean;
  className?: string;
}

export function ServerCtaButton({ server, compact, className }: ServerCtaButtonProps) {
  const size = compact ? "sm" : "lg";
  return (
    <Button
      size={size}
      render={<Link href={serverPath({ slug: server.slug, path: "/" })} />}
      className={className}
    >
      <ServerIcon name={server.name} icon={server.icon} size="sm" />
      <ServerCtaLabel name={server.name} compact={compact} />
    </Button>
  );
}
