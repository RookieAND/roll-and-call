"use client";

import { IconButton } from "@roll-and-call/ui";
import { CircleHelp } from "lucide-react";
import Link from "next/link";
import { useContext } from "react";

import { ServerNavContext } from "./server-nav-context";

export function HelpButton() {
  const server = useContext(ServerNavContext);
  const href = server ? `/help?from=${server.slug}` : "/help";

  return (
    <IconButton
      render={<Link href={href} />}
      variant="ghost"
      aria-label="도움말"
      className="h-11 w-11 text-gray-600"
    >
      <CircleHelp size={20} />
    </IconButton>
  );
}
