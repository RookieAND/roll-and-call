import { PostsLoading, PostsMobileLoading } from "@/views/posts";

export default function Loading() {
  return (
    <>
      <div className="contents max-lg:hidden">
        <PostsLoading />
      </div>
      <div className="contents lg:hidden">
        <PostsMobileLoading />
      </div>
    </>
  );
}
