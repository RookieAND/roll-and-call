import Link from "next/link";
import { IconButton } from "@trpg/ui";
import type { ReactNode } from "react";

type Props = {
  title: string;
  back?: string;
  action?: ReactNode;
};

export function AppBar({ title, back, action }: Props) {
  return (
    <header className="sticky top-0 z-20 flex h-[52px] items-center gap-1 border-b border-gray-200 bg-surface/90 px-3.5 backdrop-blur">
      {back && (
        <IconButton
          asChild
          variant="ghost"
          aria-label="뒤로"
          className="-ml-1.5 h-9 w-9 text-2xl text-gray-600"
        >
          <Link href={back}>‹</Link>
        </IconButton>
      )}
      <span
        className={
          back
            ? "truncate text-[15.5px] font-bold tracking-tight"
            : "text-[17px] font-extrabold tracking-tight"
        }
      >
        {title}
      </span>
      <span className="flex-1" />
      {action}
    </header>
  );
}
