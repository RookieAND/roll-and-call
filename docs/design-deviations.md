# 시안과 다르게 구현한 곳

2026-10-05 기준. 코드 프롬프트(C01~C03, W01~W19, A1~A8) 구현 중 시안 보드와 다르게 만든 곳 전체입니다. 이유별로 묶었고, 각 항목에 코드 위치와 어떻게 바꿨는지를 적었습니다.

- 코드 위치는 작업 시점의 `main` 기준 경로(줄 번호는 어긋날 수 있음)입니다.
- `코드 위치 미확인`은 문구로 찾지 못한 항목입니다. 그 항목은 화면 설명이 코드에 직접 남지 않는 경우(없앤 요소, 조건 분기 등)가 많습니다.

## 요약

| 이유        | 건수 |
| ----------- | ---- |
| 명세 지시   | 145  |
| DS 제약     | 15   |
| 시안 없음   | 13   |
| 기존 유지   | 13   |
| 외부 자산   | 1    |
| 사용자 결정 | 6    |
| 합계        | 193  |

코드 위치 미확인: 14건

## 명세 지시 (145건)

기획자 코드 명세가 시안과 다르게 지정해서 명세를 따른 것입니다. 대부분 문구, 줄 수, 배지 색, 칸 구성입니다.

### C01-4

| 화면                          | 시안                             | 실제          | 코드 위치                                                   | 수정 내용                                                                               |
| ----------------------------- | -------------------------------- | ------------- | ----------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| 07 서버 홈 · 임시 닉네임 안내 | Callout warning(노랑)            | gray          | `apps/web/src/views/home/ui/home-nickname-notice.tsx:9`     | Callout.Root colorPalette를 gray(size sm)로 지정해 시안의 노랑 대신 회색 안내로 그렸다. |
| 07 서버 홈 · 임시 닉네임 안내 | 닉네임을 '달빛토끼2'(작은따옴표) | 「달빛토끼2」 | `apps/web/src/views/home/ui/home-nickname-notice.tsx:11-14` | 안내 문장 속 닉네임을 작은따옴표 대신 낫표로 감싸 표기한다.                             |

### C03-3

| 화면                      | 시안                                                | 실제                                                | 코드 위치                                               | 수정 내용                                        |
| ------------------------- | --------------------------------------------------- | --------------------------------------------------- | ------------------------------------------------------- | ------------------------------------------------ |
| 19 알림 · [할 일] 빈 상태 | 「새로 할 일이 생기면 홈 맨 위 배너로도 알립니다.」 | 「새로 할 일이 생기면 홈 맨 위에도 알려 드립니다.」 | `apps/web/src/views/notifications/ui/todo-panel.tsx:35` | 빈 상태 description 문구를 명세 문구로 교체했다. |

### C03-4

| 화면                        | 시안             | 실제              | 코드 위치                                            | 수정 내용                                                    |
| --------------------------- | ---------------- | ----------------- | ---------------------------------------------------- | ------------------------------------------------------------ |
| 09 홈 · 할 일 배너(막힌 일) | 삼각 경고 아이콘 | CircleAlert(원형) | `apps/web/src/views/home/ui/home-todo-banner.tsx:21` | 막힌 일이 있으면 Icon을 CircleAlert로, 아니면 Bell로 고른다. |

### A1-3

| 화면               | 시안                                                                              | 실제                                                                                              | 코드 위치                                                                                                                                                                                                      | 수정 내용                                                                                                                                               |
| ------------------ | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 어드민 1 c_direct  | 머리 Callout Title, 받는 사람 muted                                               | 둘 다 hint 글자                                                                                   | 코드 위치 미확인                                                                                                                                                                                               | 코드 위치 미확인                                                                                                                                        |
| 어드민 3 user_kick | 사유 칩, 「…참여자 신청은 닫힙니다」, 「운영진이 서버에서 추방했습니다. 사유: …」 | 사유 Textarea(칩은 A3), 「…취소됨으로 바뀝니다」, 「{서버} 서버에서 추방되었습니다.」/「사유: …」 | `apps/admin/src/features/kick-member/ui/kick-member-dialog.tsx:121`<br>`apps/admin/src/features/kick-member/model/kick-impact-lines.ts:6`<br>`apps/admin/src/features/kick-member/model/kick-notice-text.ts:3` | 사유 입력을 ReasonChips 자리에 두고(칩은 A3 몫), 영향 문구와 안내 DM 문구를 명세대로 만들었다(비고 코드상 ReasonChips 사용 중이라 현재는 칩일 수 있음). |

### A1-5

| 화면                             | 시안                                                                                     | 실제                                                                                              | 코드 위치                                                                                                                                                                       | 수정 내용                                                                                    |
| -------------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| 어드민 1 home                    | 「이번 주」「지난주 N건 대비」, 가로축 끝 「이번 주」                                    | 「최근 7일」「지난 7일 N건 대비」, 가로축 끝 짧은 날짜 범위                                       | `apps/admin/src/views/home/ui/home-view.tsx:22-32`<br>`apps/admin/src/views/home/model/short-day-range.ts`                                                                      | 제목을 「최근 7일」로 바꾸고 가로축 마지막 칸 라벨을 shortDayRange(24~30일 형식)로 만들었다. |
| 어드민 1 home_empty              | 「…생기면 여기에 표시됩니다.」                                                           | 「…들어오면 여기에 표시됩니다.」                                                                  | `apps/admin/src/views/home/ui/home-view.tsx:66`                                                                                                                                 | 빈 상태 description을 「…들어오면 여기에 표시됩니다.」로 썼다.                               |
| 어드민 1 palette                 | 단축키 안내 없음                                                                         | 「단축키 G+C·B·R」 줄                                                                             | `apps/admin/src/features/quick-search/ui/palette-footer.tsx:29`                                                                                                                 | 팔레트 하단에 hint 글자로 「단축키 G+C·B·R」를 오른쪽 정렬해 추가했다.                       |
| 어드민 1 server_select·BotBanner | 「운영할 서버를 골라 주세요」, 「…디스코드 연동이 중단되었습니다. 데이터는 유지됩니다.」 | 「관리할 서버를 골라 주세요」, 「…디스코드 글을 올리지 못합니다. 데이터는 그대로 남아 있습니다.」 | `apps/admin/src/views/server-select/ui/server-select-view.tsx:21`<br>`apps/admin/src/shared/ui/bot-banner.tsx:15`<br>`apps/admin/src/views/server-select/ui/server-card.tsx:53` | 제목과 봇 제거 안내 문구를 명세 문구로 교체했다.                                             |

### A1-4

| 화면                     | 시안                                                | 실제                             | 코드 위치        | 수정 내용        |
| ------------------------ | --------------------------------------------------- | -------------------------------- | ---------------- | ---------------- |
| 어드민 7 settings_server | 운영진 채널 안내 두 문장 + 「비워 둘 수 있습니다…」 | 명세 두 줄, 비었을 때 칸 안 hint | 코드 위치 미확인 | 코드 위치 미확인 |

### W04

| 화면                      | 시안                                                                 | 실제                                                              | 코드 위치                                                                                                                                                                                                                  | 수정 내용                                                                                                                 |
| ------------------------- | -------------------------------------------------------------------- | ----------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| 04 A·B 숫자 카드          | 「확정 4명」                                                         | 「확정 4/4」                                                      | `apps/web/src/views/manage-participants/ui/roster-stats.tsx:33`<br>`apps/web/src/entities/game/model/seat-count.ts:36`                                                                                                     | 확정 칸 값을 확정수/정원 형태로 표시한다.                                                                                 |
| 04 B 신청자 없이 마감     | 「모집 마감」 배지, 뽑을 인원 파랑                                   | 배지·강조 없음                                                    | `apps/web/src/views/manage-participants/ui/roster-stats.tsx:25`                                                                                                                                                            | 뽑을 인원 칸에서 배지를 빼고 drawTone 강조를 신청자 없는 경우에는 주지 않는다.                                            |
| 04 B 마감 전 신청 0명     | 회색 안내 「아직 참여 신청자가 없습니다」                            | 지움                                                              | 코드 위치 미확인                                                                                                                                                                                                           | 코드 위치 미확인(해당 문구가 저장소에 남아 있지 않아 삭제된 것으로 보임)                                                  |
| 04 A 안내 줄              | 「기한이 지나도 명단은 계속 고칠 수 있습니다.」                      | 「…세션이 끝날 때까지 고칠 수 있습니다.」                         | `apps/web/src/views/manage-participants/ui/deadline-card.tsx:27`                                                                                                                                                           | 안내 문구를 「기한이 지나도 명단은 세션이 끝날 때까지 고칠 수 있습니다.」로 바꿨다.                                       |
| 04 C 멤버 시트            | 설명 마침표 없음                                                     | 마침표 붙임                                                       | 코드 위치 미확인                                                                                                                                                                                                           | 코드 위치 미확인(apps/web/src/features/adjust-roster/ui/member-sheet-subline.ts 근처로 추정)                              |
| 04 D 시작 뒤 대기 줄      | 「대기 n번」                                                         | 「M월 D일 HH:mm:ss 신청」                                         | `apps/web/src/views/manage-participants/ui/roster-queues.tsx:133`                                                                                                                                                          | 대기 줄 note를 신청 시각(toKst joinedAt format)으로 표시한다.                                                             |
| 04 D 시작 뒤 확정 헤더    | 「3/4」                                                              | 「n명」                                                           | `apps/web/src/views/manage-participants/ui/roster-queue.tsx:31`                                                                                                                                                            | 큐 헤더 숫자를 count+「명」으로만 보여 준다.                                                                              |
| 04 D 불참으로 내보내기 창 | [닫기]                                                               | [취소]                                                            | 코드 위치 미확인                                                                                                                                                                                                           | 코드 위치 미확인(apps/web/src/features/adjust-roster/ui/mark-absent-dialog.tsx에서 문구 확인 못함)                        |
| 04 E 자리 없음            | 「참여자를 내보내야 새로 추가할 수 있습니다.」                       | 「확정에서 한 명을 대기로 옮기거나 내보내면 추가할 수 있습니다.」 | `apps/web/src/features/adjust-roster/ui/seats-full-notice.tsx:12`                                                                                                                                                          | 자리 없음 안내의 둘째 줄을 명세 문구로 교체했다.                                                                          |
| 04 E 결과 없음            | 작은따옴표로 이름                                                    | 따옴표 없음                                                       | `apps/web/src/features/adjust-roster/ui/candidate-search-empty.tsx:15`                                                                                                                                                     | 결과 없음 문구를 「검색 결과 0명」으로 두어 이름 따옴표를 쓰지 않는다.                                                    |
| 04 E 검색 오류            | 한 줄                                                                | 두 줄                                                             | `apps/web/src/features/adjust-roster/ui/direct-confirm-sheet.tsx:66`                                                                                                                                                       | 검색 실패를 시트 안 목록 자리에서 알리도록 하고 문구를 두 줄로 나눴다(줄 단위 문구는 이 파일 안에서 확인).                |
| 04 F 다음 회차            | 「같은 게임을…」「게임 정보」, 「이미 낸 가능 시간」 줄, Select 날짜 | 「같은 구인을…」「구인 정보」, 줄 없음, DatePicker                | `apps/web/src/views/manage-participants/ui/next-round-banner.tsx:24`<br>`apps/web/src/features/open-next-round/ui/next-round-carry-list.tsx:8-11`<br>`apps/web/src/features/open-next-round/ui/next-round-sheet.tsx:82-96` | 용어를 구인으로 바꾸고 가능 시간 줄을 빼고 날짜 선택을 DatePicker와 DateTimePicker로 구현했다.                            |
| 04 B 확인 창              | 마감 뒤 바로 굴림                                                    | 마감 뒤에도 확인 창                                               | `apps/web/src/features/adjust-roster/ui/draw-lottery-card.tsx:15-45`                                                                                                                                                       | 마감 전후 모두 ConfirmDialog를 거쳐 drawLottery를 부르고 취소 라벨만 마감 여부로 가른다.                                  |
| 04 대기로 이동 알림       | 시안 메모: 토스트 사라진 뒤 보냄                                     | 즉시                                                              | 코드 위치 미확인                                                                                                                                                                                                           | 코드 위치 미확인(apps/web/src/features/adjust-roster/ui/demote-member-item.tsx와 api/demote-participant.ts 주변으로 추정) |

