"use client";

import { Sheet } from "@roll-and-call/ui";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

import { MobileDrawerContext } from "./mobile-drawer-context";

const PANEL = { none: "none", drawer: "drawer", serverSwitch: "serverSwitch" } as const;
type Panel = (typeof PANEL)[keyof typeof PANEL];

interface AdminMobileShellProps {
  // 데스크톱 사이드바와 같은 메뉴를 드로어에 그대로 넣는다.
  drawer: ReactNode;
  // 시트는 겹쳐 열지 않으므로 서버 전환 시트는 드로어를 닫고 따로 연다.
  serverSwitch: ReactNode;
  children: ReactNode;
}

// 모바일 상단 헤더는 각 화면의 AdminHeader가 맡고, 이 틀은 헤더의 햄버거 버튼이 여는 드로어를 둔다.
export function AdminMobileShell({ drawer, serverSwitch, children }: AdminMobileShellProps) {
  const [panel, setPanel] = useState<Panel>(PANEL.none);
  const pathname = usePathname();

  useEffect(() => setPanel(PANEL.none), [pathname]);

  const closeWhenHidden = (open: boolean) => {
    if (!open) setPanel(PANEL.none);
  };

  return (
    <MobileDrawerContext.Provider
      value={{
        openDrawer: () => setPanel(PANEL.drawer),
        openServerSwitch: () => setPanel(PANEL.serverSwitch),
      }}
    >
      {children}
      <Sheet.Root side="left" open={panel === PANEL.drawer} onOpenChange={closeWhenHidden}>
        <Sheet.Popup aria-label="메뉴" className="w-74 max-w-[88vw] p-0">
          {drawer}
        </Sheet.Popup>
      </Sheet.Root>
      <Sheet.Root open={panel === PANEL.serverSwitch} onOpenChange={closeWhenHidden}>
        <Sheet.Popup className="px-150 pt-100">
          <Sheet.Handle />
          {serverSwitch}
        </Sheet.Popup>
      </Sheet.Root>
    </MobileDrawerContext.Provider>
  );
}
