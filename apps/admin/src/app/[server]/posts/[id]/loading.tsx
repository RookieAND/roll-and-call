import { PostDetailLoading, PostDetailMobileLoading } from "@/views/post-detail";

export default function Loading() {
  return (
    <>
      <div data-view="desktop" className="contents max-lg:hidden">
        <PostDetailLoading />
      </div>
      <div data-view="mobile" className="contents lg:hidden">
        <PostDetailMobileLoading />
      </div>
    </>
  );
}