### A6

| 화면                         | 시안                                                           | 실제                                                                      | 코드 위치                                                                                                                 | 수정 내용                                                                                                |
| ---------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| 어드민 6 analytics           | 「최근 4주」 굵기 700                                          | 500                                                                       | `apps/admin/src/views/analytics/ui/period-bar.tsx:11-12`                                                                  | 「최근 4주」 Text를 weight medium으로 지정했다.                                                          |
| 어드민 6 analytics           | 기간 끝 날짜 어제, 「2026년 8월 25일 ~ 2026년 9월 21일」       | formatDayRange, 끝 날짜 오늘                                              | `apps/admin/src/views/analytics/model/period-description.ts:11`                                                           | formatDayRange(period.from, period.to)로 기간 문구를 만들어 끝 날짜가 오늘이 된다.                       |
| 어드민 6 analytics_early     | 「데이터가 더 쌓이면 보입니다」                                | 「…이 자리에 보입니다」                                                   | `apps/admin/src/views/analytics/ui/early-notice.tsx:31-39`                                                                | 안내 제목과 aria-label을 「데이터가 더 쌓이면 이 자리에 보입니다」로 썼다.                               |
| 어드민 6 analytics_gm_few    | 안내 줄 muted                                                  | hint                                                                      | `apps/admin/src/views/analytics/ui/gm-few-notice.tsx:10`                                                                  | 안내 Text의 foreground를 hint로 지정했다.                                                                |
| 어드민 6 analytics·grid_open | 선택 칸 다른 탭 값이 오른쪽 옆                                 | 큰 값 아래 회색 한 줄                                                     | `apps/admin/src/views/analytics/ui/cell-detail.tsx:20-34`                                                                 | 선택 칸 상세에서 큰 값 아래에 hint 글자 한 줄로 보조 값을 쌓았다.                                        |
| 어드민 6 analytics           | 세션 추이 안내 줄 없음                                         | 범례 아래 안내 한 줄                                                      | `apps/admin/src/views/analytics/ui/trend-note.tsx:5-6`                                                                    | 범례 아래에 TrendNote(시간 미정 구인 배치 안내)를 오른쪽 정렬 hint 한 줄로 추가했다.                     |
| 어드민 6 analytics           | 참여자 추이 보조 문구 없음, 「참여한 사람의 23%」              | 「이번 주를 뺀 지난 4주」, 「최근 4주 참여한 사람의 {p}%」                | `apps/admin/src/views/analytics/ui/people-section.tsx:22`<br>`46`                                                         | 섹션 sub와 첫 참여 비율 문구를 명세 문구로 썼다.                                                         |
| 어드민 6 analytics_loading   | 「구인을 연 GM」, 막대 12, 참여자 추이 뼈대, 6×7, GM 분포 없음 | 「세션을 진행한 GM」, 막대 8, 참여자 추이 없음, 7×7·탭·범례, GM 분포 뼈대 | `apps/admin/src/views/analytics/ui/analytics-loading.tsx:16-49`                                                           | 로딩 뼈대의 라벨을 「세션을 진행한 GM」으로 하고 SkeletonBars count를 8로, 격자·탭·범례를 넣어 만들었다. |
| 어드민 6 analytics           | PageHead 18px 여백                                             | 머리말 시작선 = 920px 칸 + 16px                                           | `apps/admin/src/views/analytics/ui/analytics-view.tsx:29`<br>`apps/admin/src/views/analytics/ui/analytics-loading.tsx:26` | 본문을 max-w-content 칸에 p-200 안쪽 여백으로 두어 머리말 시작선을 맞췄다.                               |

### A5

| 화면                             | 시안                                                            | 실제                                                                | 코드 위치                                                                                | 수정 내용                                                                                                                                    |
| -------------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| 어드민 5 ns_restore·ns_edit_done | 취소된 기록 창과 되돌리기 창이 따로(「되돌리기 확정」)          | 한 창에서 사유·알림 미리보기·[취소 되돌리기]                        | `apps/admin/src/features/cancel-no-show/ui/cancel-no-show-dialog.tsx:24-60`              | 하나의 Dialog 안에서 record.cancellation이 있으면 되돌리기 폼(사유·알림 미리보기·확정 라벨 「취소 되돌리기」)을 보여 준다.                   |
| 어드민 5 ns_edit_done            | 처리한 운영진 카드에 「취소 사유는 활동 기록에 남아 있습니다.」 | 「{운영진} · {날짜}」만                                             | `apps/admin/src/features/cancel-no-show/ui/cancel-no-show-dialog.tsx:53-57`              | 처리한 운영진 ItemCard의 meta를 「{by} · {formatDateTime(at)}」로만 채웠다.                                                                  |
| 어드민 5 ns_edit                 | 「사정을 확인한 뒤 기록을 취소합니다」, 라벨 「사유」           | 「사정을 확인했다면 사유를 적어 기록을 취소합니다.」, 「취소 사유」 | `apps/admin/src/features/cancel-no-show/ui/cancel-no-show-dialog.tsx:74-76`              | 불참 취소 폼 copy의 description과 reasonLabel을 명세 문구로 썼다.                                                                            |
| 어드민 5 ns_add_filled           | 미리보기 둘째 줄 「이의가 있으면 운영진에게 문의해 주세요.」    | 「운영진이 기록했습니다.」                                          | `packages/database/src/modules/notifications/model/notification-text.ts:104-109`         | absenceAddedByStaff 알림 본문의 둘째 줄을 「운영진이 기록했습니다.」로 썼다.                                                                 |
| 어드민 5 ns_add                  | 강조 행만(라디오 점 없음)                                       | 라디오 점                                                           | `apps/admin/src/features/add-no-show/ui/option-row.tsx:20-22`<br>`option-list.tsx:21`    | 각 선택 행을 Radio.Field 안의 Radio.Root과 Radio.Indicator로 그려 라디오 점이 보이게 하고 목록은 DS RadioGroup으로 감쌌다.                   |
| 어드민 5 ns_add                  | (사유 칩, 명세)                                                 | 시안 RadioList 따라 라디오 목록                                     | `apps/admin/src/features/add-no-show/ui/option-list.tsx:21-31`<br>`option-row.tsx:13-31` | 명세의 사유 칩 대신 시안의 RadioList 모양대로 RadioGroup 안에 OptionRow를 세로로 나열했다(비고: 명세 대신 시안을 따른 쪽이라 분류가 애매함). |

### W12

| 화면                    | 시안                           | 실제                             | 코드 위치                                                                                                 | 수정 내용                                                                                                                              |
| ----------------------- | ------------------------------ | -------------------------------- | --------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| 12 B 추첨 직후          | GM 미리보기 화면               | 만들지 않음                      | apps/web/src/views/draw-result/ui/draw-result-view.tsx:20 (GM은 미리보기 없이 곧바로 결과판)              | GM 미리보기 구역을 만들지 않고 GM·직접 확정자 등은 결과판(applied-draw.tsx)으로 바로 보낸다.                                           |
| 12 C 확정 통            | renderVals subtitle1·heading2  | body3·heading3 muted             | `apps/web/src/views/draw-result/ui/draw-roll-text.tsx:23`<br>`27`<br>`draw-row.tsx:40`                    | 내 줄이 아닌 값은 heading3 muted, 이름은 body3으로 두어 강조 변형을 쓰지 않았다.                                                       |
| 12 H 직접 확정자 결과   | 추첨 확정자 숫자 heading2 굵게 | 내 줄만 heading2                 | `apps/web/src/views/draw-result/ui/draw-roll-text.tsx:14-34`<br>`draw-row.tsx:29`                         | typography를 isMe일 때만 heading2, 나머지는 heading3로 갈라 강조를 내 줄에만 준다.                                                     |
| 12 G 하단 날짜          | 고정 예시                      | formatDateTime 실제 시각         | `apps/web/src/views/draw-result/ui/draw-summary.tsx:4`<br>`37`                                            | 하단 날짜를 고정 문구 대신 formatDateTime(drawnAt)으로 실제 추첨 시각을 보인다.                                                        |
| 12 F 대성공·극단적 성공 | 3초 숫자 굴린 뒤 칩 등장       | 칩은 바로, 칩 안 숫자가 3초 슬롯 | apps/web/src/views/draw-result/ui/graded-roll.tsx:54, slot-number.tsx:15 (SLOT_SPIN_MS는 model/slot-spin) | 칩(pill)은 animate-roll-in으로 바로 나타나고 안의 숫자만 SlotNumber가 3초 동안 굴러 멈춘다(기존 이펙트 유지 지시와 명세의 3초가 겹침). |

### W11

| 화면                            | 시안                                          | 실제                              | 코드 위치                                                                  | 수정 내용                                                                                 |
| ------------------------------- | --------------------------------------------- | --------------------------------- | -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| 11 B 확정 확인 창 넷째 줄       | 「…님에게 불참 기록을 알림 탭으로 알립니다.」 | 「…님에게 알림 탭으로 알립니다.」 | `apps/web/src/features/confirm-attendance/model/confirm-description.ts:10` | 확인 창 마지막 줄 문구를 「불참 기록을」 없이 「…님에게 알림 탭으로 알립니다.」로 바꿨다. |
| 11 B-2 다시 고치는 중 아래 hint | 「처음 값은 직전 결과입니다.」                | 없음                              | `apps/web/src/features/confirm-attendance/ui/attendance-guide.tsx:61`      | 다시 고치는 중 안내는 Callout 제목 한 줄만 두고 시안의 hint 문구는 넣지 않았다.           |

### A7

