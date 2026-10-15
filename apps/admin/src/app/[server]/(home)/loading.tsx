import { HomeLoading, HomeMobileLoading } from "@/views/home";

export default function Loading() {
  return (
    <>
      <div data-view="desktop" className="contents max-lg:hidden">
        <HomeLoading />
      </div>
      <div data-view="mobile" className="contents lg:hidden">
        <HomeMobileLoading />
      </div>
    </>
  );
}
