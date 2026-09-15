"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { navigationHistory } from "./navigation-history";

export function NavigationTracker() {
  const pathname = usePathname();
  const firstPathname = useRef(pathname);
  useEffect(() => {
    if (pathname !== firstPathname.current) navigationHistory.navigatedInApp = true;
  }, [pathname]);
  return null;
}