| 화면                        | 시안                                                                           | 실제                                                                                                 | 코드 위치                                                                                                                             | 수정 내용                                                                                                             |
| --------------------------- | ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| 어드민 7 log 뱃지           | 위험 조치만 빨강, 나머지 회색                                                  | 불참 취소 파랑, 승인·직접 인증·해제 초록, 반려·제재·취소 빨강                                        | `apps/admin/src/shared/lib/action-tone.ts:3-12`<br>`apps/admin/src/views/audit-log/ui/audit-log-table.tsx:65`                         | actionTone이 조치 이름으로 primary·success·danger·gray를 정하고 로그 표 Tag가 그 색을 쓴다.                           |
| 어드민 7 log                | 검색 자리표시 「대상 닉네임 검색」, 칩 「대상: 김코코 ×」                      | 「대상 검색」, 「대상 · {이름}」+✕                                                                   | `apps/admin/src/views/audit-log/ui/audit-log-view.tsx:59-70`                                                                          | 검색 placeholder를 「대상 검색」으로, 필터 칩을 「대상 · {targetName}」과 지우기 링크(✕)로 바꿨다.                    |
| 어드민 7 log·log_sort       | 보관 안내에 운영진 메모 포함                                                   | 룰북 수정·연결만                                                                                     | `apps/admin/src/views/audit-log/model/retention-note.ts:3`<br>`packages/database/src/modules/moderation/model/audit-actions.ts:31`    | 보관 안내를 EXPIRING_AUDIT_ACTIONS(룰북 수정·연결)로 만들어 메모는 계속 보관 쪽으로 빠졌다.                           |
| 어드민 7 log_detail         | 「대상」 칸                                                                    | 지움, 「보관」·「운영진 채널」 칸(조건부)                                                            | `apps/admin/src/views/audit-entry/ui/audit-entry-view.tsx:33-34`                                                                      | 상세 항목에서 「대상」을 빼고 남은 날이 있으면 「보관」, staffChannelLine이 있으면 「운영진 채널」만 조건부로 넣는다. |
| 어드민 7 settings_staff     | 권한 표 3행, 빈칸 「—」, 안내 한 줄                                            | 4행, 빈칸 비움, 안내 세 줄                                                                           | `apps/admin/src/views/settings/model/permission-rows.ts:1-6`<br>`permission-panel.tsx:19`<br>`permission-mark.tsx`                    | PERMISSION_ROWS를 4행으로 늘리고 없는 권한은 빈칸으로 두며 PERMISSION_NOTES 세 줄을 hint로 그린다.                    |
| 어드민 7 settings_staff_add | 「디스코드 서버에 있는 멤버…」「디스코드 닉네임 검색」, 체크 오른쪽, hint 없음 | 「이 서버에 가입한 멤버…」「가입한 유저 닉네임 검색」, 체크 왼쪽, 「당사자의 알림 탭으로 알립니다.」 | `apps/admin/src/features/add-staff/ui/add-staff-dialog.tsx:57`<br>`62`<br>`93`<br>`staff-candidate-row.tsx`                           | 설명·검색 문구를 가입 유저 기준으로 바꾸고 후보 행 체크를 왼쪽에 두며 NotificationPreview recipients 문구를 달았다.   |
| 어드민 7 settings_server    | 디스코드 연동 4칸                                                              | 후기 포럼까지 5칸                                                                                    | `apps/admin/src/features/edit-server-settings/model/setting-field.ts:12`<br>`apps/admin/src/views/settings/ui/discord-link-panel.tsx` | SETTING_FIELDS에 reviewForumChannelId(후기 포럼 채널 ID)를 더해 연동 칸이 5개가 된다.                                 |

### A3

| 화면                           | 시안                                                  | 실제                                                                      | 코드 위치                                                                                                                                                                          | 수정 내용                                                                                         |
| ------------------------------ | ----------------------------------------------------- | ------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| 어드민 3 users                 | 「활성·탈퇴·차단됨」 탭마다 건수, 칩 툴팁 없음        | 「활동 중·나감·차단됨」(차단됨만 건수), 칩 툴팁                           | `apps/admin/src/shared/lib/membership-status.ts:6-8`<br>`apps/admin/src/views/users/ui/membership-segment.tsx:16`<br>`28`<br>`user-filter-chips.tsx:44`                            | 라벨을 MEMBERSHIP_LABEL로 바꾸고 차단됨만 0이 아닐 때 건수를 붙이며 필터 칩을 Tooltip으로 감쌌다. |
| 어드민 3 users 상태 칸         | 정상은 빈칸                                           | 정상·나감 회색 글자, 「해제될 때까지」                                    | `apps/admin/src/views/users/model/user-state-cell-text.ts:7-16`<br>`ui/user-state-cell.tsx`                                                                                        | 제재 중이 아니면 「정상」·「나감」 회색 글자를 보이고 기간 없는 제재는 「해제될 때까지」를 쓴다.  |
| 어드민 3 user_detail_cert      | 형식 칸, 「처리 일자」                                | 형식 칸 없음, 「… 승인/신청/반려」                                        | `apps/admin/src/views/user-detail/model/to-cert-rows.ts:35`<br>`ui/cert-panel.tsx`                                                                                                 | 인증 표에서 형식 칸을 없애고 날짜 칸에 「날짜 승인」 같은 상태 접미를 붙였다.                     |
| 어드민 3 user_detail           | 「정상」 초록 / 「신규」 primary / 불참 「유효」 빨강 | 정상 회색 / 신규 primary 유지(명세는 회색) / 유효 회색                    | apps/admin/src/shared/lib/status-tone.ts (정상 gray, 신규 primary, 유효 gray), views/user-detail/ui/user-state-tag.tsx:19                                                          | STATUS_TONE에서 정상·유효를 gray로 두고 신규는 전 화면 통일을 위해 primary를 유지했다.            |
| 어드민 3 user_detail_memo      | 탭 설명 마침표 없음                                   | 마침표                                                                    | `apps/admin/src/views/user-detail/ui/memo-panel.tsx:25`                                                                                                                            | 메모 탭 설명을 「사용자에게 보이지 않는 메모입니다.」로 마침표를 붙였다.                          |
| 어드민 3 user_detail 조치 패널 | 안내 상자 없음                                        | 「제재에는 사용자에게 보여 줄 사유가 필요합니다.」                        | `apps/admin/src/views/user-detail/ui/user-actions-aside.tsx:111`                                                                                                                   | 조치 패널에 Callout.Description 안내 한 줄을 추가했다.                                            |
| 어드민 3 memo_delete·memo_edit | 「메모 지우기」, 「…가 쓴 메모입니다」 줄, 입력 3줄   | 「지우기」, 그 줄 없음, 4줄                                               | `apps/admin/src/views/user-detail/ui/memo-row-menu.tsx:34`<br>`features/delete-staff-memo/ui/delete-memo-dialog.tsx:52`<br>`features/write-staff-memo/ui/staff-memo-dialog.tsx:63` | 버튼 이름을 「지우기」로 줄이고 작성자 줄을 빼며 Textarea rows를 4로 했다.                        |
| 어드민 3 user_kick·unban       | 「고른 사유가 사용자에게 보이는 문구가 됩니다.」      | 추방 「활동 기록에 남습니다.」, 해제는 없음                               | `apps/admin/src/features/kick-member/ui/kick-member-dialog.tsx:127`                                                                                                                | 추방 창 사유 help를 「활동 기록에 남습니다.」로 바꾸고 차단 해제 창에는 안내를 두지 않았다.       |
| 어드민 3 nick_edit_conflict    | 모달 안 충돌 + 「사용자가 HH:mm에 먼저 바꿨습니다」   | 창 닫고 conflictToastText(사용자가 바꿨으면 「이미 처리된 닉네임입니다」) | `apps/admin/src/features/edit-nickname/ui/edit-nickname-dialog.tsx:95`<br>`apps/admin/src/shared/lib/conflict-toast-text.ts:12-15`                                                 | 충돌이면 창을 닫고 conflictToastText 토스트(본인이면 「이미 처리된 닉네임입니다」)로 알린다.      |
| 어드민 3 nick_edit             | 「사유:」 줄 미리보기 박스                            | NotificationPreview                                                       | `apps/admin/src/features/edit-nickname/ui/edit-nickname-dialog.tsx:178`                                                                                                            | 사유 미리보기 박스를 공용 NotificationPreview 컴포넌트로 바꿨다.                                  |

### A2

| 화면                                      | 시안                                   | 실제                                     | 코드 위치                                                                               | 수정 내용                                                                                                  |
| ----------------------------------------- | -------------------------------------- | ---------------------------------------- | --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| 어드민 2 cert_list                        | 전자책 형식 뱃지 primary               | 회색                                     | `apps/admin/src/views/cert-queue/ui/cert-queue-table.tsx:69`                            | 형식 뱃지를 색 없는 기본 Tag(회색)로 그려 분류색을 따로 주지 않는다.                                       |
| 어드민 2 cert·cert_reapply                | 머리말 「n / 전체」                    | 지움, [다음 건]                          | `apps/admin/src/views/cert-review/ui/cert-review-view.tsx:29`<br>`56`<br>`85`           | 머리에서 「n / 전체」를 지우고 NextItemButton([다음 건])만 actions에 둔다.                                 |
| 어드민 2 cert                             | 퀴즈 없으면 「등록된 퀴즈 없음」       | 줄 없음, 있으면 「퀴즈 · 질문 → 답」     | `apps/admin/src/views/cert-review/ui/applicant-card.tsx:56`                             | 퀴즈가 있을 때만 「퀴즈 · 질문 → 답」 줄을 그리고 없으면 줄을 만들지 않는다.                               |
| 어드민 2 cert_reject                      | 「사용자에게 보이는 사유 (선택)」      | 필수, 명세 도움말                        | `apps/admin/src/features/decide-cert/ui/cert-decision-form.tsx:97-98`                   | canReject가 사유 이름과 사용자 사유 입력이 모두 있어야 true라 반려 사유를 필수로 만들었다.                 |
| 어드민 2 cert_ebook_reject                | 사유 이름(시안 문구)                   | 명세 이름(「취소·환불된 주문입니다」 등) | `apps/admin/src/shared/lib/cert-reject-reasons.ts:29-40`                                | EBOOK_REJECT_REASONS의 사유 이름과 메시지를 명세 문구로 정의했다.                                          |
| 어드민 2 cert_proof_deleted·cert_conflict | 처리된 신청 위 노란 상자               | 없음                                     | `apps/admin/src/views/cert-review/ui/cert-review-view.tsx:89-95`                        | 처리된 신청 위에는 노란 상자를 그리지 않고 warning Callout은 별도 조건에서만 쓴다(이 줄은 코드 위치 추정). |
| 어드민 2 rules 계열                       | 「룰북 카탈로그」                      | 「룰북」                                 | `apps/admin/src/views/rulebooks/ui/rulebooks-view.tsx:98`                               | 화면 제목을 「룰북」으로 짧게 썼다.                                                                        |
| 어드민 2 rules_add·rules_req_add          | 미니룰 칸                              | 없음                                     | 코드 위치 미확인 (미니룰 칸 코드가 저장소에 없음)                                       | 코드 위치 미확인                                                                                           |
| 어드민 2 rules_add                        | 「…처리 내역은 활동 기록에 남습니다.」 | 「…요청자에게 알림 탭으로 알립니다.」    | `apps/admin/src/features/write-rulebook/ui/add-rulebook-form.tsx:71`<br>`160`           | 요청에서 추가할 때 안내 문구를 「요청자에게 알림 탭으로 알립니다.」로 바꾸고 recipients를 달았다.          |
| 어드민 2 seller_remove                    | 확인 창                                | 확인 없이 빼고 토스트                    | `apps/admin/src/features/manage-cert-sellers/ui/remove-seller-button.tsx:16-37`         | 확인 창 없이 바로 빼고 toast.success로 알린다(D291, 명세 기본안).                                          |
| 어드민 2 rule_impact_kind                 | 진행 중 구인도 보임                    | 자격 잃는 사람만                         | `apps/admin/src/shared/server/admin-data/kind-impact-losers.ts`<br>`get-kind-impact.ts` | kindImpactLosers가 종류를 바꿔 자격을 잃는 사람만 골라 영향 목록에 넣는다.                                 |

### W09

| 화면                   | 시안                     | 실제 | 코드 위치                                                | 수정 내용        |
| ---------------------- | ------------------------ | ---- | -------------------------------------------------------- | ---------------- |
| 09 B 이 달의 기록 제목 | i 아이콘(순위 기준 보기) | 없음 | 코드 위치 미확인 (아이콘이 없는 상태라 해당 코드가 없음) | 코드 위치 미확인 |

### A3-2

