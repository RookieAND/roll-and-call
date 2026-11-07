import {
  BookCheck,
  CalendarDays,
  CircleCheck,
  FileCheck2,
  Flag,
  Inbox,
  MessageCircle,
  Search,
  Users,
  type LucideIcon,
} from "lucide-react";

import { FLOW_ICON, type FlowIcon } from "../model/quest-flows";

export const FLOW_STEP_ICON = {
  [FLOW_ICON.search]: Search,
  [FLOW_ICON.apply]: FileCheck2,
  [FLOW_ICON.calendar]: CalendarDays,
  [FLOW_ICON.users]: Users,
  [FLOW_ICON.chat]: MessageCircle,
  [FLOW_ICON.book]: BookCheck,
  [FLOW_ICON.flag]: Flag,
  [FLOW_ICON.inbox]: Inbox,
  [FLOW_ICON.check]: CircleCheck,
} as const satisfies Record<FlowIcon, LucideIcon>;
