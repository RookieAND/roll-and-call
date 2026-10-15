import { IconButton } from "@roll-and-call/ui";
import { isString } from "es-toolkit";
import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";

import { withDirectionParticle } from "@/shared/lib";

import { ServerLink } from "../server-link";

interface MobileBackLinkProps {
  path: string;
  label: ReactNode;
}

// 데스크톱 경로 글자(「유저 ›」) 대신 모바일 헤더 왼쪽에 두는 뒤로 가기
export function MobileBackLink({ path, label }: MobileBackLinkProps) {
  const ariaLabel = isString(label) ? `${withDirectionParticle(label)} 돌아가기` : "뒤로 가기";
  return (
    <IconButton
      aria-label={ariaLabel}
      render={<ServerLink path={path} />}
      className="size-11 text-gray-900"
    >
      <ChevronLeft size={22} aria-hidden />
    </IconButton>
  );
}
