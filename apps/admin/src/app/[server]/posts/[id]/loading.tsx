import { PostDetailLoading, PostDetailMobileLoading } from "@/views/post-detail";

export default function Loading() {
  return (
    <>
      <div className="contents max-lg:hidden">
        <PostDetailLoading />
      </div>
      <div className="contents lg:hidden">
        <PostDetailMobileLoading />
      </div>
    </>
  );
}
