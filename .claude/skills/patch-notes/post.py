"""패치노트 임베드를 디스코드 웹훅으로 보내거나, 이미 보낸 메시지를 수정한다.

사용법: python3 .claude/skills/patch-notes/post.py [notes.json] [--version v0.35.0]

notes.json의 각 항목에 message_id가 없으면 새로 보내고 받은 id를 파일에 기록한다.
id가 있으면 그 메시지를 수정한다. 항목의 channel로 서버별 웹훅(DISCORD_PATCHNOTE_WEBHOOK_URL_<CHANNEL>)을 고른다. 그래서 같은 명령을 다시 돌려도 채널에 중복이 쌓이지 않는다.
"""

import json
import os
import pathlib
import sys
import time
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parents[3]
NOTES = pathlib.Path(next((a for a in sys.argv[1:] if a.endswith(".json")), pathlib.Path(__file__).with_name("notes.json")))
COLOR = 0x5865F2
USER_AGENT = "RollAndCall-PatchNotes/1.0"  # 없으면 디스코드가 403으로 막는다
# 워드마크는 배포된 정적 파일을 그대로 쓴다. 디스코드가 대신 캐시하므로 재업로드는 필요 없다.
CHANNELS = pathlib.Path(__file__).with_name("channels.json")
API = "https://discord.com/api/v10"
LOGO_URL = "https://trpg-reservation-check.vercel.app/empty-states/logo_dark.png"


DEFAULT_ENV_KEY = "DISCORD_PATCHNOTE_WEBHOOK_URL"
# channel이 없는 항목과 이 이름의 항목은 기본 웹훅(트피아)으로 보낸다.
DEFAULT_CHANNEL = "trpia"


def env_key(channel):
    """channel "canvas" → DISCORD_PATCHNOTE_WEBHOOK_URL_CANVAS."""
    if not channel or channel.lower() == DEFAULT_CHANNEL:
        return DEFAULT_ENV_KEY
    suffix = "".join(ch if ch.isalnum() else "_" for ch in channel).upper()
    return f"{DEFAULT_ENV_KEY}_{suffix}"


def webhook_url(channel):
    """서버별 웹훅. 없으면 None. 다른 서버 웹훅으로 대신 보내지 않는다."""
    key = env_key(channel)
    url = os.environ.get(key)
    if url:
        return url
    for env in (ROOT / "apps/web/.env.local", ROOT / ".env.local"):
        if env.exists():
            for line in env.read_text().splitlines():
                name, _, value = line.partition("=")
                if name.strip() == key:
                    return value.strip().strip("\"'")
    return None


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


def bot_token():
    key = "DISCORD_BOT_TOKEN"
    token = os.environ.get(key)
    if token:
        return token
    for env in (ROOT / "apps/web/.env.local", ROOT / ".env.local"):
        if env.exists():
            for line in env.read_text().splitlines():
                name, _, value = line.partition("=")
                if name.strip() == key:
                    return value.strip().strip("\"'")
    return None


def forum_config(channel):
    """channels.json에 포럼이 지정된 서버면 {forum_id, tag_id}, 아니면 None(웹훅으로 보낸다)."""
    config = json.loads(CHANNELS.read_text()) if CHANNELS.exists() else {}
    return config.get((channel or "").lower())


def request(url, method, body, headers):
    req = urllib.request.Request(
        url,
        data=json.dumps(body).encode(),
        headers={"Content-Type": "application/json", "User-Agent": USER_AGENT, **headers},
        method=method,
    )
    with urllib.request.urlopen(req) as response:
        return json.load(response)


def send(url, note):
    message_id = note.get("message_id")
    target = f"{url}/messages/{message_id}" if message_id else f"{url}?wait=true"
    body = {"embeds": [build(note)]}
    return request(target, "PATCH" if message_id else "POST", body, {})["id"]


def send_forum(forum, token, note):
    # forum: {"forum_id", "tag_id"} — 포럼은 태그 없이는 글을 만들 수 없다.
    """포럼에 글을 올리거나(스레드 id = 첫 메시지 id) 올린 글의 첫 메시지를 고친다."""
    auth = {"Authorization": f"Bot {token}"}
    embed = build(note)
    thread_id = note.get("thread_id")
    if thread_id and note.get("message_id"):
        request(f"{API}/channels/{thread_id}/messages/{note['message_id']}", "PATCH", {"embeds": [embed]}, auth)
        return thread_id, note["message_id"]
    body = {
        "name": embed["title"][:100],
        "message": {"embeds": [embed]},
        "applied_tags": [forum["tag_id"]],
    }
    created = request(f"{API}/channels/{forum['forum_id']}/threads", "POST", body, auth)
    return created["id"], created["message"]["id"] if "message" in created else created["id"]


def main():
    # 사용법: post.py [notes.json] [--version v0.35.0]  (--version이면 그 버전 항목만 처리한다)
    only = sys.argv[sys.argv.index("--version") + 1] if "--version" in sys.argv else None
    notes = json.loads(NOTES.read_text())
    for note in notes:
        if only and note["version"] != only:
            continue
        channel = note.get("channel")
        action = "edit" if note.get("message_id") else "post"
        forum = forum_config(channel)
        if forum:
            token = bot_token()
            if not token:
                print(f"{note['version']} skip: DISCORD_BOT_TOKEN not set")
                continue
            note["thread_id"], note["message_id"] = send_forum(forum, token, note)
        else:
            url = webhook_url(channel)
            if not url:
                print(f"{note['version']} skip: {env_key(channel)} not set")
                continue
            note["message_id"] = send(url, note)
        print(f"{note['version']} {note['date']} [{channel or DEFAULT_CHANNEL}] {action} ok")
        NOTES.write_text(json.dumps(notes, ensure_ascii=False, indent=2) + "\n")
        time.sleep(1.0)


if __name__ == "__main__":
    main()
