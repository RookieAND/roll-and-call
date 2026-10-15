// 서버에서만 부르는 진입점(스냅숏·DB를 읽는다). 클라이언트가 가져오는 index와 나눈다.
export { getPostDetail, type PostDetail } from "./api/get-post-detail";
export { getPostTitle } from "./api/get-post-title";
export { listPosts } from "./api/list-posts";
