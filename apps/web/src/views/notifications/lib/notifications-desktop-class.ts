// [할 일] 탭에 카드가 둘 이상이면(TodoPanel이 data-todo-layout="multi"를 단다) 본문이 880px로 넓어진다. 그 밖은 640px.
// group-has는 보이는 탭 패널 안의 표지만 본다(숨겨진 패널은 keepMounted라 DOM에 남는다). 클래스는 Tailwind가 읽도록 문자열 그대로 적는다.

// 앱바 제목을 본문 왼쪽 끝에 맞춘다.
export const NOTIFICATIONS_APPBAR_CLASS =
  "desktop:static desktop:px-[max(2rem,calc((100%-640px)/2))] desktop:group-has-[[role=tabpanel]:not([hidden])_[data-todo-layout=multi]]/notif:px-[max(2rem,calc((100%-880px)/2))]";

export const NOTIFICATIONS_CARD_CLASS =
  "desktop:mx-auto desktop:my-300 desktop:w-[640px] desktop:max-w-[calc(100%-4rem)] desktop:overflow-clip desktop:rounded-700 desktop:border desktop:border-gray-200 desktop:bg-surface desktop:group-has-[[role=tabpanel]:not([hidden])_[data-todo-layout=multi]]/notif:w-[880px]";
