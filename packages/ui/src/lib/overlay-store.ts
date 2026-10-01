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
