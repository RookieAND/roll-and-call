import { Suspense } from "react";

import { HelpDesktopNav } from "./help-desktop-nav";

export default function HelpLayout({ children }: LayoutProps<"/help">) {
  return (
    <>
      <Suspense fallback={null}>
        <HelpDesktopNav />
      </Suspense>
      {children}
    </>
  );
}
