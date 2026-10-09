# Roll & Call

ORPG 세션 구인·예약 서비스. 구인글을 올리면 디스코드로 알림이 가고, 참가 신청·대기·확정·출석·후기까지 한곳에서 관리한다.

## 구성

| 경로                    | 설명                                                          |
| ----------------------- | ------------------------------------------------------------- |
| `apps/web`              | 사용자 앱 (Next.js App Router, FSD 구조)                      |
| `apps/admin`            | 운영진용 어드민 (데스크톱, 포트 3001)                         |
| `packages/database`     | Drizzle 스키마·마이그레이션, 서버 범위 쿼리, 공용 도메인 규칙 |
| `packages/ui`           | 디자인 시스템 (`@roll-and-call/ui`)                           |
| `packages/tiptap`       | 리치 텍스트 에디터·뷰어·문서 모델                             |
| `packages/discord`      | Discord REST 클라이언트                                       |
| `packages/review-forum` | 공개 후기를 디스코드 포럼 글로 동기화                         |
| `functions/*`           | Supabase Edge Functions (세션 알림, 고아 파일 정리)           |
| `configs/*`             | 공용 TypeScript·oxlint 설정                                   |

스택: Next.js 16 · Supabase (Auth·Postgres·Storage·pg_cron) · Drizzle · Discord Bot(REST) · Turborepo · pnpm · Vercel

## 시작하기

Node 22+, pnpm 11이 필요하다.

```bash
pnpm install
cp apps/web/.env.example apps/web/.env.local
cp apps/admin/.env.example apps/admin/.env.local
# 각 .env.local에 Supabase·Discord 값을 채운다
pnpm dev   # web :3000, admin :3001
```

DB 연결은 Supabase 풀러를 쓴다. web은 트랜잭션 풀러(`:6543`), admin은 세션 풀러(`:5432`)를 권장한다.

## 명령어

```bash
pnpm dev | build | typecheck | test     # turbo로 전체 실행
pnpm lint                               # oxlint
pnpm format                             # oxfmt
pnpm -F @roll-and-call/web lint:fsd     # FSD 경계 검사
pnpm -F @roll-and-call/web lint:tokens  # 디자인 토큰 검사
pnpm -F @roll-and-call/database db:generate | db:migrate | db:studio
```

## 문서

- 프론트엔드 규칙(FSD·컴포넌트): [`apps/web/docs/frontend-conventions.md`](apps/web/docs/frontend-conventions.md)

## 배포

`main`에 푸시하면 Vercel에서 web·admin 두 프로젝트가 함께 배포된다. Edge Functions와 DB 마이그레이션은 따로 적용한다.

## 크론

매일 도는 앱 작업은 Vercel Cron(`apps/web/vercel.json`, GET)이, 앱 로직이 필요한 분 단위 작업은 Supabase pg_cron이 `net.http_post`로 Next 라우트(`/api/cron/*`, POST)를 부른다. 두 방식 모두 `Authorization: Bearer {CRON_SECRET}`을 보내고, 라우트는 `isCronRequest`(`apps/web/src/shared/server`)로 확인한다. 일정은 UTC다.

| 이름                      | 일정 (UTC)     | 부르는 곳                          | 방식                    |
| ------------------------- | -------------- | ---------------------------------- | ----------------------- |
| `purge-light-audit-log`   | `0 19 * * *`   | SQL                                | pg_cron                 |
| `purge-orphan-files`      | `0 20 * * *`   | Edge Function `purge-orphan-files` | pg_cron → Edge Function |
| `purge-notifications`     | `30 18 * * *`  | SQL                                | pg_cron                 |
| `session-reminders`       | `*/5 * * * *`  | Edge Function `session-reminders`  | pg_cron → Edge Function |
| `draw-lotteries`          | `*/10 * * * *` | `/api/cron/draws`                  | pg_cron → Next 라우트   |
| `attendance-auto-confirm` | `5 * * * *`    | `/api/cron/attendance`             | pg_cron → Next 라우트   |
| `judge-min-players`       | `*/10 * * * *` | `/api/cron/min-players`            | pg_cron → Next 라우트   |
| `expire-selection-deadlines` | `*/10 * * * *` | `/api/cron/selection-deadline` | pg_cron → Next 라우트   |
| `notify-session-ended`    | `*/5 * * * *`  | `/api/cron/session-ended`          | pg_cron → Next 라우트   |
| badges                    | `5 15 * * *`   | `/api/cron/badges`                 | Vercel Cron             |
| members                   | `10 19 * * *`  | `/api/cron/members`                | Vercel Cron             |

pg_cron → Next 라우트 규칙: 라우트는 `export async function POST`만 두고 Vercel이 부르지 않는다. 한 번 실행에 처리한 수를 `{ ok: true, ... }`로 돌려준다. 오래 걸릴 수 있으면 `export const maxDuration = 60`을 둔다.

### Vault 값

Edge Function용 `project_url`·`anon_key`와 따로, Next 라우트용 값 두 개를 Supabase SQL 편집기에서 넣는다. 값은 git에 두지 않는다.

```sql
-- app_url: 사용자 앱 주소, 끝에 / 없이
select vault.create_secret('https://rollandcall.xyz', 'app_url');
-- cron_secret: Vercel web 프로젝트의 CRON_SECRET과 같은 값
select vault.create_secret('<CRON_SECRET 값>', 'cron_secret');

-- 확인
select name, decrypted_secret from vault.decrypted_secrets where name in ('app_url', 'cron_secret');

-- 바꾸기
select vault.update_secret((select id from vault.secrets where name = 'cron_secret'), '<새 값>');
```

`CRON_SECRET`을 바꿀 때는 Vercel 환경 변수와 Vault의 `cron_secret`을 함께 바꾼다. 한쪽만 바꾸면 Vercel 크론이나 pg_cron 크론이 401로 실패한다.

### 새 라우트 크론 등록

크론을 등록하는 마이그레이션은 아래를 복사해 `<이름>`·`<일정>`만 바꾼다(0040과 같은 모양). 라우트가 배포되고 Vault 값이 들어간 뒤에 적용한다.

```sql
SELECT cron.schedule(
  '<이름>',
  '<일정>',
  $$SELECT net.http_post(
    url := (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'app_url') || '/api/cron/<이름>',
    headers := jsonb_build_object(
      'Authorization',
      'Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'cron_secret'),
      'Content-Type',
      'application/json'
    ),
    timeout_milliseconds := 60000
  )$$
);
```

### 확인

```sql
select jobname, schedule from cron.job;
select status, return_message from cron.job_run_details order by start_time desc limit 20;
select id, status_code, content from net._http_response order by created desc limit 20;
```
