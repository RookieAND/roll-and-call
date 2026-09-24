import { POST_STATUS } from "./post-status";
import type { AdminUser, AuditEntry, Report, Session } from "./types";

interface PostsSeedTarget {
  users: AdminUser[];
  sessions: Session[];
  reports: Report[];
  auditLog: AuditEntry[];
}

const at = (iso: string) => new Date(`${iso}+09:00`);

const INN_SYNOPSIS =
  "비 내리는 산길, 불빛 하나 없는 여관에 여섯 사람이 모입니다. 주인은 오늘 밤만은 2층에 올라가지 말라고 당부합니다.";
const INN_NOTICES = [
  "전투는 거의 없고 조사와 대화 위주로 진행됩니다.",
  "호러 묘사가 포함되며, 잔혹한 장면은 참가자 합의에 따라 조절합니다.",
  "3~4시간 예상, 초보자도 환영합니다.",
];

// 구인 화면용 목업. 이미 있는 세션에 구인 내용을 채우고, 신고·숨김·수정 요청을 재현할 구인을 더한다.
// ponytail: HMR로 모듈만 다시 읽혀도 한 번만 들어가도록 post-inn 존재로 막는다.
export function seedPosts(target: PostsSeedTarget) {
  if (target.sessions.some((session) => session.id === "post-inn")) return;
  const userId = (nickname: string) => target.users.find((user) => user.nickname === nickname)!.id;

  const rows = [
    [
      "post-inn",
      "붉은 여관의 밤",
      "더블크로스 3rd",
      "2026-09-27T20:00",
      "달빛토끼",
      ["김코코", "새벽세시", "파란우산", "조용한관측자"],
      ["하얀고래", "모래시계"],
      5,
      POST_STATUS.recruiting,
    ],
    [
      "post-inn-2",
      "붉은 여관의 밤 2부",
      "더블크로스 3rd",
      "2026-10-18T20:00",
      "달빛토끼",
      ["모래시계"],
      [],
      5,
      POST_STATUS.recruiting,
    ],
    [
      "post-fog",
      "안개 낀 등대",
      "크툴루의 부름 7판",
      "2026-10-02T21:00",
      "조용한관측자",
      ["김코코", "하얀고래", "붉은자물쇠"],
      [],
      5,
      POST_STATUS.recruiting,
    ],
    [
      "post-room",
      "13번째 방",
      "크툴루의 부름 6판",
      "2026-09-30T20:00",
      "김코코",
      ["새벽세시", "모래시계"],
      [],
      4,
      POST_STATUS.recruiting,
    ],
    [
      "post-insane",
      "인세인 단편 3부작",
      "인세인",
      "2026-10-06T20:00",
      "이름없는GM",
      ["김코코", "파란우산", "하얀고래", "오후の산책"],
      [],
      5,
      POST_STATUS.scheduling,
    ],
    [
      "post-magica",
      "마기카로기아 입문편",
      "마기카로기아",
      "2026-10-09T19:30",
      "새벽세시",
      ["열두시의종", "파란우산"],
      [],
      4,
      POST_STATUS.recruiting,
    ],
    [
      "post-fog-again",
      "안개 낀 등대 재개",
      "크툴루의 부름 7판",
      "2026-10-25T20:00",
      "파란우산",
      [],
      [],
      5,
      POST_STATUS.recruiting,
    ],
  ] as const;

  for (const [id, title, rulebook, startsAt, gm, members, waiting, capacity, status] of rows) {
    target.sessions.push({
      id,
      title,
      rulebook,
      gmId: userId(gm),
      startsAt: at(`${startsAt}:00`),
      memberIds: members.map(userId),
      waitingIds: waiting.map(userId),
      capacity,
      closed: false,
      recruitStatus: status,
      createdAt: at("2026-09-18T12:00:00"),
      recruitMethod: "선착순",
      expectedHours: 4,
    });
  }

  const session = (id: string) => target.sessions.find((candidate) => candidate.id === id)!;
  Object.assign(session("post-inn"), {
    recruitDeadline: at("2026-09-26T22:00:00"),
    synopsis: INN_SYNOPSIS,
    notices: INN_NOTICES,
    imageUrls: ["", ""],
  });
  Object.assign(session("post-inn-2"), {
    synopsis: INN_SYNOPSIS,
    notices: INN_NOTICES,
    editRequestedAt: at("2026-09-22T10:10:00"),
    hidden: {
      reason: "세션 내용과 관계없는 선정적인 이미지가 썸네일로 쓰였습니다.",
      by: "새벽세시",
      at: at("2026-09-22T10:20:00"),
    },
    gmEditSinceHidden: {
      title: "GM이 썸네일을 교체했습니다",
      body: "수정 요청을 받은 뒤 새 이미지를 올렸습니다.",
      at: at("2026-09-22T16:40:00"),
    },
  });
  session("post-fog").editRequestedAt = at("2026-09-21T15:00:00");
  session("post-room").editRequestedAt = at("2026-09-20T11:00:00");
  session("u-room").recruitStatus = POST_STATUS.scheduling;

  const reportRows = [
    [
      "post-inn",
      "붉은자물쇠",
      "2026-09-21T18:02",
      "부적절한 표현",
      "시놉시스에 특정 집단을 비하하는 표현이 있어요.",
      false,
    ],
    [
      "post-inn",
      "김코코",
      "2026-09-21T20:41",
      "부적절한 표현",
      "썸네일 이미지가 세션 내용과 관계없이 선정적으로 보입니다. 미리보기에서 바로 보여서 불편했어요.",
      false,
    ],
    [
      "post-inn",
      "조용한관측자",
      "2026-09-22T09:12",
      "스포일러",
      "본문 이미지에 시나리오 결말이 그대로 적혀 있어요.",
      false,
    ],
    [
      "u-train",
      "하얀고래",
      "2026-09-23T13:30",
      "부적절한 표현",
      "제목과 시놉시스가 다른 구인을 그대로 베낀 것 같아요.",
      false,
    ],
    ["post-inn-2", "파란우산", "2026-09-21T23:05", "부적절한 표현", "썸네일이 선정적이에요.", true],
  ] as const;
  for (const [sessionId, reporter, reportedAt, category, detail, resolved] of reportRows) {
    target.reports.push({
      id: `p${target.reports.length + 1}`,
      sessionId,
      reporterId: userId(reporter),
      reportedAt: at(`${reportedAt}:00`),
      category,
      detail,
      resolved,
      ...(resolved ? { resolvedBy: "새벽세시", resolvedAt: at("2026-09-22T10:20:00") } : {}),
    });
  }
  const legacyDetails = [
    ["탐정놀이중", "스포일러", "시놉시스에 시나리오 결말이 그대로 적혀 있어요."],
    ["오후の산책", "부적절한 표현", "안내 사항에 참가자를 깎아내리는 말이 있어요."],
  ] as const;
  target.reports.slice(0, legacyDetails.length).forEach((report, index) => {
    const [reporter, category, detail] = legacyDetails[index]!;
    report.reporterId ??= userId(reporter);
    report.category ??= category;
    report.detail ??= detail;
  });

  target.auditLog.push(
    {
      id: "a-post-hide",
      at: at("2026-09-22T10:20:00"),
      actor: "새벽세시",
      action: "구인 숨김",
      target: "붉은 여관의 밤 2부 · GM 달빛토끼",
      reason: "세션 내용과 관계없는 선정적인 이미지가 썸네일로 쓰였습니다.",
    },
    {
      id: "a-post-edit",
      at: at("2026-09-22T10:10:00"),
      actor: "새벽세시",
      action: "구인 수정 요청",
      target: "붉은 여관의 밤 2부 · GM 달빛토끼",
      reason: "선정적인 썸네일 이미지",
    },
  );
  target.auditLog.sort((a, b) => b.at.getTime() - a.at.getTime());
}
