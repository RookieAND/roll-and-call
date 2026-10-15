import { RulebookNewLoading, RulebookNewMobileLoading } from "@/views/rulebook-new";

export default function Loading() {
  return (
    <>
      <div data-view="desktop" className="contents max-lg:hidden">
        <RulebookNewLoading />
      </div>
      <div data-view="mobile" className="contents lg:hidden">
        <RulebookNewMobileLoading />
      </div>
    </>
  );
}
