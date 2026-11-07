import { MakerQueueLoading, MakerQueueMobileLoading } from "@/views/maker-queue";

export default function Loading() {
  return (
    <>
      <div data-view="desktop" className="contents max-lg:hidden">
        <MakerQueueLoading />
      </div>
      <div data-view="mobile" className="contents lg:hidden">
        <MakerQueueMobileLoading />
      </div>
    </>
  );
}
