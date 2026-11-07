"use client";

import { MakerReviewError, MakerReviewMobileError } from "@/views/maker-review";

export default function MakerReviewErrorPage({ retry }: { retry: () => void }) {
  return (
    <>
      <div data-view="desktop" className="contents max-lg:hidden">
        <MakerReviewError retry={retry} />
      </div>
      <div data-view="mobile" className="contents lg:hidden">
        <MakerReviewMobileError retry={retry} />
      </div>
    </>
  );
}