| 화면                       | 시안                                                                                                                                                                     | 실제                                                                                                                                                                                                 | 코드 위치                                                                                                                                                                                                                                                                                                                                             | 수정 내용                                                                                                                                |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| 어드민 3 sanction_panel    | back 「김코코」+sub, 안내 한 줄, 3번 「기본값은 모두 진행…」[참여 진행/참여 취소], 결과 「계속 진행하는 활동」「참여자 3명」, 하단 「제재 내역은 활동 기록에 남습니다.」 | 「유저 › {닉네임} ›」, 안내 두 줄, 「기본값은 구인 진행…」[그대로 진행/참여 빼기], 「그대로 진행하는 활동」「확정자·대기자 M명에게 알림 탭으로 알립니다」, 「확정하면 당사자의 알림 탭으로 알리고…」 | apps/admin/src/views/user-sanction/ui/user-sanction-view.tsx:15-21; apps/admin/src/features/sanction-user/ui/sanction-form.tsx:98; apps/admin/src/features/sanction-user/model/ongoing-choice-rows.ts:11-15; apps/admin/src/features/sanction-user/ui/sanction-summary.tsx:23,35; apps/admin/src/features/sanction-user/ui/sanction-user-form.tsx:135 | 헤더 trail을 유저 › 닉네임으로 잇고, 안내·선택지(그대로 진행/참여 빼기)·결과 라벨과 하단 문구를 명세 문구로 바꿨다                       |
| 어드민 3 sanction_preview  | 설명 한 줄, 「참여자 3명」                                                                                                                                               | 「{n}일 동안…」(+취소 구인 줄), 「확정자·대기자 M명」                                                                                                                                                | apps/admin/src/features/sanction-user/ui/sanction-confirm-dialog.tsx:43-57; apps/admin/src/features/sanction-user/ui/sanction-summary.tsx:20-35                                                                                                                                                                                                       | 확인 창 설명에 「{n}일 동안, {끝}까지…」를 넣고 취소 구인이 있으면 둘째 줄에 확정자·대기자 수를 알림 탭 안내와 함께 붙였다               |
| 어드민 3 sanction_release  | 「해제하는 즉시…」「38일 남음」, 메모 없음                                                                                                                               | 「…남은 제재를 지금 해제합니다」, 남은 기간+날짜, 「해제 사유 (운영진 기록)」+도움말, 메모 한 줄                                                                                                     | `apps/admin/src/features/release-sanction/ui/release-sanction-dialog.tsx:48-51`<br>`76-111`                                                                                                                                                                                                                                                           | 설명을 「{날짜}까지 남은 제재를 지금 해제합니다」로 바꾸고 FactBox에 남은 기간·날짜, ReasonChips 해제 사유와 운영진 메모 입력을 추가했다 |
| 어드민 3 sanction_conflict | 페이지 위 충돌 안내 + [닫기]/[새로고침]                                                                                                                                  | 유저 상세로 이동 후 토스트                                                                                                                                                                           | apps/admin/src/features/sanction-user/ui/sanction-user-form.tsx:95-102; apps/admin/src/shared/lib/conflict-toast-text.ts:11                                                                                                                                                                                                                           | 충돌이면 유저 상세로 router.push한 뒤 conflictToastText 문구로 toast.info만 띄우고 페이지 안 안내는 두지 않았다(D296)                    |

### W14

| 화면                                        | 시안                           | 실제                                                  | 코드 위치                                                                                                                       | 수정 내용                                                             |
| ------------------------------------------- | ------------------------------ | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| 14-B 남이 작성한 후기 카드 보조 줄          | 「작성일 9월 20일 · 수정됨」   | 「9월 20일 · 수정됨」                                 | `apps/web/src/views/reviews/model/review-card-text.ts:14`                                                                       | meta를 formatDate(createdAt)에 수정됨만 붙이고 「작성일」 접두를 뺐다 |
| 14-A 사진 hint                              | 끌기 상태에서만 「길게 눌러…」 | 사진 2장 이상이면 「길게 눌러 끌면 순서가 바뀝니다.」 | `apps/web/src/features/write-review/ui/review-photos-field.tsx:87-91`                                                           | photos.items.length > 1 일 때 항상 안내 문구를 보이게 했다            |
| 확정 예외 「사진 순서는 데스크톱 드래그만」 | —                              | 휴대폰 길게 눌러 끌기 추가                            | apps/web/src/features/write-review/model/use-long-press-reorder.ts; apps/web/src/features/write-review/ui/review-photo-tile.tsx | 길게 눌러 끌어 순서를 바꾸는 훅을 만들어 사진 타일에 연결했다         |

### W16

| 화면                              | 시안                                      | 실제                                                                 | 코드 위치                                                                                                           | 수정 내용                                                                       |
| --------------------------------- | ----------------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| 17 1b 비로그인·로그인 실패        | Callout danger                            | gray sm                                                              | `apps/web/src/views/server-join/ui/join-auth-error-notice.tsx:5`                                                    | Callout.Root를 colorPalette gray size sm으로 그렸다                             |
| 17 1/1b 비로그인 본문 둘째 줄     | 「{서버} 멤버라면 로그인만 하면 됩니다.」 | 「{서버} 디스코드 서버 멤버라면 로그인만 하면 바로 쓸 수 있습니다.」 | `apps/web/src/views/server-join/model/join-sheet-copy.ts:27`                                                        | signedOut 본문 둘째 줄을 명세 문구로 바꿨다                                     |
| 17 3b 가입 불가·초대 링크 없음    | 본문 두 줄                                | 「서버 운영진에게 초대를 요청해 주세요.」 줄 추가                    | apps/web/src/views/server-join/model/join-sheet-copy.ts:42; apps/admin/src/views/settings/ui/join-link-panel.tsx:45 | denied 본문에 초대 링크(hasInvite)가 없을 때만 초대 요청 줄을 끼워 넣었다(D104) |
| 16 기능 미리보기 알림 장          | 줄 1개                                    | 줄 2개(참여 확정·안 읽음, 세션 시간)                                 | apps/web/src/views/index/ui/features-section.tsx:17-20,72-95; apps/web/src/views/index/ui/notice-preview-row.tsx:30 | 알림 카드 미리보기를 NOTICES 두 줄(참여 확정, 세션 시간)로 늘렸다               |
| 16 할 수 있는 일 알림 카드 아이콘 | 시안 아이콘 칸                            | lucide Bell 둥근 칸                                                  | `apps/web/src/views/index/ui/features-section.tsx:83-85`                                                            | 시안 아이콘 대신 lucide Bell을 gray-100 둥근 칸에 넣었다 (DS 제약 성격도 있음)  |

### W05

| 화면                      | 시안                                 | 실제                                                | 코드 위치                                                                                                                                            | 수정 내용                                                  |
| ------------------------- | ------------------------------------ | --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| 05 E 시간대 hint          | 「세션 시작 시각 기준입니다. (KST)」 | 「(KST)」 없음                                      | `apps/web/src/views/games/ui/game-filter-sheet.tsx:118`                                                                                              | 시간대 hint에서 (KST)를 뺐다                               |
| 05 E 체크 보조 글         | 「…일정이 정해지지 않은 구인은…」    | 「…일정 미정인 구인은…」                            | `apps/web/src/views/games/ui/game-filter-sheet.tsx:160`                                                                                              | 보조 글을 「조율 중이거나 일정 미정인 구인은…」으로 줄였다 |
| 05 A·NEW 썸네일 없는 카드 | empty-my-games 그림 + 연한 primary   | OG 기본 이미지                                      | 코드 위치 미확인 (OG 기본 이미지 상수는 apps/web/src/shared/lib/og-image.ts, 파일 apps/web/public/og-thumbnail.png; 카드에서 쓰는 자리는 확인 못 함) | 썸네일 없는 카드에 OG 기본 이미지를 쓴다(D61)              |
| 05 D 검색 0건             | 「…직접 구인을 올려 보세요.」        | 「검색어를 바꾸거나 직접 구인을 올릴 수 있습니다.」 | `apps/web/src/views/games/ui/games-empty.tsx:52`                                                                                                     | 「~세요」 권유 문구를 「올릴 수 있습니다」로 바꿨다        |

### W02

| 화면                      | 시안                        | 실제                          | 코드 위치                                                     | 수정 내용                                                                    |
| ------------------------- | --------------------------- | ----------------------------- | ------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| 02-A 숨긴 구인 · 비참여자 | [구인 목록 보기] lg 전체 폭 | ErrorScreen 기본 outline 버튼 | `apps/web/src/views/game-detail/ui/game-hidden-view.tsx:7-24` | 없는 구인 화면과 같은 ErrorScreen에 outline 버튼 「구인 목록 보기」를 두었다 |

### W09-2

| 화면             | 시안                            | 실제                               | 코드 위치                                                | 수정 내용                                        |
| ---------------- | ------------------------------- | ---------------------------------- | -------------------------------------------------------- | ------------------------------------------------ |
| 09 A 취소됨 카드 | 안쪽만 opacity .6, 인원 줄 없음 | 카드 전체 opacity-72, 인원 줄 유지 | `apps/web/src/views/home/ui/home-session-card.tsx:22-25` | cancelled이면 Card.Root 전체에 opacity-72를 준다 |

### A4

| 화면                                  | 시안                                                | 실제                                                             | 코드 위치                                                                                                                           | 수정 내용                                                                                                           |
| ------------------------------------- | --------------------------------------------------- | ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| 어드민 4 posts                        | 운영진 조치 빈 칸 「—」                             | 비움                                                             | `apps/admin/src/views/posts/ui/posts-table.tsx:57`                                                                                  | 운영진 조치 열이 비면 「—」 없이 빈 칸으로 둔다                                                                     |
| 어드민 4 post_detail                  | 조치 카드·안내 문구(시안)                           | 명세 문구(숨김 효과 범위, 안내 한 줄)                            | apps/admin/src/features/moderate-post/model/action-copy.ts:17,24,31; apps/admin/src/views/post-detail/ui/post-actions-aside.tsx:48  | 조치별 설명을 ACTION_COPY의 명세 문구(숨김 효과 범위 등)로 둔다                                                     |
| 어드민 4 post_detail_sorted           | 「… 목록 안에서 2 / 14」, 「구인 목록 · 참여 ↓」    | 「구인 상세」, 경로 「구인」                                     | apps/admin/src/views/post-detail/ui/post-detail-view.tsx:61; apps/admin/src/views/post-detail/ui/post-detail-loading.tsx:20         | 정렬 위치 표시 없이 sub를 「구인 상세」(숨김 중이면 「숨김 중」)로 둔다(D278)                                       |
| 어드민 4 post_detail_members·waitlist | 「불참 횟수」「대기 순번」                          | 「최근 30일 불참」「목록 순서」                                  | `apps/admin/src/views/post-detail/ui/member-panel.tsx:36`<br>`38`                                                                   | 표 머리글을 「목록 순서」「최근 30일 불참」으로 바꿨다                                                              |
| 어드민 4 post_photo                   | 한 묶음                                             | 썸네일·본문 이미지 두 묶음                                       | apps/admin/src/views/post-detail/ui/post-summary.tsx:11,40; apps/admin/src/views/post-detail/ui/content-panel.tsx:61,72             | 사진 보기 묶음을 썸네일과 본문 이미지로 나눠 각각 subtitle을 붙였다                                                 |
| 어드민 4 act_hide·act_hide_etc        | 입력란, 「GM에게 알립니다.」, 기타면 메모 필수      | 칩 6개, 「GM의 알림 탭으로 알립니다.」, 기타 입력 필수·메모 선택 | `apps/admin/src/features/moderate-post/ui/post-hide-form.tsx:87-106`                                                                | 사유를 ReasonChips(CONTENT_REASON)로 고르게 하고 수신 문구를 바꿨으며 기타 입력을 사유로, 메모는 선택으로 뒀다      |
| 어드민 4 act_unhide                   | ItemCard 두 장                                      | 이력 한 줄 + 수정 시각 줄(데이터 없어 숨김)                      | apps/admin/src/features/moderate-post/ui/post-unhide-form.tsx:48-59; apps/admin/src/shared/server/admin-data/types.ts:180           | 숨긴 이력 한 줄 Card에 editedSinceHiddenAt이 있을 때만 수정 시각 줄을 보이는데 games에 칸이 없어 채우지 않는다(R42) |
| 어드민 4 act_remove                   | 「{제목} 구인을 취소할까요?」, 영향 두 줄, 간격 2px | 「구인 취소」, 영향 한 줄, 4px, 도움말, 미리보기 항상            | apps/admin/src/features/moderate-post/model/action-copy.ts:30; apps/admin/src/features/moderate-post/ui/post-remove-form.tsx:65-100 | 제목을 「구인 취소」로 하고 영향을 한 줄 Card로 줄였으며 NotificationPreview를 항상 보인다                          |
| 어드민 4 posts_toast_remove           | 「{제목}을 취소했습니다」                           | 「구인을 취소했습니다 · {제목}」                                 | `apps/admin/src/features/moderate-post/model/action-copy.ts:33`                                                                     | successMessage를 `구인을 취소했습니다 · ${title}`로 바꿨다                                                          |

