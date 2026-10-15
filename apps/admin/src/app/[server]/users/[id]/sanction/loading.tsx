import { UserSanctionLoading, UserSanctionMobileLoading } from "@/views/user-sanction";

export default function Loading() {
  return (
    <>
      <div data-view="desktop" className="contents max-lg:hidden">
        <UserSanctionLoading />
      </div>
      <div data-view="mobile" className="contents lg:hidden">
        <UserSanctionMobileLoading />
      </div>
    </>
  );
}
