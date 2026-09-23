import { AppBar, ErrorScreen, GoBackButton } from "@/shared/ui";

// 프로필·세션 기록·메모 어느 주소든 사용자가 없으면 여기로 온다.
export default function NotFound() {
  return (
    <>
      <AppBar back="/games" title="프로필" />
      <ErrorScreen
        image="/empty-states/empty-search.png"
        title="프로필을 찾을 수 없습니다"
        description={
          <>
            탈퇴했거나 주소가 바뀐 사용자입니다.
            <br />
            함께한 세션 기록에는 이름만 남습니다.
          </>
        }
        action={<GoBackButton fallback="/games" />}
        homeLink={false}
      />
    </>
  );
}