### W13

| 화면                 | 시안                                        | 실제                                              | 코드 위치                                                                                                                            | 수정 내용                                                                                                 |
| -------------------- | ------------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------- |
| 13 U2 검색 결과 없음 | 추가 요청 콜아웃 숨김                       | 빈 결과 [추가 요청] 버튼과 하단 콜아웃 함께       | `apps/web/src/features/certify-rulebook/ui/book-picker.tsx:131-145`<br>`210-217`                                                     | 빈 결과의 [추가 요청] 버튼을 두면서 하단 「찾는 룰북이 목록에 없나요?」 Callout도 그대로 보인다           |
| 13 U3 퀴즈 책 표기   | 「더블크로스 3rd 2권」 한 줄                | 제목 「더블크로스 2권」 + 보조 「더블크로스 3rd」 | apps/web/src/features/certify-rulebook/ui/quiz-step.tsx:5-6,38,42; apps/web/src/features/certify-rulebook/ui/cert-apply-form.tsx:130 | bookTitle과 bookSub로 나눠 보조 줄에 「분류 판」을 넣었다 (제목에 권수를 만드는 자리는 정확히 확인 못 함) |
| 13 U7 시트 머리 안내 | 「"{검색어}"에 맞는 룰북이 없습니다」+ 안내 | 「추가되면 알림 탭으로 알립니다.」 한 줄          | `apps/web/src/features/certify-rulebook/ui/rulebook-request-sheet.tsx:97-99`                                                         | 시트 머리 안내를 「추가되면 알림 탭으로 알립니다.」 한 줄만 둔다                                          |
| 13 U1 반려 요청 줄   | 「09.28 처리 · 사유」 한 줄                 | 「MM.DD 처리」 아래 사유 한 줄                    | `apps/web/src/views/my-rulebooks/model/to-request-row.ts:28-35`                                                                      | 반려 행의 sub는 「MM.DD 처리」만 두고 반려 사유는 note 필드(rejectReason)로 분리해 아래 줄에 보인다.      |

### A2-2·3

| 화면                          | 시안                              | 실제                                            | 코드 위치                                                                                                                                                  | 수정 내용                                                                                                               |
| ----------------------------- | --------------------------------- | ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| 어드민 2 cert_revoke          | 「반려로 돌릴 책」 여러 권 체크   | 고른 행의 책 한 권                              | `apps/admin/src/features/revoke-certification/ui/revoke-cert-dialog.tsx:52-98`                                                                             | 다이얼로그가 체크 목록 없이 target 한 건(rulebookId·rulebook)만 받아 그 책 한 권을 반려로 돌린다.                       |
| 어드민 2 cert_manage_noresult | 보조 줄 「…바꿔 보세요.」         | 제목만                                          | `apps/admin/src/views/cert-manage/ui/cert-manage-table.tsx:58-62`                                                                                          | 검색 결과 없음 TableEmptyRow에서 description을 빼고 title 「조건에 맞는 인증이 없습니다」만 둔다.                       |
| 어드민 2 cert_grant           | 서플리먼트 책 카드 흐림           | 책은 고를 수 있고 기본 룰북 없는 사람 줄을 막음 | apps/admin/src/features/grant-certification/model/grant-candidate-status.ts:32 ; apps/admin/src/features/grant-certification/ui/grant-member-row.tsx:33-46 | 책 카드는 그대로 두고 supplementCoresOpened가 false인 사람은 blocked 상태로 줄에 opacity-50과 체크박스 disabled를 건다. |
| 어드민 2 cert_grant_done      | 「{닉네임}님에게 … 부여했습니다」 | 「{n}명에게 … 부여했습니다」                    | `apps/admin/src/features/grant-certification/model/grant-result-toast.ts:35`                                                                               | 토스트 제목을 닉네임 대신 granted.length 명수로 만든다.                                                                 |

### W07

| 화면                          | 시안                                                      | 실제                                              | 코드 위치                                                                                                                                                                           | 수정 내용                                                                                                               |
| ----------------------------- | --------------------------------------------------------- | ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| 07 E2 구인 취소 네트워크 오류 | 사유 칸 아래                                              | 본문 맨 위                                        | `apps/web/src/features/cancel-game/ui/cancel-game-dialog.tsx:66-72`                                                                                                                 | danger Callout 오류를 Field(사유 칸)보다 앞, 본문 맨 위에 둔다.                                                         |
| 07 E 구인 취소 확인           | "취소됨"(큰따옴표)                                        | 「취소됨」                                        | `apps/web/src/features/cancel-game/ui/cancel-game-dialog.tsx:40`                                                                                                                    | 안내 문구의 따옴표를 「취소됨」 꺾쇠로 쓴다.                                                                            |
| 07 D 세션 끝남 다음 세션 안내 | 관리 줄 카드 안                                           | 카드 아래 한 줄                                   | `apps/web/src/views/manage-game/ui/manage-game-view.tsx:63`<br>`108-111`                                                                                                            | showNextSessionHint일 때 카드 밖 아래에 「다음 세션은 새 구인을 열고…」 한 줄을 둔다.                                   |
| 07 D 취소됨                   | 「취소 사유」 칸                                          | 운영진·자동 취소면 「운영진이 취소한 구인입니다」 | apps/web/src/views/manage-game/ui/manage-cancel-note.tsx ; apps/web/src/widgets/session-list/model/cancel-sentence.ts:6 ; apps/web/src/views/manage-game/model/manage-summary.ts:45 | 취소 종류가 staff면 사유 칸 대신 고정 문장 「운영진이 취소한 구인입니다」를 보인다.                                     |
| 07 B 종료 칩 취소 카드        | 붉은 카드·danger 배지·「예정 · GM이 구인을 취소했습니다」 | 흐린 카드·gray 배지·「취소한 날 · 사유」          | `apps/web/src/widgets/session-list/model/to-cancelled-session-card.ts:14-37`                                                                                                        | 취소 카드를 muted 일정·gray 배지 「취소됨」·cancelled:true(흐림)로 만들고 일정줄을 취소한 날 + cancelSentence로 채운다. |
| 07 B 운영 탭 추첨 글 마감 뒤  | 「모집 마감」 gray                                        | 「모집 중」                                       | 코드 위치 미확인 (후보 apps/web/src/entities/game/model/session.ts:56-62 SESSION_STATE.recruiting)                                                                                  | 코드 위치 미확인.                                                                                                       |

### W10

| 화면                                           | 시안                                        | 실제                                            | 코드 위치                                                                                                      | 수정 내용                                                                                                        |
| ---------------------------------------------- | ------------------------------------------- | ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| 10 B after-session·rulebook-cert·notifications | 그림 있음                                   | 그림 없음                                       | apps/web/src/views/help/model/help-docs.tsx 해당 문서(after-session:374, rulebook-cert:446, notifications:662) | 코드 위치 미확인(해당 세 문서 블록에 figure 항목을 넣지 않은 것이 구현).                                         |
| 10 B status-glossary 운영 단계 색              | 조율 primary·기한 지남 warning·확정 success | MANAGE_STAGE_TONE(진행 중 primary, 나머지 gray) | apps/web/src/entities/game/model/manage-stage.ts:24-32 ; apps/web/src/views/help/ui/help-term-label.tsx:13     | 도움말 용어 표가 운영 단계 배지 색을 MANAGE_STAGE_TONE 한 표에서 가져오게 해 진행 중만 primary, 나머지는 gray다. |
| 10 B manage-roster 2·4단계                     | 시안 원고                                   | 명세 원고                                       | apps/web/src/views/help/model/help-docs.tsx:583-660 (slug manage-roster steps)                                 | 참여자 관리 문서 2·4단계 title·body를 명세 문구로 썼다.                                                          |
| 10 B after-session·profile-links               | 타이만·미니룰 줄 없음                       | 있음                                            | apps/web/src/views/help/model/help-docs.tsx:403-404 (after-session), :789 (profile-links)                      | 두 문서에 「1:1(타이만)…」「미니룰 세션…」 줄을 추가했다.                                                        |
| 10 B 목록 롤앤콜 소개                          | 따로 interactive Card                       | 카드 안 설명 달린 행                            | `apps/web/src/views/help/ui/help-list-view.tsx:26`<br>`49`                                                     | 소개를 별도 Card 대신 목록 카드 안 title 「롤앤콜 소개」 설명 행으로 넣었다.                                     |
| 10 A 2장                                       | 「추첨은 마감 때 뽑습니다.」                | 「…무작위로 뽑습니다.」                         | `apps/web/src/views/onboarding/model/onboarding-slides.tsx:37`                                                 | 2장 문구를 「추첨은 마감 때 무작위로 뽑습니다.」로 썼다.                                                         |

### W08

| 화면                  | 시안             | 실제       | 코드 위치                                                        | 수정 내용                                            |
| --------------------- | ---------------- | ---------- | ---------------------------------------------------------------- | ---------------------------------------------------- |
| 08 E 서버를 나간 멤버 | 아바타 보통 밝기 | opacity-50 | `apps/web/src/entities/profile/ui/departed-member-screen.tsx:16` | 나간 멤버 화면 Avatar에 className opacity-50을 준다. |

### A8

| 화면                               | 시안                                    | 실제                                          | 코드 위치                                                                                                                                 | 수정 내용                                                                                          |
| ---------------------------------- | --------------------------------------- | --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| 어드민 8 reviews_all 외            | 도구 줄에 검색만                        | 「사진 전체/있음/없음」 선택 추가             | `apps/admin/src/views/review-list/ui/review-list-view.tsx:56-61`                                                                          | 검색 입력 옆에 photo 파라미터 UrlSelect(allLabel 「사진 전체」)를 추가했다.                        |
| 어드민 8 reviews_all_noresult      | 「검색어를 바꿔 보세요.」+[필터 지우기] | 설명 없이 [필터 초기화]                       | apps/admin/src/views/review-list/model/review-empty-copy.ts:27-31 ; apps/admin/src/views/review-list/ui/review-list-view.tsx:37-47        | 필터 결과 없음에서 description을 undefined로 두고 resettable일 때만 「필터 초기화」 버튼을 보인다. |
| 어드민 8 reviews_all_loading       | 행 뼈대 6줄                             | 5줄, 사진 선택 비활성                         | `apps/admin/src/views/review-list/ui/review-list-loading.tsx:33-39`                                                                       | SkeletonTable rows를 5로 하고 SkeletonSelect 「사진 전체」를 둔다.                                 |
| 어드민 8 review_detail             | 「후기 상세 · n / 전체」                | 부제 없음, 「후기 › 전체 후기 › {구인 제목}」 | `apps/admin/src/views/review-detail/ui/review-detail-view.tsx:29-41`                                                                      | AdminHeader에 sub 대신 후기 › 전체 후기(숨긴 후기) › 구인 제목 이동 경로를 넘긴다.                 |
| 어드민 8 review_hide·review_remove | 라디오 2열 격자                         | ReasonChips(칩)                               | apps/admin/src/features/moderate-review/ui/review-hide-form.tsx:83 ; apps/admin/src/features/moderate-review/ui/review-remove-form.tsx:79 | 사유 선택을 라디오 격자 대신 공용 ReasonChips로 바꿨다.                                            |

