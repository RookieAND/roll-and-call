"""패치노트 임베드를 디스코드 웹훅으로 보내거나, 이미 보낸 메시지를 수정한다.

사용법: python3 .claude/skills/patch-notes/post.py [notes.json]

notes.json의 각 항목에 message_id가 없으면 새로 보내고 받은 id를 파일에 기록한다.
id가 있으면 그 메시지를 수정한다. 그래서 같은 명령을 다시 돌려도 채널에 중복이 쌓이지 않는다.
"""

import json
import os
import pathlib
import sys
import time
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parents[3]
NOTES = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else pathlib.Path(__file__).with_name("notes.json"))
COLOR = 0x5865F2
USER_AGENT = "RollAndCall-PatchNotes/1.0"  # 없으면 디스코드가 403으로 막는다
# 워드마크는 배포된 정적 파일을 그대로 쓴다. 디스코드가 대신 캐시하므로 재업로드는 필요 없다.
LOGO_URL = "https://trpg-reservation-check.vercel.app/empty-states/logo_dark.png"


def webhook_url():
    url = os.environ.get("DISCORD_PATCHNOTE_WEBHOOK_URL")
    if url:
        return url
    for env in (ROOT / "apps/web/.env.local", ROOT / ".env.local"):
        if env.exists():
            for line in env.read_text().splitlines():
                key, _, value = line.partition("=")
                if key.strip() == "DISCORD_PATCHNOTE_WEBHOOK_URL":
                    return value.strip().strip("\"'")
    raise SystemExit("DISCORD_PATCHNOTE_WEBHOOK_URL not set")


def build(note):
    year, month, day = note["date"].split("-")
    head = [
        {"name": "🏷️ 버전", "value": note["version"], "inline": True},
        {"name": "📅 패치 일자", "value": f"{year}년 {int(month)}월 {int(day)}일", "inline": True},
    ]
    return {
        "title": f"[{year[2:]}{month}{day}]  {note['emoji']}  {note['title']}",
        # 디스코드 인용은 줄마다 다시 열어야 해서, 문장마다 "> "를 붙인다.
        "description": "\n".join(f"> {line}" for line in note["intro"].split("\n")),
        "color": COLOR,
        "fields": head + [
            {"name": name, "value": "\n".join(f"• {i}" for i in items), "inline": False}
            for name, items in note["groups"]
        ],
        "thumbnail": {"url": LOGO_URL},
        "footer": {"text": "Roll & Call 패치노트 · Developer Rookie"},
    }


def send(url, note):
    message_id = note.get("message_id")
    target = f"{url}/messages/{message_id}" if message_id else f"{url}?wait=true"
    request = urllib.request.Request(
        target,
        data=json.dumps({"embeds": [build(note)]}).encode(),
        headers={"Content-Type": "application/json", "User-Agent": USER_AGENT},
        method="PATCH" if message_id else "POST",
    )
    with urllib.request.urlopen(request) as response:
        return json.load(response)["id"]


def main():
    url = webhook_url()
    notes = json.loads(NOTES.read_text())
    for note in notes:
        action = "edit" if note.get("message_id") else "post"
        note["message_id"] = send(url, note)
        print(f"{note['version']} {note['date']} {action} ok")
        NOTES.write_text(json.dumps(notes, ensure_ascii=False, indent=2) + "\n")
        time.sleep(1.0)


if __name__ == "__main__":
    main()
