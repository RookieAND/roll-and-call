// 열린 시트·다이얼로그 수. FloatingBar가 이 값으로 스스로 숨는다.
let openCount = 0;
const listeners = new Set<() => void>();

const notify = () => listeners.forEach((listener) => listener());

export const overlayStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot: () => openCount,
  getServerSnapshot: () => 0,
  open() {
    openCount += 1;
    notify();
  },
  close() {
    openCount -= 1;
    notify();
  },
};
