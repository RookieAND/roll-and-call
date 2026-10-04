import { notFound } from "next/navigation";

// 서버 안의 없는 주소도 사이드바가 있는 not-found.tsx로 보낸다.
export default function MissingPage() {
  notFound();
}
