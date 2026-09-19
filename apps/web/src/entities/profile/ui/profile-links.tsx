import { Text } from "@trpg/ui";
import { Link2 } from "lucide-react";

import {
  linkHref,
  linkLabel,
  linkServiceOf,
  type LinkServiceKey,
  type ProfileLink,
} from "../model/link-services";
import { BrandMark } from "./brand-mark";

const ICON_CLASS =
  "flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 text-gray-700";

// 내 화면이든 남의 화면이든 44px 아이콘 한 줄. 이름과 주소는 aria-label과 누름으로 나온다.
export function ProfileLinks({ links }: { links: readonly ProfileLink[] }) {
  if (links.length === 0) {
    return (
      <div className="flex min-h-[46px] items-center gap-2.5 rounded-[11px] border border-dashed border-gray-300 px-3">
        <Link2 size={16} className="flex-none text-hint" aria-hidden />
        <Text typography="body4" foreground="hint" className="min-w-0 flex-1 text-[12.5px]">
          등록한 링크가 없습니다
        </Text>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {links.map((link, index) => {
        const label = linkLabel(link);
        const href = linkHref(link);
        const service = linkServiceOf(link.service).key as LinkServiceKey;
        const mark = <BrandMark service={service} />;

        return href ? (
          <a
            // 같은 서비스를 둘 이상 적을 수 있어 순서를 키에 같이 쓴다.
            key={`${link.service}-${index}`}
            href={href}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={label}
            title={label}
            className={`${ICON_CLASS} transition-colors hover:bg-gray-50`}
          >
            {mark}
          </a>
        ) : (
          <span key={`${link.service}-${index}`} aria-label={label} title={label} className={ICON_CLASS}>
            {mark}
          </span>
        );
      })}
    </div>
  );
}
