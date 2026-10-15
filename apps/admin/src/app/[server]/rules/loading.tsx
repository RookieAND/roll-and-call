import { RulebooksLoading, RulebooksMobileLoading } from "@/views/rulebooks";

export default function Loading() {
  return (
    <>
      <div data-view="desktop" className="contents max-lg:hidden">
        <RulebooksLoading />
      </div>
      <div data-view="mobile" className="contents lg:hidden">
        <RulebooksMobileLoading />
      </div>
    </>
  );
}
