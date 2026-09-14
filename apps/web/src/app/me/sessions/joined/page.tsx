import { redirect } from "next/navigation";

// 예전 주소: 참여·운영 두 화면을 내 세션 한 화면으로 합쳤다. 탭 값을 새 칩으로 옮겨 보낸다.
export default async function Page({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const { tab } = await searchParams;
  if (tab === "closed") redirect("/me/sessions?tab=past");
  if (tab === "confirmed" || tab === "waiting") redirect(`/me/sessions?status=${tab}`);
  redirect("/me/sessions");
}
