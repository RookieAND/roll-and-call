import { AppBar, ErrorScreen, GoBackButton } from "@/shared/ui";

export default function NotFound() {
  return (
    <>
      <AppBar back="/games" title="프로필" />
      <ErrorScreen
        image="/empty-states/empty-search.png"
        title="프로필을 찾을 수 없습니다"
        description="주소가 틀렸거나 이 서버 멤버가 아닌 사용자입니다."
        action={<GoBackButton fallback="/games" />}
        homeLink={false}
      />
    </>
  );
}