### W06

| 화면                  | 시안                                  | 실제                                                     | 코드 위치                                                                           | 수정 내용                                                                                               |
| --------------------- | ------------------------------------- | -------------------------------------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| 06 A·B 1단계 머리말   | 「게임 정보」/「어떤 게임을…」        | 「구인 정보」/「어떤 세션을 얼마나 하는지 알려 주세요.」 | `apps/web/src/widgets/game-form/model/game-form-steps.ts:44`                        | 1단계 title을 「구인 정보」로, 머리말을 명세 문구로 썼다.                                               |
| 06 B 신청자 없음 안내 | 「…디스코드 공지도 다시 올라갑니다.」 | 「…디스코드 공지와 스레드 이름도 함께 고쳐집니다.」      | `apps/web/src/widgets/game-form/ui/edit-without-applicants-notice.tsx:9`            | 안내 문장을 「저장하면 디스코드 공지와 스레드 이름도 함께 고쳐집니다.」로 썼다.                         |
| 06 C 미인증 줄        | 눌러 펼치는 설명·인증 버튼            | 펼침 없는 비활성 줄                                      | 코드 위치 미확인 (후보 apps/web/src/widgets/game-form/ui/rulebook-sheet-option.tsx) | 코드 위치 미확인.                                                                                       |
| 06 C 배지             | 「인증 불필요」 gray                  | 「무료 배포」 primary, 심사 중·반려됨 추가               | `apps/web/src/widgets/game-form/model/rulebook-set-badge-of.ts:5-12`                | rulebookSetBadgeOf가 free면 「무료 배포」 primary, pending 「심사 중」, rejected 「반려됨」을 돌려준다. |
| 06 A 5단계            | 조율 시간대 칸 없음                   | 「조율 시간대」 칸 추가                                  | `apps/web/src/widgets/game-form/ui/coordination-window-field.tsx:41`                | Field.Root 「조율 시간대」에 시작·끝 시각 선택을 추가했다.                                              |

### W15

| 화면                            | 시안                                      | 실제                                                            | 코드 위치                                                                                                                                                                 | 수정 내용                                                                                            |
| ------------------------------- | ----------------------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| 15 D 획득 시트 단계+숨겨진 칭호 | multi 모양 행 목록                        | 머리 + 숨겨진 칭호 크게 + 단계 뱃지 칩 줄                       | apps/web/src/features/acknowledge-badges/ui/award-highlights.tsx:11-90 ; apps/web/src/features/acknowledge-badges/model/build-award-sheet.ts:20-24                        | 숨겨진 칭호는 gold 머리·메달 크게로 따로 묶고 나머지 단계는 BadgePill 칩 줄로 보인다.                |
| 15 D 첫 뱃지 시트               | 「첫 세션에 참석했습니다.」               | 「세션 1회 참석」+「세션을 마칠 때마다 업적이 쌓입니다.」+칩 줄 | apps/web/src/features/acknowledge-badges/ui/award-highlights.tsx:58-62,86 ; apps/web/src/features/acknowledge-badges/model/build-award-sheet.test.ts:32                   | 줄 문구를 criterion 「세션 1회 참석」으로 하고 숨겨진 칭호가 아니면 안내 한 줄과 칩 줄을 붙인다.     |
| 15 B 룰별·다양한 룰             | 「출석이 확정된 세션만 셉니다.」 누적에만 | 룰별·다양한 룰에도                                              | apps/web/src/entities/badge/model/attendance-hint.ts:2 ; apps/web/src/views/my-badges/ui/dex-role-tab.tsx:33,43 ; apps/web/src/views/my-badges/ui/dex-grid-section.tsx:29 | ATTENDANCE_HINT 상수를 도감 탭·그리드 섹션에 모두 같이 보인다.                                       |
| 15 B 이달의 카드(다는 중)       | 이번 달 줄 없음                           | 「10월 진행 n회 · 1위 n회」 추가                                | `apps/web/src/views/my-badges/model/monthly-card.ts:46`                                                                                                                   | monthLine을 「{월} {진행/참여} {count}회 · 1위 {topCount}회」로 만들어 카드에 추가했다.              |
| 15 C 이달의 뱃지 상세           | 「…다음 달 내내 답니다.」                 | 「M월 D일까지 프로필에 붙습니다.」                              | apps/web/src/features/view-badge/model/build-monthly-detail.ts:61 ; apps/web/src/views/my-badges/model/monthly-card.ts:58                                                 | 「내내」 문구를 지우고 말일을 계산해 「M월 D일까지 프로필에 붙습니다.」로 쓴다.                      |
| 15 E GM·PL 탭 이달의 기록       | 지금 다는 것만 한 줄                      | 「이달의 GM ×n / 받은 달 전체 / 다는 중 안내」                  | `apps/web/src/views/user-badges/model/monthly-row.ts:10-33`                                                                                                               | monthlyRow가 「이달의 GM ×n」 이름, 받은 달 전체 목록, 다는 중이면 말일까지 note를 한 행으로 만든다. |
| 15 도감 앱바 i 아이콘           | 있음                                      | 없음                                                            | `apps/web/src/views/my-badges/ui/my-badges-view.tsx:40`<br>`69`                                                                                                           | AppBar에 back과 title만 넘기고 도움말 i 아이콘을 넣지 않는다(C19 몫).                                |

### W03

| 화면                  | 시안                     | 실제                                            | 코드 위치                                                                                                                                                    | 수정 내용                                                                                  |
| --------------------- | ------------------------ | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| 03 P3 추첨 전         | 점선 카드 + 흐린 빈 격자 | 회색 Callout + 페이저 + 잠긴 「겹치는 시간」 탭 | apps/web/src/views/game-schedule/ui/schedule-body.tsx:73-98 ; apps/web/src/views/game-schedule/ui/schedule-tabs.tsx:35                                       | closed 모드에서 ScheduleNotice(Callout), WeekPager, disabled인 lockedTabs를 차례로 보인다. |
| 03 G 확인 창 확정 0명 | 주황 경고만              | 정원 미달 줄과 주황 경고 함께                   | `apps/web/src/features/confirm-session/ui/confirm-session-dialog-body.tsx:32-44`                                                                             | shortfall 줄(정원 n명 중 m명…)과 empty 주황 경고를 조건별로 둘 다 렌더한다.                |
| 03 P1 격자 자정 뒤 줄 | 모양 없음                | 시각 옆 작은 「+1」                             | 코드 위치 미확인 (후보 apps/web/src/features/confirm-session/model/session-time-options.ts:22, apps/web/src/widgets/game-form/model/window-end-options.ts:8) | 코드 위치 미확인.                                                                          |

## DS 제약 (15건)

디자인 시스템(`packages/ui`)에 맞는 부품·글씨 크기·토큰이 없어서 가장 가까운 것으로 대체한 것입니다.

### A1-2

| 화면                 | 시안               | 실제              | 코드 위치                                       | 수정 내용                                                        |
| -------------------- | ------------------ | ----------------- | ----------------------------------------------- | ---------------------------------------------------------------- |
| 어드민 1 c_sort_head | hover bg-secondary | hover:bg-gray-100 | `apps/admin/src/shared/ui/sortable-head.tsx:42` | 정렬 머리글 hover 배경을 가장 가까운 gray-100 토큰으로 지정했다. |

### W11

| 화면                  | 시안               | 실제         | 코드 위치                                                                | 수정 내용                                                                             |
| --------------------- | ------------------ | ------------ | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------- |
| 11 A-2 예정 종료 상자 | bg-secondary 상자  | Callout gray | `apps/web/src/features/end-session/ui/end-session-dialog-body.tsx:13-15` | 예정 종료 시각 상자를 직접 만든 박스 대신 DS Callout.Root colorPalette gray로 옮겼다. |
| 11 A 사유 입력        | TextInput sm(36px) | 기본 높이    | `apps/web/src/features/confirm-attendance/ui/attendance-row.tsx:97`      | DS TextInput에 size가 없어 36px 대신 기본 높이 TextInput을 쓴다.                      |

### A7

| 화면                           | 시안               | 실제                    | 코드 위치                                                               | 수정 내용                                                         |
| ------------------------------ | ------------------ | ----------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------- |
| 어드민 7 settings_staff_remove | 역할 Tag outline   | 기본 Tag                | `apps/admin/src/features/remove-staff/ui/remove-staff-dialog.tsx:67`    | DS Tag에 outline이 없어 역할을 기본 Tag로 보인다.                 |
| 어드민 7 settings_server_bot   | 잠긴 칸 opacity .5 | TextInput disabled 기본 | `apps/admin/src/features/edit-server-settings/ui/id-row.tsx:38`<br>`53` | 잠긴 칸을 opacity 대신 TextInput의 disabled 기본 모양으로 그린다. |

### A3

| 화면                   | 시안               | 실제               | 코드 위치                                            | 수정 내용                                                                     |
| ---------------------- | ------------------ | ------------------ | ---------------------------------------------------- | ----------------------------------------------------------------------------- |
| 어드민 3 users_loading | 정렬 머리글 그대로 | SkeletonTable 기본 | `apps/admin/src/views/users/ui/users-loading.tsx:36` | SkeletonTable에 SortableHead 자리가 없어 기본 머리글(sorted만 표시)로 그린다. |

### A2

| 화면                   | 시안                      | 실제                           | 코드 위치                                                                               | 수정 내용                                                                       |
| ---------------------- | ------------------------- | ------------------------------ | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| 어드민 2 판매처 휴지통 | IconButton outline danger | 아이콘만 outline danger Button | `apps/admin/src/features/manage-cert-sellers/ui/remove-seller-button.tsx:16`<br>`21-37` | IconButton에 danger가 없어 Trash2 아이콘만 든 outline danger Button으로 그렸다. |

### W09

| 화면                | 시안                                  | 실제                            | 코드 위치                                                    | 수정 내용                                                                                                    |
| ------------------- | ------------------------------------- | ------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| 09 B 동점자 시트 줄 | 손그림 button, 32px 아바타, 15px 이름 | Sheet.Item 링크 + ProfileRow md | `apps/web/src/views/home/ui/home-record-tie-sheet.tsx:41-47` | 손그림 button 대신 Sheet.Item을 ServerLink로 렌더해 줄 전체를 링크로 하고 안에 ProfileRow(기본 md)를 넣었다. |

### W16

| 화면                     | 시안                  | 실제                          | 코드 위치                                                                                  | 수정 내용                                                                    |
| ------------------------ | --------------------- | ----------------------------- | ------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------- |
| 서버 홈 앱바 배지 아이콘 | 배지 높이 맞는 아이콘 | ServerIcon size xs(16px) 신설 | apps/web/src/shared/ui/server-icon.tsx:6; apps/web/src/shared/ui/server-switcher.tsx:25,41 | ServerIcon에 xs(16px) 크기를 추가하고 앱바 서버 전환 배지에서 size xs를 쓴다 |

