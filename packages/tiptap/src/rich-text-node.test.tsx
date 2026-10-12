import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { RichTextNode } from "./rich-text-node";

const DISCORD_URL = "https://discord.com/channels/1/2/3";

function linkNode({ text, href }: { text: string; href: string }) {
  return { type: "text", text, marks: [{ type: "link", attrs: { href } }] };
}

describe("RichTextNode 링크 칩", () => {
  it("이름을 가져온 디스코드 링크는 채널명 칩으로 그린다", () => {
    const html = renderToStaticMarkup(
      <RichTextNode
        node={linkNode({ text: DISCORD_URL, href: DISCORD_URL })}
        linkLabels={{ [DISCORD_URL]: "하우스-룰" }}
      />,
    );
    expect(html).toContain('class="rich-text-chip"');
    expect(html).toContain('data-named="true"');
    expect(html).toContain(`href="${DISCORD_URL}"`);
    expect(html).toContain('rel="noopener noreferrer"');
    expect(html).toContain(">하우스-룰</span>");
  });

  it("이름이 없으면 서비스 기본 라벨로 그린다", () => {
    const html = renderToStaticMarkup(
      <RichTextNode node={linkNode({ text: DISCORD_URL, href: DISCORD_URL })} />,
    );
    expect(html).toContain('data-named="false"');
    expect(html).toContain(">디스코드 채널</span>");
  });

  it("스프레드시트와 노션 링크도 칩으로 그린다", () => {
    const sheetsUrl = "https://docs.google.com/spreadsheets/d/abc/edit";
    const notionUrl = "https://www.notion.so/page-123";
    expect(
      renderToStaticMarkup(<RichTextNode node={linkNode({ text: sheetsUrl, href: sheetsUrl })} />),
    ).toContain(">구글 스프레드시트</span>");
    expect(
      renderToStaticMarkup(<RichTextNode node={linkNode({ text: notionUrl, href: notionUrl })} />),
    ).toContain(">노션 페이지</span>");
  });

  it("글쓴이가 이름을 붙인 링크는 칩으로 바꾸지 않고 그 글자를 살린다", () => {
    const html = renderToStaticMarkup(
      <RichTextNode node={linkNode({ text: "하우스룰 보기", href: DISCORD_URL })} />,
    );
    expect(html).not.toContain("rich-text-chip");
    expect(html).toContain(">하우스룰 보기</a>");
  });

  it("채널명은 글자로만 들어가 HTML이 되지 않는다", () => {
    const html = renderToStaticMarkup(
      <RichTextNode
        node={linkNode({ text: DISCORD_URL, href: DISCORD_URL })}
        linkLabels={{ [DISCORD_URL]: "<img src=x onerror=alert(1)>" }}
      />,
    );
    expect(html).not.toContain("<img");
    expect(html).toContain("&lt;img");
  });
});
