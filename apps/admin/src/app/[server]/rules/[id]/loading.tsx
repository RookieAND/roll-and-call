import { RulebookDetailLoading, RulebookDetailMobileLoading } from "@/views/rulebook-detail";

export default function Loading() {
  return (
    <>
      <div data-view="desktop" className="contents max-lg:hidden">
        <RulebookDetailLoading />
      </div>
      <div data-view="mobile" className="contents lg:hidden">
        <RulebookDetailMobileLoading />
      </div>
    </>
  );
}
