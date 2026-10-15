// [할 일] 탭에 카드가 둘 이상이면(TodoPanel이 data-todo-layout="multi"를 단다) 본문이 880px로 넓어진다. 그 밖은 640px.
// has는 보이는 탭 패널 안의 표지만 본다(숨겨진 패널은 keepMounted라 DOM에 남는다). 클래스는 Tailwind가 읽도록 문자열 그대로 적는다.
export const NOTIFICATIONS_SHELL_CLASS =
  "desktop:has-[[role=tabpanel]:not([hidden])_[data-todo-layout=multi]]:[--shell-w:880px]";

export const NOTIFICATIONS_CARD_CLASS =
  "desktop:overflow-clip desktop:rounded-700 desktop:border desktop:border-gray-200 desktop:bg-surface";
