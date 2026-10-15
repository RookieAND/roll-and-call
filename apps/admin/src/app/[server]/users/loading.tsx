import { UsersLoading, UsersMobileLoading } from "@/views/users";

export default function Loading() {
  return (
    <>
      <div data-view="desktop" className="contents max-lg:hidden">
        <UsersLoading />
      </div>
      <div data-view="mobile" className="contents lg:hidden">
        <UsersMobileLoading />
      </div>
    </>
  );
}
