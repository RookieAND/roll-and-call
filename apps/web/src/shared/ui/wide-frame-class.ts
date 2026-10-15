// 1100px 이상에서 넓게 쓰는 화면(구인 목록·홈)의 안쪽 폭: 본문 최대 960 + 간격 24 + 패널 320 = 1304px를 영역 가운데에 두고, 좁으면 양옆 32px를 남긴다.
export const WIDE_INNER_PX = "desktop:px-[max(2rem,calc((100%-1304px)/2))]";
// PageShell의 폭 변형: 앱바 안쪽 제목을 이 폭의 왼쪽 끝에 맞춘다(패널은 이 폭 안에 있어 --shell-extra는 0).
export const WIDE_SHELL_CLASS = "desktop:[--shell-w:1304px]";
