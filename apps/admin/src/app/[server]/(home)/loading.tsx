import { HomeLoading, HomeMobileLoading } from "@/views/home";

export default function Loading() {
  return (
    <>
      <div className="contents max-lg:hidden">
        <HomeLoading />
      </div>
      <div className="contents lg:hidden">
        <HomeMobileLoading />
      </div>
    </>
  );
}
