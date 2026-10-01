-- 인덱스의 내 서버 목록을 최근 방문 순으로 늘어놓기 위한 칸. 기존 멤버는 비워 두고 다음 방문 때 채운다.
ALTER TABLE "server_members" ADD COLUMN "last_visited_at" timestamp with time zone;