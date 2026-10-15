import { NoShowsLoading, NoShowsMobileLoading } from "@/views/no-shows";

export default function Loading() {
  return (
    <>
      <div className="contents max-lg:hidden">
        <NoShowsLoading />
      </div>
      <div className="contents lg:hidden">
        <NoShowsMobileLoading />
      </div>
    </>
  );
}
