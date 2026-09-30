# Roll & Call

TRPG 세션 구인·예약 서비스. 구인글을 올리면 디스코드로 알림이 가고, 참가 신청·대기·확정·출석·후기까지 한곳에서 관리한다.

## 구성

| 경로                    | 설명                                                |
| ----------------------- | --------------------------------------------------- |
| `apps/web`              | 사용자 앱 (Next.js App Router, FSD 구조)            |
| `apps/admin`            | 운영진용 어드민 (데스크톱, 포트 3001)               |
| `packages/database`     | Drizzle 스키마·마이그레이션, 공용 도메인 규칙       |
| `packages/ui`           | 디자인 시스템 (`@roll-and-call/ui`)                 |
| `packages/tiptap`       | 리치 텍스트 에디터·뷰어·문서 모델                   |
| `packages/discord`      | Discord REST 클라이언트                             |
| `packages/review-forum` | 공개 후기를 디스코드 포럼 글로 동기화               |
| `functions/*`           | Supabase Edge Functions (세션 알림, 고아 파일 정리) |
| `configs/*`             | 공용 TypeScript·oxlint 설정                         |

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