### W09-2

| 화면                                 | 시안                  | 실제                      | 코드 위치                                                                                                     | 수정 내용                                                                                 |
| ------------------------------------ | --------------------- | ------------------------- | ------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| 09 A 넓은 화면 칸 제목·「외 N」·알약 | 11px / 10.5px / 9.5px | body4(12px) / body5(10px) | `apps/web/src/views/home/ui/home-calendar-cell.tsx:71`<br>`81`<br>`89`<br>`110`                               | 임의 px 대신 Text typography body4·body5로 대체했다                                       |
| 09 A 숫자 알약 간격                  | gap 3px, 3·5px        | gap-050, pl-025·pr-050    | `apps/web/src/views/home/ui/home-calendar-cell.tsx:115`                                                       | 알약 클래스를 gap-050 pr-050 pl-025 토큰으로 썼다 (lint:tokens 때문이라 DS 제약으로 분류) |
| 09 A 내 세션 칸 제목 바탕            | (명세 tinted)         | bg-primary-100(시안 값)   | 코드 위치 미확인 (home-calendar-cell.tsx:48에 내 세션 칩 bg-primary-100이 있으나 칸 제목 바탕인지 확인 못 함) | 내 세션 칸 바탕을 tinted-bg 대신 bg-primary-100으로 둔 것으로 추정                        |

### W05-4

| 화면                             | 시안                     | 실제                             | 코드 위치                                                                                                                   | 수정 내용                                   |
| -------------------------------- | ------------------------ | -------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| 05 활동 정지 시트 사유·기간 상자 | 테두리 없는 bg-secondary | Card subtle(gray-50+얇은 테두리) | apps/web/src/views/games/ui/new-game-sanction-sheet.tsx:23; apps/web/src/views/create-game/ui/create-game-sanctioned.tsx:28 | 상자를 Card.Root background subtle로 바꿨다 |

### W13

| 화면               | 시안             | 실제                    | 코드 위치                                                           | 수정 내용                                                                 |
| ------------------ | ---------------- | ----------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| 13 U2 전체 룰 보기 | 굵은 텍스트 링크 | Button ghost primary sm | `apps/web/src/features/certify-rulebook/ui/book-picker.tsx:119-128` | 텍스트 링크 대신 Button variant ghost colorPalette primary size sm을 썼다 |

### A2-2·3

| 화면                 | 시안                                             | 실제                   | 코드 위치                                                        | 수정 내용                                                                          |
| -------------------- | ------------------------------------------------ | ---------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| 어드민 2 cert_manage | 판본 선택 「검색 가능」, 머리 보조 「인증 관리」 | 일반 Select, 서버 이름 | `apps/admin/src/views/cert-manage/ui/cert-manage-view.tsx:81-91` | 판본 필터를 UrlSelect(일반 Select)로 만들고 AdminHeader sub에 serverName을 넣는다. |

## 시안 없음 (13건)

시안에 해당 화면이 없어서 명세 문구나 판단으로 새로 만든 것입니다.

### A6

| 화면                     | 시안              | 실제                                | 코드 위치                                                 | 수정 내용                                                                         |
| ------------------------ | ----------------- | ----------------------------------- | --------------------------------------------------------- | --------------------------------------------------------------------------------- |
| 어드민 6 analytics_empty | 빈 상태 전용 화면 | 따로 없음(타일 0·빈 격자·초기 안내) | `apps/admin/src/views/analytics/ui/analytics-view.tsx:44` | 빈 상태 전용 뷰를 만들지 않고 같은 레이아웃에 EarlyNotice와 0 타일을 그대로 둔다. |

### W12

| 화면                                 | 시안 | 실제                                       | 코드 위치                                                                             | 수정 내용                                                                                                                   |
| ------------------------------------ | ---- | ------------------------------------------ | ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| (아트보드 없음) 신청자 0명 마감 결과 | 없음 | 제목 + 회색 Callout + [구인 글로 돌아가기] | `apps/web/src/views/draw-result/ui/empty-draw.tsx:12-24`<br>`back-to-game-bar.tsx:20` | 아트보드가 없어 결과 화면 머리 모양으로 제목, 회색 Callout 「신청자 없이 모집이 끝났습니다」, 하단 바 버튼을 새로 만들었다. |

### W14

| 화면                                               | 시안                      | 실제                                 | 코드 위치                                                                                                         | 수정 내용                                                                                                                                               |
| -------------------------------------------------- | ------------------------- | ------------------------------------ | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 14-C 숨김 카드 안내                                | 「…요청해 주세요. #문의」 | 채널 링크 없이 문구만                | `apps/web/src/views/my-reviews/model/my-review-card.ts:78-86`                                                     | 숨김 후기 콜아웃 줄을 「고친 뒤 디스코드로 해제를 요청해 주세요.」 문구만 두고 채널 링크는 만들지 않았다 (서버 설정에 문의 채널 칸 없음, 판단으로 분류) |
| (시안 없음) 숨긴 구인 세션 후기·비참여자           | 없음                      | 「운영진이 숨긴 구인입니다」 빈 화면 | `apps/web/src/views/reviews/ui/session-reviews-view.tsx:26-43`                                                    | game.hiddenAt이고 확정 참여자·GM이 아니면 EmptyState 「운영진이 숨긴 구인입니다」를 그린다(R7)                                                          |
| 14-B 시안 스크립트 filters·sessionGroups·photoMenu | 있음                      | 만들지 않음                          | 코드 위치 미확인 (만들지 않은 항목이라 해당 코드 없음; 후기 목록은 apps/web/src/views/reviews/ui/review-list.tsx) | 시안 스크립트용 필터·세션 묶음·사진 메뉴를 구현하지 않고 기획에 있는 목록만 만들었다                                                                    |

### W05

| 화면                 | 시안 | 실제 | 코드 위치                                                                                        | 수정 내용                                                                                                                |
| -------------------- | ---- | ---- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| 05 E 필터 칩 줄 간격 | 6px  | 12px | apps/web/src/views/games/ui/filter-section.tsx:10; apps/web/src/views/games/lib/chip-hit-area.ts | 칩 줄 간격을 12px로 벌려 CHIP_HIT_AREA 위아래 6px 누름 영역이 겹치지 않게 했다 (44px 누름 영역 판단, 시안 없음으로 분류) |

### W02

| 화면                                  | 시안             | 실제                   | 코드 위치                                                                                                                                                                                  | 수정 내용                                                                                               |
| ------------------------------------- | ---------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| 02-C 일정 확정 · 추첨 전(직접 확정만) | [결과 보러 가기] | 조율형이면 [일정 보기] | apps/web/src/views/game-detail/model/confirmed-action-view.ts:36-45; apps/web/src/views/game-detail/ui/scheduled-actions.tsx:47; apps/web/src/views/game-detail/ui/draw-result-link.tsx:21 | 추첨 뒤(resultLink)에만 [결과 보러 가기]를, 조율형이면서 추첨 전(scheduleLink)에는 [일정 보기]를 보인다 |

### A2-2·3

| 화면                | 시안                  | 실제             | 코드 위치                                                                    | 수정 내용                                                                   |
| ------------------- | --------------------- | ---------------- | ---------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| 어드민 2 cert_grant | 알림 미리보기 늘 보임 | 룰북 고른 뒤에만 | `apps/admin/src/features/grant-certification/ui/grant-cert-form.tsx:160-169` | NotificationPreview를 book이 있을 때만 렌더해 빈 상태 문구를 만들지 않는다. |

### W10

| 화면             | 시안         | 실제                                    | 코드 위치                                                                                                   | 수정 내용                                                                                                     |
| ---------------- | ------------ | --------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| 10 B 문의 카드   | 버튼 없음    | 초대 링크 있으면 [{서버} 디스코드 열기] | apps/web/src/views/help/ui/help-list-view.tsx:87-92 ; apps/web/src/views/help/api/load-help-server.ts:18-19 | 서버 inviteUrl이 있을 때만 「{server.name} 디스코드 열기」 링크 버튼을 렌더한다(기획자 판단).                 |
| 10 A 온보딩 배치 | 412×800 고정 | 작은 화면은 내용만 스크롤, 버튼 고정    | `apps/web/src/views/onboarding/ui/onboarding-view.tsx:80-81`                                                | 컨테이너를 flex-col min-h-0로 두고 내용 영역만 overflow-y-auto로 스크롤시켜 버튼 줄을 고정한다(320×568 대응). |

### A8

| 화면                       | 시안                    | 실제                           | 코드 위치                                                                                                                      | 수정 내용                                                                                          |
| -------------------------- | ----------------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| 어드민 8 reviews_all 열 폭 | 작성 시각 124, 상태 264 | 168·168·사진 64, 본문만 늘어남 | apps/admin/src/views/review-list/ui/review-table.tsx:25-30 ; apps/admin/src/views/review-list/ui/review-list-loading.tsx:41-47 | 열 fixed 폭을 작성 시각 168·사진 64·상태 168로 정해 남는 폭이 본문 열로 가게 했다(날짜 잘림 방지). |

### W06

| 화면                          | 시안                         | 실제                       | 코드 위치                                                                                                                        | 수정 내용                                                                                                                          |
| ----------------------------- | ---------------------------- | -------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| 06 B 수정 3/5 이미지          | 수정 때 스포일러 스위치 숨김 | 보임(썸네일 없으면 비활성) | apps/web/src/widgets/game-form/ui/thumbnail-spoiler-field.tsx:11-32 ; apps/web/src/widgets/game-form/ui/game-media-fields.tsx:27 | 수정에서도 스위치를 렌더하고 thumbnailUrl이 없으면 disabled로 한다(명세에 숨김 규칙 없음).                                         |
| 06 C 검색 결과 없음·수정 잠김 | 아트보드 없음                | 명세 문구 + EmptyState     | apps/web/src/widgets/game-form/ui/game-rulebook-sheet.tsx:78-90 ; apps/web/src/features/write-game/model/edit-block-reason.ts:77 | 검색 결과 없음을 EmptyState 「맞는 룰이 없습니다」+룰북 추가 요청 버튼으로, 수정 잠김 문구는 edit-block-reason에 명세 문구로 썼다. |

## 기존 유지 (13건)

이미 있던 화면·규칙·예외를 그대로 둔 것입니다.

### C02-3

| 화면                        | 시안                              | 실제                                  | 코드 위치                                                                     | 수정 내용                                                                                            |
| --------------------------- | --------------------------------- | ------------------------------------- | ----------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| 11 출석 확인 · 확정 뒤 읽기 | [다시 고치기] 누른 뒤 토스트 없음 | 「다시 고칠 수 있습니다」 토스트가 뜸 | `apps/web/src/features/confirm-attendance/ui/reopen-attendance-button.tsx:19` | toast.success로 「다시 고칠 수 있습니다」를 띄우는 기존 한 줄을 그대로 두었다(지우면 시안과 같아짐). |

### C01-4

| 화면       | 시안                              | 실제                                                              | 코드 위치                                                              | 수정 내용                                                                                |
| ---------- | --------------------------------- | ----------------------------------------------------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| 17 welcome | 버튼 바가 본문 아래 border-top 줄 | 기존 FloatingBar(바닥 고정) 유지, 버튼 배치·폭·variant는 시안대로 | `apps/web/src/views/server-welcome/ui/welcome-username-form.tsx:60-79` | FloatingBar.Root(elevated=false) 안에 두 버튼을 flex-1로 배치해 하단 고정 바를 유지했다. |

