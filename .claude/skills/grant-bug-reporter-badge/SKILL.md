---
name: grant-bug-reporter-badge
description: >
  버그를 제보한 유저에게 히든 칭호 「🕯️ 작은 등불」(브론즈, sp.lantern)을 지급한다.
  "작은 등불 줘", "버그 제보자 칭호 지급" 같은 요청에 사용한다.
  인자: 1) 유저 ID(프로필 uuid 또는 디스코드 ID) 2) 서버 이름(servers.name 또는 slug).
---

# 버그 제보자 칭호 지급

사용자가 직접 정한 사람에게만 준다. 히든 업적이라 받기 전에는 이름·조건이 「???」로 가려진다. 재계산(크론·이벤트)이 건드리지 않는 granted 칭호이고,
받는 사람에게는 알림과 홈 획득 시트가 간다.

## 절차

1. 인자 두 개(유저 ID, 서버 이름)를 확인한다. 하나라도 없으면 되묻는다. 추측으로 후보를 훑지 않는다.
2. `apps/web`에서 실행한다.

   ```bash
   cd apps/web
   NODE_OPTIONS=--conditions=react-server pnpm dlx tsx --env-file=.env.local \
     scripts/grant-bug-reporter-badge.mts "<유저 ID>" "<서버 이름>"
   ```

3. 출력으로 결과를 확인해 한국어로 알린다.
   - `🕯️ 작은 등불 지급: …` — 새로 지급됨
   - `이미 받았습니다: …` — 변화 없음(멱등)
   - 오류(서버·유저를 못 찾음, 서버 멤버가 아님)는 그대로 전하고 올바른 값을 묻는다.

`.env.local`의 `DATABASE_URL`은 운영 DB를 가리키므로 실행 자체가 운영 데이터 변경이다. 인자를 사용자가 준 그대로 쓴다.
