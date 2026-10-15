import { UserDetailLoading, UserDetailMobileLoading } from "@/views/user-detail";

export default function Loading() {
  return (
    <>
      <div data-view="desktop" className="contents max-lg:hidden">
        <UserDetailLoading />
      </div>
      <div data-view="mobile" className="contents lg:hidden">
        <UserDetailMobileLoading />
      </div>
    </>
  );
}
