"use client";

import { MakerQueueError, MakerQueueMobileError } from "@/views/maker-queue";

export default function MakerQueueErrorPage({ retry }: { retry: () => void }) {
  return (
    <>
      <div data-view="desktop" className="contents max-lg:hidden">
        <MakerQueueError retry={retry} />
      </div>
      <div data-view="mobile" className="contents lg:hidden">
        <MakerQueueMobileError retry={retry} />
      </div>
    </>
  );
}
