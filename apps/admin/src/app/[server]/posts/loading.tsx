import { PostsLoading, PostsMobileLoading } from "@/views/posts";

export default function Loading() {
  return (
    <>
      <div data-view="desktop" className="contents max-lg:hidden">
        <PostsLoading />
      </div>
      <div data-view="mobile" className="contents lg:hidden">
        <PostsMobileLoading />
      </div>
    </>
  );
}
