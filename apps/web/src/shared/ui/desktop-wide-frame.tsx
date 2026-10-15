// 1100px 이상에서 본문 카드(640px) 틀을 끄고 화면이 영역 전체를 직접 짜게 한다(구인 목록·알림처럼 앱바가 영역 전폭인 화면).
// AppFrame이 이 표지를 :has로 읽는다. 1100px 미만은 영향이 없다.
export function DesktopWideFrame() {
  return <span hidden data-desktop-frame="wide" />;
}
