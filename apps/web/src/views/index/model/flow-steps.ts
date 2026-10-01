import { CalendarDays, Package, Search, SquareCheckBig, Star, type LucideIcon } from "lucide-react";

export interface FlowStep {
  title: string;
  description: string;
  who: string;
  icon: LucideIcon;
  palette: "blue" | "purple" | "green" | "indigo" | "pink";
}

export const FLOW_STEPS: FlowStep[] = [
  {
    title: "구인 찾기",
    description: "서버 구인 목록에서 세션을 고릅니다.",
    who: "참여자",
    icon: Search,
    palette: "blue",
  },
  {
    title: "신청",
    description: "선착순이나 추첨으로 자리를 받습니다.",
    who: "참여자",
    icon: SquareCheckBig,
    palette: "purple",
  },
  {
    title: "일정 조율",
    description: "되는 시간을 칠하면 GM이 확정합니다.",
    who: "참여자 · GM",
    icon: CalendarDays,
    palette: "green",
  },
  {
    title: "세션",
    description: "확정된 시간에 디스코드에서 만납니다.",
    who: "참여자 · GM",
    icon: Package,
    palette: "indigo",
  },
  {
    title: "후기",
    description: "출석을 확인하고 후기를 남깁니다.",
    who: "참여자 · GM",
    icon: Star,
    palette: "pink",
  },
];