### C03-3

| 화면                  | 시안                       | 실제                                              | 코드 위치                                                              | 수정 내용                                                                                                             |
| --------------------- | -------------------------- | ------------------------------------------------- | ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| 19 알림 · 라우트 로딩 | [할 일] 진입이면 카드 뼈대 | 라우트 로딩은 늘 줄 뼈대(화면 안 Suspense는 탭별) | `apps/web/src/app/(app)/[server]/(public)/notifications/loading.tsx:4` | loading.tsx가 searchParams를 몰라 NotificationsSkeleton(줄 뼈대) 하나만 렌더하고 탭별 뼈대는 화면 안 Suspense에 둔다. |

### W04

| 화면                    | 시안                   | 실제            | 코드 위치                                                             | 수정 내용                                                             |
| ----------------------- | ---------------------- | --------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------- |
| 04 D 대기 줄 aria-label | 「{이름} 대기자 메뉴」 | 「{이름} 메뉴」 | `apps/web/src/views/manage-participants/ui/member-menu-button.tsx:12` | 확정·대기 공용 메뉴 버튼의 aria-label을 「{username} 메뉴」로 두었다. |

### A5

| 화면                  | 시안                  | 실제                     | 코드 위치                                                                                                                                    | 수정 내용                                                                             |
| --------------------- | --------------------- | ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| 어드민 5 ns_edit 계열 | 모달에 서버 라벨 없음 | ModalServerLabel         | `apps/admin/src/features/cancel-no-show/ui/no-show-reason-form.tsx:64`<br>`apps/admin/src/features/moderate-post/ui/post-unhide-form.tsx:42` | 어드민 모달 규칙에 따라 폼 상단에 ModalServerLabel을 렌더한다.                        |
| 어드민 5 ns_add_err   | 오류 한 줄            | ActionNetworkError 두 줄 | `apps/admin/src/shared/ui/action-network-error.tsx:4-15`<br>`apps/admin/src/features/add-no-show/ui/add-no-show-form.tsx:90`                 | 불참 기록 추가 폼도 A1의 공용 ActionNetworkError(두 줄 danger Callout)를 그대로 쓴다. |

### W11

| 화면                            | 시안                   | 실제              | 코드 위치                                                                   | 수정 내용                                                                                                           |
| ------------------------------- | ---------------------- | ----------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| 11 B-2 다시 고치는 중 머리 배지 | 「고치는 중」(primary) | 「확정됨」 그대로 | `apps/web/src/views/game-attendance/ui/attendance-header.tsx:16`<br>`32`    | 다시 고치는 중에도 배지를 attendanceConfirmed 기준 「확정됨」(success)으로 그대로 둔다(명세 범위 밖이라 기존 유지). |
| 11 A 운영진 취소 행 안내        | 이름 아래 note         | 줄 아래 hint      | `apps/web/src/features/confirm-attendance/ui/attendance-row-note.tsx:10-27` | 운영진 취소 안내를 이름 아래 note가 아니라 줄 아래 body4 hint 한 줄로 그려 다른 안내와 같은 자리에 맞췄다.          |

### A7

| 화면                             | 시안                      | 실제                                   | 코드 위치                                                                                                                         | 수정 내용                                                                                                        |
| -------------------------------- | ------------------------- | -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| 어드민 7 log_range_empty         | 표 아래 별도 칸           | 표 안 빈 행                            | `apps/admin/src/views/audit-log/ui/audit-log-table.tsx:47`<br>`audit-log-empty.tsx`                                               | 빈 결과를 표 아래 칸이 아니라 Table 본문 안에 empty 노드(AuditLogEmpty)로 그린다.                                |
| 어드민 7 settings_server_loading | 채널 이름 자리만 스켈레톤 | 기본 정보(이름·slug·아이콘)도 스켈레톤 | `apps/admin/src/views/settings/ui/server-settings-loading.tsx:22-24`<br>`apps/admin/src/app/[server]/settings/server/loading.tsx` | loading.tsx가 서버 값을 모르므로 ServerBasicPanel도 loading 스켈레톤으로 그린다(분류는 가장 가까운 것으로 고름). |

### W05

| 화면      | 시안                           | 실제               | 코드 위치                                             | 수정 내용                                           |
| --------- | ------------------------------ | ------------------ | ----------------------------------------------------- | --------------------------------------------------- |
| 05 A 앱바 | 「구인 목록」 글자 + 서버 배지 | 워드마크 로고 유지 | `apps/web/src/views/games/ui/games-app-bar.tsx:11-13` | AppBar에 brand를 켜서 기존 워드마크 로고를 유지했다 |

### W09-2

| 화면         | 시안            | 실제         | 코드 위치                                         | 수정 내용                                               |
| ------------ | --------------- | ------------ | ------------------------------------------------- | ------------------------------------------------------- |
| 09 C 칸 뼈대 | 칸 안 작은 뼈대 | 칸 전체 뼈대 | `apps/web/src/views/home/ui/home-calendar.tsx:94` | 칸마다 Skeleton을 h-12 md:h-19(칸 높이 그대로)로 그린다 |

### W10

| 화면                            | 시안      | 실제                         | 코드 위치                                                                                                   | 수정 내용                                                         |
| ------------------------------- | --------- | ---------------------------- | ----------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| 10 B status-glossary 「취소됨」 | gray 배지 | GameStatusBadge danger(빨강) | apps/web/src/views/help/ui/help-term-label.tsx:3,13 ; apps/web/src/entities/game/model/game-status-color.ts | 취소됨 행은 기존 GameStatusBadge의 상태 색(danger)을 그대로 쓴다. |

## 외부 자산 (1건)

공식 아이콘 등 외부 자산이 저장소에 없어서 자리표시로 둔 것입니다.

### W02

| 화면                    | 시안                  | 실제                            | 코드 위치                                                                                                                                              | 수정 내용                                                              |
| ----------------------- | --------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------- |
| 02-E 캘린더 시트 아이콘 | 구글 캘린더·Apple SVG | 회색 자리표시 SVG(public/brand) | apps/web/src/features/add-to-calendar/ui/add-to-calendar-sheet.tsx:104,110; apps/web/public/brand/google-calendar.svg; apps/web/public/brand/apple.svg | 공식 아이콘 대신 public/brand의 회색 자리표시 SVG를 iconSrc로 연결했다 |

## 사용자 결정 (6건)

사용자가 직접 정한 것입니다.

### C03-3

| 화면                   | 시안               | 실제                                 | 코드 위치                                                  | 수정 내용                                                                                                                 |
| ---------------------- | ------------------ | ------------------------------------ | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| 19 알림 · [할 일] 오류 | (명세엔 설명 없음) | 「잠시 뒤 다시 시도해 주세요.」 설명 | `apps/web/src/views/notifications/ui/todo-panel.tsx:24-25` | 오류 상태에 시안대로 「잠시 뒤 다시 시도해 주세요.」 description을 붙였다(비고 시안을 따른 것이라 시안 없음 성격도 있음). |

### W04

| 화면                            | 시안                    | 실제                  | 코드 위치                                                        | 수정 내용                                                                                           |
| ------------------------------- | ----------------------- | --------------------- | ---------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| 04 D 시작 뒤 [참여자 추가] 흐림 | 정원 이미 늘림이면 흐림 | 늘렸고 정원 찼을 때만 | `apps/web/src/views/manage-participants/ui/roster-queues.tsx:61` | addDisabled를 started && isFull && capacityRaised로 계산해 불참 처리로 자리가 나면 버튼이 살아난다. |

### W15

| 화면                    | 시안                 | 실제                                                                                | 코드 위치                                             | 수정 내용                                                                                             |
| ----------------------- | -------------------- | ----------------------------------------------------------------------------------- | ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| 07 마이페이지 업적 블록 | 이번 달 줄·안내 없음 | 이번 달 PL·GM 줄은 2026-10-05 사용자 요청으로 삭제(시안과 같아짐), 출석 안내는 유지 | `apps/web/src/views/my-page/ui/my-page-badges.tsx:51` | 마이페이지 업적 섹션에서 이번 달 PL·GM 줄을 지우고 ATTENDANCE_HINT 출석 안내만 남겼다(커밋 5a5025e0). |
| 07 마이페이지 업적 제목 옆 새 뱃지 점 | 새 뱃지가 있으면 점 | 점 없음 | `apps/web/src/views/my-page/ui/my-page-badges.tsx` | 읽지 않음 판단 데이터가 없고 2026-10-08 사용자 결정으로 점을 만들지 않았다. |
| 07 마이페이지 「진행한 세션 후기」 행 | 항상 표시 | 운영 기록이 있을 때만 표시 | `apps/web/src/views/my-page/ui/my-page-reviews.tsx:23` | 2026-10-08 사용자 결정으로 운영 기록이 없으면 숨기는 동작을 유지했다. |
| 03 확인 창 실패 상태 | 「확정하지 못했습니다. 잠시 뒤 다시 시도해 주세요.」 | 「확정하지 못했습니다.」 아래에 서버가 준 사유를 그대로 보인다(변경은 「시간을 바꾸지 못했습니다.」) | `apps/web/src/features/confirm-session/ui/confirm-session-form.tsx`<br>`apps/web/src/features/confirm-session/ui/fixed-session-change-form.tsx` | 모집 마감 앞 시각처럼 다시 시도해도 풀리지 않는 거절 사유가 있어 고정 문구 대신 서버 문구를 보인다. 변경 쪽 제목 문구는 시안에 없어 확정 쪽을 따라 지었다. |

### 사유분리

| 화면                                | 시안                            | 실제                                                    | 코드 위치                                                                                                                                                                                                        | 수정 내용                                                                                                             |
| ----------------------------------- | ------------------------------- | ------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| 어드민 4 구인 취소 사유 「기타」    | 사유 라디오 + 운영진 메모(필수) | 입력은 그대로, 저장은 메모를 사유 글(「기타 · 메모」)로 | apps/admin/src/features/moderate-post/ui/post-remove-form.tsx:43-44,77-80 ; packages/database/src/modules/moderation/model/reason-label.ts:15-17                                                                 | 화면 입력은 그대로 두고 draftReason이 기타일 때 메모를 사유 글로 저장하며 reasonLabel이 「기타 · 입력」으로 표시한다. |
| 제재·추방·닉네임 「기타」 알림·기록 | 입력한 글만                     | 「기타 · {입력}」                                       | packages/database/src/modules/moderation/model/reason-label.ts:15-17 ; apps/admin/src/features/kick-member/ui/kick-member-dialog.tsx:120 ; apps/admin/src/features/edit-nickname/ui/edit-nickname-dialog.tsx:157 | 알림·기록에 쓰는 reasonLabel이 코드와 글을 「{사유} · {글}」로 합쳐 기타는 「기타 · {입력}」이 된다.                  |

### 반려유지

| 화면                           | 시안           | 실제                                        | 코드 위치                                                                                                                               | 수정 내용                                                                                                          |
| ------------------------------ | -------------- | ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| 어드민 2 반려로 돌리기 창 사유 | 자유 입력 하나 | 반려 사유 칩(심사 목록+기타)+미리 채운 사유 | apps/admin/src/features/revoke-certification/ui/revoke-cert-dialog.tsx:52,105-125 ; apps/admin/src/shared/lib/cert-reject-reasons.ts:11 | ReasonChips에 REJECT_REASONS(전자책은 EBOOK_REJECT_REASONS)를 주고 칩을 고르면 사용자 사유 Textarea를 미리 채운다. |
